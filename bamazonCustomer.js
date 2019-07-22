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
  password: "password",
  database: "bamazon_db"
});

function displayProducts() {
  //prints the items for sale and their details
  connection.query('SELECT * FROM Products', (err, products) => {
    if (err) throw err;
    console.log(' ');
    console.log('=============================== WELCOME TO bAMAZON STORE =========================================');
    console.log('--------------------------------------------------------------------------------------------------')

    for (var i = 0; i < products.length; i++) {
      console.log("Item ID: " + products[i].id + " | " + "Product Name: " + products[i].product_name + " | " + "Department: " + products[i].department_name + " | " + "Price: $" + products[i].price + " | " + "Qty: " + products[i].stock_quantity);
      console.log('--------------------------------------------------------------------------------------------------')
    }

    console.log(' ');
    inquirer.prompt([{
        type: "input",
        name: "id",
        message: "What is the id of the product you would like to purchase?",
        validate: function (val) {
          if (isNaN(val) == false && parseInt(val) <= products.length && parseInt(val) > 0) {
            return true;
          } else {
            return false;
          }
        }
      },
      {
        type: "input",
        name: "qty",
        message: "How much would you like to purchase?",
        validate: function (val) {
          if (isNaN(val)) {
            return false;
          } else {
            return true;
          }
        }
      }
    ]).then((answer) => {
      var itemToBuy = (answer.id) - 1;
      var howManyPurchases = parseInt(answer.qty);
      var totalAmount = parseFloat(((products[itemToBuy].price) * howManyPurchases).toFixed(2));

      //check if quantity is sufficient
      if (products[itemToBuy].stock_quantity >= howManyPurchases) {
        //after purchase, updates quantity in Products
        connection.query("UPDATE Products SET ? WHERE ?", [{
            stock_quantity: (products[itemToBuy].stock_quantity - howManyPurchases)
          },
          {
            id: answer.id
          }
        ], (err, result) => {
          if (err) throw err;
          console.log("Success! Your total is $" + totalAmount.toFixed(2));
        });

        connection.query("SELECT * FROM departments", (err, depart_res) => {
          if (err) throw err;
          var index;
          for (var i = 0; i < depart_res.length; i++) {
            if (depart_res[i].department_name === res[itemToBuy].department_name) {
              index = i;
            }
          }

          //updates total_sale in departments table
          connection.query("UPDATE departments SET ? WHERE ?", [{
              total_sale: depart_res[index].total_sale + totalAmount
            },
            {
              department_name: res[itemToBuy].department_name
            }
          ], (err, depart_res) => {
            if (err) throw err;
          });
        });

      } else {
        console.log("Sorry, there are no more items on stock!");
      }

      askAgain();
    })
  })
}

// Ask the customer if he/she wants to buy another item
askAgain = () => {
  inquirer.prompt([{
    type: "confirm",
    name: "reply",
    message: "Would you like to buy another item instead?"
  }]).then(function (answer) {
    if (answer.reply) {
      displayProducts();
    } else {
      console.log("See you soon!");
    }
  });
}

displayProducts();