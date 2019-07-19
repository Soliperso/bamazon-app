// Dependecies
// --------------------------------------------------
var mysql = require('mysql');
var inquirer = require('inquirer');

// Data Configuration
// --------------------------------------------------
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon_db"
});

function displayProducts() {
  inquirer.prompt([{
    type: "list",
    name: "doThing",
    message: "What would you like to do?",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "End Session"]
  }]).then(function (answer) {
    switch (answer.doThing) {
      case "View Products for Sale":
        viewProducts();
        break;
      case "View Low Inventory":
        viewLowInventory();
        break;
      case "Add to Inventory":
        addToInventory();
        break;
      case "Add New Product":
        addNewProduct();
        break;
      case "End Session":
        console.log('Bye!');
    }
  });
}

//views all inventory
function viewProducts() {
  console.log('============== VIEW PRODUCTS ====================');

  connection.query('SELECT * FROM Products', function (err, products) {
    if (err) throw err;
    console.log('----------------------------------------------------------------------------------------------------')

    for (var i = 0; i < products.length; i++) {
      console.log("id: " + products[i].id + " | " + "Product: " + products[i].product_name + " | " + "Department: " + products[i].department_name + " | " + "price: " + products[i].price + " | " + "QTY: " + products[i].stock_quantity);
      console.log('--------------------------------------------------------------------------------------------------')
    }

    displayProducts();
  });
}

//views inventory lower than 5
function viewLowInventory() {
  console.log('============== VIEW LOW INVENTORY ====================');

  connection.query('SELECT * FROM Products', function (err, products) {
    if (err) throw err;
    console.log('----------------------------------------------------------------------------------------------------')

    for (var i = 0; i < products.length; i++) {
      if (products[i].stock_quantity <= 5) {
        console.log("id: " + products[i].id + " | " + "Product: " + products[i].product_name + " | " + "Department: " + products[i].department_name + " | " + "price: " + products[i].price + " | " + "QTY: " + products[i].stock_quantity);
        console.log('--------------------------------------------------------------------------------------------------');
      }
    }

    displayProducts();
  });
}

//displays prompt to add more of an item to the store and asks how much
function addToInventory() {
  console.log('============== ADDING TO THE INVENTORY ====================');

  connection.query('SELECT * FROM Products', function (err, products) {
    if (err) throw err;
    var itemArray = [];
    //pushes each item into an itemArray
    for (var i = 0; i < products.length; i++) {
      itemArray.push(products[i].product_name);
    }

    inquirer.prompt([{
      type: "list",
      name: "product",
      choices: itemArray,
      message: "Which item would you like to add to the inventory?"
    }, {
      type: "input",
      name: "qty",
      message: "How much would you like to add?",
      validate: function (val) {
        if (isNaN(val) === false) {
          return true;
        } else {
          return false;
        }
      }
    }]).then(function (answer) {
      var currentQty;
      for (var i = 0; i < products.length; i++) {
        if (products[i].product_name === answer.product) {
          currentQty = products[i].stock_quantity;
        }
      }
      connection.query('UPDATE Products SET ? WHERE ?', [{
          stock_quantity: currentQty + parseInt(answer.qty)
        },
        {
          product_name: answer.product
        }
      ], function (err, products) {
        if (err) throw err;
        console.log('The quantity was updated.');
        displayProducts();
      });
    })
  });
}

//allows manager to add a completely new product to store
function addNewProduct() {
  console.log('============== ADDING NEW PRODUCTS ====================');
  var deptNames = [];

  //grab name of departments
  connection.query('SELECT * FROM departments', function (err, products) {
    if (err) throw err;
    for (var i = 0; i < products.length; i++) {
      deptNames.push(products[i].department_name);
    }
  })

  inquirer.prompt([{
    type: "input",
    name: "product",
    message: "Product: ",
    validate: function (val) {
      if (val) {
        return true;
      } else {
        return false;
      }
    }
  }, {
    type: "list",
    name: "department",
    message: "Department: ",
    choices: deptNames
  }, {
    type: "input",
    name: "price",
    message: "price: ",
    validate: function (val) {
      if (isNaN(val) === false) {
        return true;
      } else {
        return false;
      }
    }
  }, {
    type: "input",
    name: "quantity",
    message: "Quantity: ",
    validate: function (val) {
      if (isNaN(val) == false) {
        return true;
      } else {
        return false;
      }
    }
  }]).then(function (answer) {
    connection.query('INSERT INTO Products SET ?', {
      product_name: answer.product,
      department_name: answer.department,
      price: answer.price,
      stock_quantity: answer.quantity
    }, function (err, products) {
      if (err) throw err;
      console.log('Another item was added to the store.');
    })
    displayProducts();
  });
}

displayProducts();