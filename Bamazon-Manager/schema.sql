USE bamazon_DB

CREATE TABLE products(
  item_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
  product_name VARCHAR(100) NOT NULL, 
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(6,2),
  stock_quantity INTEGER,
  product_sales DECIMAL(7,2)
);
DESCRIBE products

INSERT INTO Customers (CustomerName, ContactName, Address, City, PostalCode, Country)
VALUES ('Cardinal', 'Tom B. Erichsen', 'Skagen 21', 'Stavanger', '4006', 'Norway');

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES('Prod1', 'Department1', 100, 10);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES('Prod2', 'Department2', 200, 20);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES('Prod3', 'Department3', 300, 30);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES('Prod4', 'Department4', 400, 40);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES('Prod5', 'Department5', 500, 50);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES('Prod6', 'Department6', 600, 60);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES('Prod7', 'Department7', 700, 70);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES('Prod8', 'Department8', 800, 80);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES('Prod9', 'Department9', 900, 90);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES('Prod10', 'Department10', 1000, 100);

DESCRIBE products


Select * from products

SELECT stock_quantity FROM products
WHERE item_id = 2

UPDATE products SET stock_quantity = 10 WHERE item_id = 1;

CREATE TABLE departments(
  department_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
  department_name VARCHAR(100) NOT NULL,
  over_head_costs INTEGER DEFAULT 100
);

ALTER TABLE table_name
ADD column_name datatype;

ALTER TABLE products 
ADD product_sales INTEGER

DESCRIBE products

UPDATE products SET stock_quantity = 4 WHERE item_id = 1;

UPDATE departments SET over_head_costs = 200 WHERE department_id = 2

DESCRIBE departments

INSERT INTO departments(department_name, over_head_costs)
VALUES('Department1', 6);

INSERT INTO departments(department_name, over_head_costs)
VALUES('Department2', 10);

INSERT INTO departments(department_name, over_head_costs)
VALUES('Department3', 120);

INSERT INTO departments(department_name, over_head_costs)
VALUES('Department4', 100);

INSERT INTO departments(department_name, over_head_costs)
VALUES('Department5', 100);
INSERT INTO departments(department_name, over_head_costs)
VALUES('Department6', 100);
INSERT INTO departments(department_name, over_head_costs)
VALUES('Department7', 100);
INSERT INTO departments(department_name, over_head_costs)
VALUES('Department8', 100);
INSERT INTO departments(department_name, over_head_costs)
VALUES('Department9', 100);
INSERT INTO departments(department_name, over_head_costs)
VALUES('Department10', 100);

USE bamazon_DB

Select departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales 
FROM departments
INNER JOIN products ON (departments.department_name = products.department_name)
GROUP BY departments.department_id;

Select * from departments
SELECT * FROM products

UPDATE products SET `department_name` = 'Department9'  WHERE item_id = 13;
