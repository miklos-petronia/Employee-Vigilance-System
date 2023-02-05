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

-- Developing the role table
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);