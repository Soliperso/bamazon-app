DROP DATABASE if EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products (
  id INTEGER NOT NULL AUTO_INCREMENT,
  productName VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER(100) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product, department, price, stock_quantity)
VALUES  ("shoes", "soccer", 45.99, 130),
        ("nets", "volleyball", 298.99, 12),
        ("arm play holders", "football", 35.99, 4),
        ("field hockey sticks", "hockey", 249.99, 9),
        ("hockey  shinguards", "hockey", 29.99, 21),
        ("shorts", "soccer", 19.99, 229),
        ("gloves", "baseball", 49.99, 7),
        ("tennis racket", "tennis", 69.99, 10),
        ("handstand bowl", "gymnastic", 624.95, 19),
        ("wrestling headgear", "basketball", 45.95, 17);


CREATE TABLE departments ( 
    department_id INTEGER NOT NULL AUTO_INCREMENT ,
    department_name VARCHAR(50) NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    total_sale DECIMAL(10,2) NOT NULL,
    PRIMARY KEY(department_id));

INSERT INTO departments (department_name, cost, total_sale)
VALUES ('electronics', 50000.00, 15000.00),
    ('body_parts', 20000.00, 12000.00),
    ('home', 30000.00, 15000.00),
    ('health', 3000.00, 12000.00),
    ('grocery', 1200.00, 15000.00),
    ('athletics', 40000.00, 12000.00),
    ('outdoors', 35000.00, 15000.00),
    ('clothings', 12000.00, 12000.00);