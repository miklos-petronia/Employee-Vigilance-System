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

//Application in adding workers to the employee tables
addEmployees = () => {

    //Reinstate all roles then add the data to inquirer prompt
    const returnRoleSQL = `Select * FROM Role`;
    connection.promise().query(returnRoleSQL)
        .then(([rows, fields]) => {
            const returnRoles = rows.map(({ id, title }) => ({ name: title, value: id }));
            inquirer.prompt([{
                type: 'input',
                name: 'newEmployeeFirstName',
                message: 'What is the employees first name?'
            },
            {
                type: 'input',
                name: 'newEmployeeLastName',
                message: 'What is the employees last name?'
            },
            {
                type: 'list',
                name: 'newEmployeeRole',
                message: 'What is the employees role?',
                choices: returnRoles
            }])
                .then((data) => {
                    // Decode the prompt data to recieve the users options
                    const { newEmployeeFirstName, newEmployeeLastName, newEmployeeRole } = data;
                    //SQL to add a worker to prevent sql injection
                    const addEmployeeSQL = `INSERT INTO employee (first_name, last_name, manager_id, role_id)
            VALUES (?, ?, NULL, ?);`;
                    connection.promise().query(addEmployeeSQL, [newEmployeeFirstName, newEmployeeLastName, newEmployeeRole])
                        .then(() => {
                            console.log(`\nEmployee information has been added to the employee table:\n`);
                            startPrompt();
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                });
        });
};

//Application to update the role of a selected worker
updateEmployeeRole = () => {
    //sql query to retrive the workers first name, last name, role title, role id and employee id. 
    const returnEmployeeSQL = `SELECT employee.first_name, employee.last_name, role.title, employee.id, employee.role_id FROM employee JOIN role ON employee.role_id = role.id;`;
    connection.promise().query(returnEmployeeSQL)
        .then(([rows, fields]) => {
            console.table(rows)
            //retrive information on the worker
            const returnEmployees = rows.map(({ id, first_name, last_name, title }) => ({ name: first_name + " " + last_name + " " + title, value: id }));
            //Retrive information on the workers role
            const returnRoles = rows.map(({ role_id, title }) => ({ name: title, value: role_id }));
            inquirer.prompt([{
                type: 'list',
                name: 'updateEmployeeRoleName',
                message: 'Select the employee whos title you would like to update?',
                choices: returnEmployees
            },
            {
                type: 'list',
                name: 'updateRoleTitle',
                message: 'What is the employees new title?',
                choices: returnRoles
            }])
                .then((data) => {
                    // Decode the prompt data to retrieve the users options
                    const { updateEmployeeRoleName, updateRoleTitle } = data;
                    console.log(data)
                    //SQL to add an update the role of an workers with  to stop sql usage
                    const updateRoleSQL = `UPDATE employee
                    SET role_id = ?
                    WHERE id = ?;`;
                    connection.promise().query(updateRoleSQL, [updateRoleTitle, updateEmployeeRoleName])
                        .then(() => {
                            console.log(`\nEmployee Role has be updated\n`);
                            startPrompt();
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                });
        });
};

//Application to develop a query to see all the roles that presently have an worker
viewRoles = () => {
    const viewRoleSQL = `SELECT 
    role.title,
    department.name AS department,
    role.salary
  FROM employee employee
  INNER JOIN role role ON employee.role_id = role.id
  INNER JOIN department department ON role.department_id = department.id;`;


    connection.promise().query(viewRoleSQL)
        .then(([rows, fields]) => {
            console.log(`\nThere are Currently ${rows.length} Roles with active employees\n`)
            console.table(rows);
            startPrompt();
        })
        .catch(console.log)
}

//function to create a query to view all the roles that currently have an employee
viewRoles = () => { 
    const viewRoleSQL = `SELECT 
    role.title,
    department.name AS department,
    role.salary
  FROM employee employee
  INNER JOIN role role ON employee.role_id = role.id
  INNER JOIN department department ON role.department_id = department.id;`;

  
    connection.promise().query(viewRoleSQL)
        .then(([rows, fields]) => {
        console.log(`\nThere are Currently ${rows.length} Roles with active employees\n`)
            console.table(rows);
            startPrompt();
    })
        .catch(console.log)
}

//Application in adding role to the roles table
addRole = () => {
    //Retrive all roles then add the data to the inquirer prompt
    const returnDepartmentSQL = `SELECT * FROM department`;
    connection.promise().query(returnDepartmentSQL)
        .then(([rows, fields]) => {
            const returnDepartment = rows.map(({ id, name }) => ({ name: name, value: id }));
            inquirer.prompt([{
                type: 'input',
                name: 'newRoleName',
                message: 'What is the name of the role?'
            },
            {
                type: 'number',
                name: 'newRoleSalary',
                message: 'What is the salary of the role?'
            },
            {
                type: 'list',
                name: 'newRoleDepartment',
                message: 'What department does the role belong to?',
                choices: returnDepartment
            }])
                .then((data) => {
                    // Decode the prompt data to retrieve the users options
                    const { newRoleName, newRoleSalary, newRoleDepartment } = data;
                    //SQL to add a new role to stop sql insert
                    const addRoleSQL = `INSERT INTO role (title, salary, department_id)
                VALUES (?, ?, ?);`;
                    connection.promise().query(addRoleSQL, [newRoleName, newRoleSalary, newRoleDepartment])
                        .then(() => {
                            console.log(`\nNew Role has been added:\n`);
                            startPrompt();
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                });
        });
}

//Application to develop a query to see the departments
viewDepartment = () => {
    const viewDepartmentSQL = `SELECT * from department;`;

    connection.promise().query(viewDepartmentSQL)
        .then(([rows, fields]) => {
            console.log(`\nThere are Currently ${rows.length} Departments\n`)
            console.table(rows);
            startPrompt();
        })
        .catch(console.log)
}