const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
// Require inquirer
const inquirer = require('inquirer');
//Require Console.Table --Cleaner table in console log removes index.
const cTable = require('console.table');


const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const connection = mysql.createConnection(
  {
    host: '127.0.0.1',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: '',
    database: 'employees_db'
  },
    console.log(`Connected to the employees_db database.`),
);
// Start the inquirer prompt to see what the user wants to do next
const startPrompt = () => {
    
    inquirer.prompt([{
        type: 'list',
        name: 'doNext',
        message: 'What would you like to do?',
        choices: ['View all Employees','View all Roles','View all Departments','View Employees by Manager', 'View Employees by Department', 'View Department Budget', 'Add Department', 'Add Employees','Add Role', 'Update Employee Role', 'Update Employee Managers',  'Delete Employee', 'Delete Role', 'Delete Department',  'Quit']
    }])
        .then((data) => { 
            //Deconstruct the prompt data to get the users choice
            const { doNext } = data
            //Switch case to run functions based on users input
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
        } )
}
// Run Inquirer Prompts
startPrompt();

//function to create a query to view employees
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


//function to add employees to the employee table
addEmployees = () => {
//Return all Roles then add the data to the inquirer prompt
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
                    // Deconstruct the prompt data to get the users choice
                    const { newEmployeeFirstName, newEmployeeLastName, newEmployeeRole } = data;
                    //SQL to add an employee with ? to prevent sql injection
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


//Function to update the role of a selected employee
updateEmployeeRole = () => {
    //sql query to return the employee first name, last name, role title, role id and employee id. 
    const returnEmployeeSQL = `SELECT employee.first_name, employee.last_name, role.title, employee.id, employee.role_id FROM employee JOIN role ON employee.role_id = role.id;`;
    connection.promise().query(returnEmployeeSQL)
        .then(([rows, fields]) => {
            console.table(rows)
            //return information on the employee
            const returnEmployees = rows.map(({ id, first_name, last_name, title }) => ({ name: first_name + " " + last_name + " " + title, value: id }));
            //return information on the employees role
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
                    // Deconstruct the prompt data to get the users choice
                    const { updateEmployeeRoleName, updateRoleTitle } = data;
                    console.log(data)
                    //SQL to add an update the role of an employee with ? to prevent sql injection
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


//function to add a role to the roles table
addRole = () => { 
//Return all Roles then add the data to the inquirer prompt
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
                // Deconstruct the prompt data to get the users choice
                const { newRoleName, newRoleSalary, newRoleDepartment } = data;
                //SQL to add a new role with ? to prevent sql injection
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
//function to create a query to view departments
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
//function to add a department to the department table
addDepartment = () => {

    inquirer.prompt([{
        type: 'input',
        name: 'newDepartmentName',
        message: 'What is the name of the Department?'
    },])
        .then((data) => {
            // Deconstruct the prompt data to get the users choice
            const { newDepartmentName } = data;
            //SQL to add a new role with ? to prevent sql injection
            const addDepartmentSQL = `INSERT INTO department (name)
                    VALUES (?);`;
            connection.promise().query(addDepartmentSQL, [newDepartmentName])
                .then(() => {
                    console.log(`\nNew Department has been added:\n`);
                    viewDepartment()
                    startPrompt();
                })
                .catch((error) => {
                    console.error(error);
                });
        });
}
//function to update an employees manager
updateEmployeeManager = () => { 
    const returnEmployeesSQL = `SELECT * FROM employee`;
    connection.promise().query(returnEmployeesSQL)
        .then(([rows, fields]) => {
            //return information on the employee
            const returnEmployee = rows.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
            //return information on the employees role
            const returnManager = rows.map((({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id })));
            inquirer.prompt([{
                type: 'list',
                name: 'updateEmployeeManager',
                message: 'Select the employee whos manager you would like to update?',
                choices: returnEmployee
            },
            {
                type: 'list',
                name: 'selectNewManager',
                message: 'Who is the employees new manager?',
                choices: returnManager
            }])
                .then((data) => {
                    // Deconstruct the prompt data to get the users choice
                    const { updateEmployeeManager, selectNewManager } = data;
                    console.log(data)
                    //SQL to add an update the manager of an employee with ? to prevent sql injection
                    const updateManagerSQL = `UPDATE employee
                    SET manager_id = ?
                    WHERE id = ?;`;
                    connection.promise().query(updateManagerSQL, [selectNewManager, updateEmployeeManager])
                        .then(() => {
                            console.log(`\nEmployee Role has be updated\n`);
                            startPrompt();
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                });
        });
}
//function to create a query that views employees by manager only
viewEmployeesByManager = () => { 
    const viewEmployeesByManagerSQL = `SELECT e1.first_name AS employee_first_name, e1.last_name AS employee_last_name, 
    e2.first_name AS manager_first_name, e2.last_name AS manager_last_name, e1.manager_id
FROM employee e1
JOIN employee e2 ON e1.manager_id = e2.id
WHERE e1.manager_id IS NOT NULL;`; 
  
    connection.promise().query(viewEmployeesByManagerSQL)
        .then(([rows, fields]) => {
        console.log(`\n${rows.length} Employees Currently have a Manager\n`)
            console.table(rows);
            startPrompt();
    })
        .catch(console.log)
}
// function to create a query that views employees by department
viewEmployeesByDepartment = () => { 
    const viewEmployeesByDepartmentSQL = `SELECT e.first_name, e.last_name, d.name AS department
    FROM employee e
    INNER JOIN role r ON e.role_id = r.id
    INNER JOIN department d ON r.department_id = d.id
    ORDER BY d.name;
    `; 
  
    connection.promise().query(viewEmployeesByDepartmentSQL)
        .then(([rows, fields]) => {
        console.log(`\nViewing employees by department.\n`)
            console.table(rows);
            startPrompt();
    })
        .catch(console.log)
}
//function to delete a employee.
deleteEmployee = () => {
    const returnEmployeeSQL = `SELECT * FROM employee`;
    connection.promise().query(returnEmployeeSQL)
        .then(([rows, fields]) => {
            //return information on the employee
            const returnEmployees = rows.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
            inquirer.prompt([{
                type: 'list',
                name: 'deleteEmployee',
                message: 'Select the employee you would like to delete?',
                choices: returnEmployees
            },])
                .then((data) => {
                    // Deconstruct the prompt data to get the users choice
                    const { deleteEmployee } = data;
                    //SQL to add delete an employee with ? to prevent sql injection
                    const deleteEmployeeSQL = `DELETE FROM employee WHERE id = ?;`;
                    connection.promise().query(deleteEmployeeSQL, [deleteEmployee])
                        .then(() => {
                            console.log(`\nEmployee has been Deleted\n`);
                            startPrompt();
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                });
        });
 }
//function to delete a role.
deleteRole = () => {
    const returnRolesSQL = `SELECT * FROM role`;
    connection.promise().query(returnRolesSQL)
        .then(([rows, fields]) => {
            //return information on the roles
            const returnRoles = rows.map(({ id, title}) => ({ name: title, value: id }));
            inquirer.prompt([{
                type: 'list',
                name: 'deleteRole',
                message: 'Select the role you would like to delete?',
                choices: returnRoles
            },])
                .then((data) => {
                    // Deconstruct the prompt data to get the users choice
                    const { deleteRole } = data;
                    //SQL to add an update the role of an employee with ? to prevent sql injection
                    const deleteRoleSQL = `DELETE FROM role WHERE id = ?;`;
                    connection.promise().query(deleteRoleSQL, [deleteRole])
                        .then(() => {
                            console.log(`\nRole has been Deleted\n`);
                            startPrompt();
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                });
        });
 }
//function to delete a department.
deleteDepartment = () => {
    const returnDepartmentsSQL = `SELECT * FROM Department`;
    connection.promise().query(returnDepartmentsSQL)
        .then(([rows, fields]) => {
            //return information on the Departments
            const returnDepartments = rows.map(({ id, name}) => ({ name: name, value: id }));
            inquirer.prompt([{
                type: 'list',
                name: 'deleteDepartment',
                message: 'Select the Department you would like to delete?',
                choices: returnDepartments
            },])
                .then((data) => {
                    // Deconstruct the prompt data to get the users choice
                    const { deleteDepartment } = data;
                    //SQL to add an update the Department of an employee with ? to prevent sql injection
                    const deleteDepartmentSQL = `DELETE FROM department WHERE id = ?;`;
                    connection.promise().query(deleteDepartmentSQL, [deleteDepartment])
                        .then(() => {
                            console.log(`\nDepartment has been Deleted\n`);
                            startPrompt();
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                });
        });
 }
//function to view the department budget for a selected department.
viewDepartmentBudget = () => { 

    const viewDepartmentBudgetSQL = `SELECT d.name AS department_name, SUM(r.salary) AS total_budget
    FROM employee e
    JOIN role r ON e.role_id = r.id
    JOIN department d ON r.department_id = d.id
    GROUP BY d.name;
    `; 
  
    connection.promise().query(viewDepartmentBudgetSQL)
        .then(([rows, fields]) => {
        console.log(`\nBelow is the total budget for each Department.\n`)
            console.table(rows);
            startPrompt();
    })
        .catch(console.log)
}

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
});