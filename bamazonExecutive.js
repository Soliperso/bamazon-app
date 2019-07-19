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
})

function displayProducts() {
  inquirer.prompt([{
    type: "list",
    name: "doThing",
    message: "What would you like to do?",
    choices: ["View Product Sales by Department", "Create New Department", "End Session"]
  }]).then(function (answer) {
    switch (answer.doThing) {
      case "View Product Sales by Department":
        viewProductByDept();
        break;
      case "Create New Department":
        createNewDept();
        break;
      case "End Session":
        console.log('Bye!');
    }
  });
}

// View product sales by department
function viewProductByDept() {
  // Prints the items for sale and their details
  connection.query('SELECT * FROM departments', function (err, products) {
    if (err) throw err;
    console.log('======================== PRODUCT SALES BY DEPARTMENTS =========================');
    console.log('----------------------------------------------------------------------------------------------------')

    for (var i = 0; i < products.length; i++) {
      console.log("Department id: " + products[i].Departmentid + " | " + "Department Name: " + products[i].department_name + " | " + "Over Head Cost: " + (products[i].cost).toFixed(2) + " | " + "Product Sales: " + (products[i].total_sale).toFixed(2) + " | " + "Total Profit: " + (products[i].total_sale - products[i].cost).toFixed(2));
      console.log('--------------------------------------------------------------------------------------------------')
    }
    displayProducts();
  })
}

// Create a new department
function createNewDept() {
  console.log('======================== CREATING NEW DEPARTMENTS =========================');  //prompts to add deptName and numbers. if no val is then by default = 0
  inquirer.prompt([{
    type: "input",
    name: "deptName",
    message: "Department Name: "
  }, {
    type: "input",
    name: "cost",
    message: "Cost: ",
    default: 0,
    validate: function (val) {
      if (isNaN(val) === false) {
        return true;
      } else {
        return false;
      }
    }
  }, {
    type: "input",
    name: "prodSales",
    message: "Product Sales: ",
    default: 0,
    validate: function (val) {
      if (isNaN(val) === false) {
        return true;
      } else {
        return false;
      }
    }
  }]).then(function (answer) {
    connection.query('INSERT INTO departments SET ?', {
      department_name: answer.deptName,
      cost: answer.overHeadCost,
      total_sale: answer.prodSales
    }, function (err, products) {
      if (err) throw err;
      console.log('Another department was added.');
    })
    displayProducts();
  });
}

displayProducts();