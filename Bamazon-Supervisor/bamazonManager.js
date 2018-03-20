// dependency for inquirer npm package
var inquirer = require("inquirer");
var mysql = require("mysql");
var ProdNames = [];
var ProdIds = [];
var bidItemNumber;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon_DB"
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    managerDashboard();
});

function viewProductsForSale() {
    connection.query('SELECT item_id,product_name,price, stock_quantity FROM products', function (error, results, fields) {

        console.log("|------------|" + "---------------|" + "-------|" + "----------------|");
        console.log("| Product ID |" + " Product Name  |" + " Price |" + " Stock Quantity |");
        console.log("|------------|" + "---------------|" + "-------|" + "----------------|");
        for (i = 0; i < results.length; i++) {
            // console.log("results.length = "+ results.length); 

            console.log("|   " + results[i].item_id + "        |  " + results[i].product_name + "        | " + results[i].price + "   | " + results[i].stock_quantity + "             |");
            console.log("|------------|" + "---------------|" + "-------|" + "----------------|");
        }
        //    console.log(ProdNames);
        managerDashboard();
    });
}

function viewLowInventory() {
    connection.query('SELECT item_id,product_name,price, stock_quantity FROM products WHERE stock_quantity < 5 ', function (error, results, fields) {

        console.log("|------------|" + "---------------|" + "-------|" + "----------------|");
        console.log("| Product ID |" + " Product Name  |" + " Price |" + " Stock Quantity |");
        console.log("|------------|" + "---------------|" + "-------|" + "----------------|");
        for (i = 0; i < results.length; i++) {
            // console.log("results.length = "+ results.length); 

            console.log("|   " + results[i].item_id + "        |  " + results[i].product_name + "        | " + results[i].price + "   | " + results[i].stock_quantity + "             |");
            console.log("|------------|" + "---------------|" + "-------|" + "----------------|");
        }
        //    console.log(ProdNames);
        managerDashboard();
    });
}

function insertProduct(productInfo) {

    // console.log(productInfo);
    connection.query('INSERT INTO products SET ?', {
        product_name: productInfo.productName,
        department_name: productInfo.departmentName,
        price: productInfo.price,
        stock_quantity: productInfo.stockQuantity,
    }, function (error, results, fields) {

        /*      for (i = 0; i < results.length; i++) {
                  console.log(results[i].prod_name);
              } */
    });
}

function addInventory() {
    var total = 0;
    inquirer.prompt([{
                name: "productID",
                type: "input",
                message: "the ID of the product you would like to add inventory? ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "NumOfUnits",
                type: "input",
                message: "How many units do you want to add to the inventory",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
                var query = "SELECT stock_quantity, price FROM products WHERE ?";
                connection.query(query, {
                        item_id: answer.productID
                    }, function (error, res) {
                        if (error) throw error;

                        total = parseInt(res[0].stock_quantity) + parseInt(answer.NumOfUnits);
                        console.log("Total= " + total);

                        var query = "UPDATE products SET ? WHERE ?";
                        connection.query(query, 
                            [
                                {
                                    stock_quantity: total
                                },
                                {
                                    item_id: answer.productID
                                }
                            ],
                            function (error, res) {
                                if (error) throw error;

                            });

                        console.log(" The Updated inventory is = " + total);
                        managerDashboard();

                });
        });
}

function addNewProduct() {
    var total = 0;
    inquirer.prompt([
            {
                name: "productName",
                type: "input",
                message: "What is the product name that you would like to add? ",
            },
            {
                name: "departmentName",
                type: "input",
                message: "What is the Department name ? ",
            },
            {
                name: "unitPrice",
                type: "input",
                message: "What is the Price per Unit?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many unit do you want to add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
                var query = "INSERT INTO products SET ?";
                connection.query(query, 
                    {
                        product_name: answer.productName,
                        department_name: answer.departmentName,
                        price: answer.unitPrice,
                        stock_quantity: answer.quantity
                    },function (error, res) {
                        if (error) throw error;
                });

                managerDashboard();
        });
}

function managerDashboard() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    viewProductsForSale();
                    break;

                case "View Low Inventory":
                    viewLowInventory();
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Add New Product":
                addNewProduct();
                    break;
            }
        });
}