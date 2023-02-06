-- drop and create database
DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;

-- Use this database
USE employees_db;

-- create the department table
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30)
 
);
-- create the role table
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);
-- Create the employee table
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  manager_id INT,
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
  FOREIGN KEY (manager_id) REFERENCES employee(id) 

);