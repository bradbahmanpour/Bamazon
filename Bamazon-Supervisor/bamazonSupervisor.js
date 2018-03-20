// dependency for inquirer npm package
var inquirer = require("inquirer");
var mysql = require("mysql");
var total_profit = 0;

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
    SupervisorDashboard();
});

function viewProductsSaleByDepartment() {
    connection.query('Select departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales FROM departments INNER JOIN products ON (departments.department_name = products.department_name)', function (error, results, fields) {
  
        console.log("|---------------|-----------------|-----------------|---------------|--------------|");
        console.log("| department_id | department_name | over_head_costs | product_sales | total_profit |"); 
        console.log("|---------------|-----------------|-----------------|---------------|--------------|");
        for (i = 0; i < results.length; i++) {


         //   console.log("results.length = "+ results.length);
          //  console.log("results =" + results[i].department_id);  

          total_profit = parseInt(results[i].product_sales) - parseInt(results[i].over_head_costs); 

           console.log("|   " + results[i].department_id + "           |  " + results[i].department_name + "    | " + results[i].over_head_costs + "             | " + results[i].product_sales + "          |" + total_profit + "          |");
           console.log("|---------------|-----------------|-----------------|---------------|--------------|");
        }
        //    console.log(ProdNames);  
        SupervisorDashboard() ;
    });
}

function createNewDepartment() {
    var total = 0;
    inquirer.prompt([
            {
                name: "departmentName",
                type: "input",
                message: "What is the Department name ? ",
            },
            {
                name: "overheadCost",
                type: "input",
                message: "What is the Over Head Cost",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
           
        ])
        .then(function (answer) {
                var query = "INSERT INTO departments SET ?";
                connection.query(query, 
                    {
                        department_name: answer.departmentName,
                        over_head_costs: answer.overheadCost
                    },function (error, res) {
                        if (error) throw error;
                        SupervisorDashboard() ;
                });
        });
}

function SupervisorDashboard() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Product Sales by Department",
                "Create New Department"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Product Sales by Department":
                    viewProductsSaleByDepartment();
                    break;

                case "Create New Department":
                    createNewDepartment();
                    break;
            }
        });
}