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
    displayAllTheProducts();
});

function displayAllTheProducts() {
    connection.query('SELECT item_id,product_name,price from products', function (error, results, fields) {

        console.log("|===========|=============|============|");
        console.log("|Product ID |Product Name |    Price   |");
        console.log("|===========|=============|============|");
        for (i = 0; i < results.length; i++) {
            // console.log("results.length = "+ results.length);       
            console.log("| " + results[i].item_id + "         | " + results[i].product_name + "       | " + results[i].price + "        |");
        }
        //    console.log(ProdNames);
        WhatDoYouWantToBuy()
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
        WhatDoYouWantToBuy();
    });
}

function WhatDoYouWantToBuy() {
    var remain = 0;
    var salePrice = 0;
    var totalSale = 0;
    inquirer.prompt([{
                name: "productID",
                type: "input",
                message: "the ID of the product you would like to buy? ",
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
                message: "How many units do you want to buy? ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            var query = "SELECT stock_quantity, price, product_sales FROM products WHERE ?";
            connection.query(query, {
                item_id: answer.productID
            }, function (error, res) {
                if (error) throw error;

                if (res[0].stock_quantity === 0) {
                    console.log("We don't have this item in our inventory at this time");
                } else if (answer.NumOfUnits > res[0].stock_quantity) {
                    console.log("Insufficient quantity!");
                } else {
                    remain = res[0].stock_quantity - answer.NumOfUnits;
                    console.log("Remain = " + remain);
                    salePrice = parseInt(res[0].price) * parseInt(answer.NumOfUnits) ;
                    totalSale = res[0].product_sales + salePrice;
                    console.log("totalSale = " + totalSale);

                    var query = "UPDATE products SET ? WHERE ?";
                    connection.query(query, [{
                                stock_quantity: remain,
                                product_sales: totalSale
                            },
                            {
                                item_id: answer.productID
                            }
                        ],
                        function (error, res) {
                            if (error) throw error;

                        });
                  console.log(" The Total Cost of your purchase is = " +  salePrice);
                  WhatDoYouWantToBuy();
                }
            });

        });
}