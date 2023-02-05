const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
// Essential inquirer
const inquirer = require('inquirer');
//Essential Console.Table Cleaner table in console log detach index.
const cTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Attach to database
const connection = mysql.createConnection(
    {
        host: '127.0.0.1',
        // MySQL username,
        user: 'root',
        // TODO: Add MySQL password 
        password: '',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`),
);

// Commence the inquirer prompt to view what the user wants to do the following
const startPrompt = () => {

    inquirer.prompt([{
        type: 'list',
        name: 'doNext',
        message: 'What would you like to do?',
        choices: ['View all Employees', 'View all Roles', 'View all Departments', 'View Employees by Manager', 'View Employees by Department', 'View Department Budget', 'Add Department', 'Add Employees', 'Add Role', 'Update Employee Role', 'Update Employee Managers', 'Delete Employee', 'Delete Role', 'Delete Department', 'Quit']
    }])
        .then((data) => {
            //Disentangle the prompt data to receive the users options
            const { doNext } = data
            //Change case to run task based on users feedbacks
            switch (doNext) {
                case 'View all Employees': {
                    viewEmployees();
                    break
                }
                case 'View all Roles': {
                    viewRoles();
                    break
                }
                case 'View all Departments': {
                    viewDepartment();
                    break
                }
                case 'View Employees by Manager': {
                    viewEmployeesByManager();
                    break
                }
                case 'View Employees by Department': {
                    viewEmployeesByDepartment();
                    break
                }
                case 'View Department Budget': {
                    viewDepartmentBudget();
                    break
                }
                case 'Add Employees': {
                    addEmployees();
                    break
                }
                case 'Add Role': {
                    addRole();
                    break
                }
                case 'Add Department': {
                    addDepartment();
                    break
                }
                case 'Update Employee Role': {
                    updateEmployeeRole();
                    break
                }
                case 'Update Employee Managers': {
                    updateEmployeeManager();
                    break
                }
                case 'Delete Employee': {
                    deleteEmployee();
                    break
                }
                case 'Delete Role': {
                    deleteRole();
                    break
                }
                case 'Delete Department': {
                    deleteDepartment();
                    break
                }
                case 'Quit': {
                    connection.end()
                    break
                }

            }
        })
}

// Run Inquirer Prompts
startPrompt();

//Task to develop a query to see workers
viewEmployees = () => {
    const sql = `SELECT 
    employee.first_name,
    employee.last_name,
    role.title,
    department.name AS department,
    role.salary
  FROM employee employee
  INNER JOIN role role ON employee.role_id = role.id
  INNER JOIN department department ON role.department_id = department.id;`;


    connection.promise().query(sql)
        .then(([rows, fields]) => {
            console.log(`\nThere are Currently ${rows.length} Employees assigned to a Role\n`)
            console.table(rows);
            startPrompt();
        })
        .catch(console.log)
}

//Application inding workers to the employee tables
addEmployees = () => {