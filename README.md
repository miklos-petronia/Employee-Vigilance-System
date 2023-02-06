# Employee-Vigilance-System

# Description
Developers frequently have to create interfaces that allow non-developers to easily view and interact with information stored in databases. These interfaces are called **content management systems (CMS)**. For this assignment I would need to build a command-line application from scratch to manage a company's employee database, using Node.js, Inquirer, and MySQL.

### Acceptance Criteria

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```

## Table of Contents
* [Installation](#installation)
* [Usage](#usage)
* [License](#license)
* [Credits](#credits)
* [Contributors](#contributors)
* [Report Bugs](#bugreport)

## Installation
Clone the repository in your terminal machine or git bash
Clone Via SSH: $ git clone git@github.com:miklos-petronia/Employee-Vigilance-System.git

Input your MySQL username and password in the server.js file.
Cd/ into the cloned directory and install dependencies. 
To start the application, type the following into the terminal: $ node server.js

## Usage

### 1. install npm init -y to create a new .json file
### 2. npm i
### 3. npm i inquirer
### 4. npm i mysql
### 5. npm i console.table
### 6. Make sure to run .sql file in mySQL workbench before running server.js so that tables are able to render correctly
### 7. run node server.js
### 8. make sure server.js is connected to SQL before continuing
### 9. run through prompts as required

### Application Screenshot:

## License 
 ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg) 

[Read more about MIT License here.](https://opensource.org/licenses/MIT)

## Credits

## Contributors
N/A

## BugReport

- [Github](https://github.com/miklos-petronia)
- [email](mailto:miklos.petronia@hotmail.com)