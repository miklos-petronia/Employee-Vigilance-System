-- relinquish and develop database
DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;

-- Utilize this database
USE employees_db;

-- develop the unit table
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30)
 
);