
const express = require('express');
// Import and essential mysql2
const mysql = require('mysql2');
// Essential inquirer
const inquirer = require('inquirer');
//Essential Console.Table --Cleaner table in console log detach index.
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
    // TODO: Insert MySQL password 
    password: 'Rootroot',
    database: 'employees_db'
  },
    console.log(`Connected to the employees_db database.`),
);
// Commence the inquirer prompt to view what the user wants to do in the following
const startPrompt = () => {
    
    inquirer.prompt([{
        type: 'list',
        name: 'doNext',
        message: 'What would you like to do?',
        choices: ['View all Employees','View all Roles','View all Departments','View Employees by Manager', 'View Employees by Department', 'View Department Budget', 'Add Department', 'Add Employees','Add Role', 'Update Employee Role', 'Update Employee Managers',  'Delete Employee', 'Delete Role', 'Delete Department',  'Quit']
    }])
        .then((data) => { 
            //Decode the prompt data to retrieve the users options
            const { doNext } = data
            //Switch sample to run application based on users feedback
            switch (doNext) { 
                case 'View all Employees': { 
                    seeEmployees();
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
                    seeEmployeesByManager();
                    break
                }
                case 'View Employees by Department': { 
                    seeEmployeesByDepartment();
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

//Application to develop a query to see workers
seeEmployees = () => { 
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


//Application to add employees to the workers table
addEmployees = () => {
//Retrieve all roles then insert the data to the inquirer prompt
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
                    // Decode the prompt data to retrieve the users option
                    const { newEmployeeFirstName, newEmployeeLastName, newEmployeeRole } = data;
                    //SQL to insert an employee with  to stop sql insertation
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
    //sql query to give back the workers first name, last name, role title, role id and employee id. 
    const returnEmployeeSQL = `SELECT employee.first_name, employee.last_name, role.title, employee.id, employee.role_id FROM employee JOIN role ON employee.role_id = role.id;`;
    connection.promise().query(returnEmployeeSQL)
        .then(([rows, fields]) => {
            console.table(rows)
            //Retrieve data on the worker
            const returnEmployees = rows.map(({ id, first_name, last_name, title }) => ({ name: first_name + " " + last_name + " " + title, value: id }));
            //Retrieve data on the workers role
            const returnRoles = rows.map(({ role_id, title }) => ({ name: title, value: role_id }));
            inquirer.prompt([{
                type: 'list',
                name: 'updateEmployeeRoleName',
                message: 'Choose the worker whos title you would like to change',
                choices: returnEmployees
            },
            {
                type: 'list',
                name: 'updateRoleTitle',
                message: 'What is the workers new job title?',
                choices: returnRoles
            }])
                .then((data) => {
                    // Decode the prompt data to obtain the users option
                    const { updateEmployeeRoleName, updateRoleTitle } = data;
                    console.log(data)
                    //SQL to insert an update the role of an worker with to stop sql injection
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

//Application to develop a query to see all the roles that presently have a worker
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


//Application to insert a role to the roles table
addRole = () => { 
//Retrieve all Roles then insert the information to the inquirer prompt
const returnDepartmentSQL = `SELECT * FROM department`;
connection.promise().query(returnDepartmentSQL)
    .then(([rows, fields]) => {
        const returnDepartment = rows.map(({ id, name }) => ({ name: name, value: id }));
        inquirer.prompt([{
            type: 'input',
            name: 'newRoleName',
            message: 'What is the name of the new job?'
        },
        {
            type: 'number',
            name: 'newRoleSalary',
            message: 'What is the salary of the new job?'
        },
        {
            type: 'list',
            name: 'newRoleDepartment',
            message: 'What department unit does the new job belong to?',
            choices: returnDepartment
        }])
            .then((data) => {
                // Decode the prompt data to obtain the users option
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
//Application to develop a query to see units
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
//Application to add a unit to the department table
addDepartment = () => {

    inquirer.prompt([{
        type: 'input',
        name: 'newDepartmentName',
        message: 'What is the name of the Department unit?'
    },])
        .then((data) => {
            // Decode the prompt information to obtain the users option
            const { newDepartmentName } = data;
            //SQL to add a new role with to stop sql injection
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
//Application to update a workers manager
updateEmployeeManager = () => { 
    const returnEmployeesSQL = `SELECT * FROM employee`;
    connection.promise().query(returnEmployeesSQL)
        .then(([rows, fields]) => {
            //retrieve information on the employee
            const returnEmployee = rows.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
            //retrieve information on the workers role
            const returnManager = rows.map((({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id })));
            inquirer.prompt([{
                type: 'list',
                name: 'updateEmployeeManager',
                message: 'Choose the worker whos manager you would like to change?',
                choices: returnEmployee
            },
            {
                type: 'list',
                name: 'selectNewManager',
                message: 'Who is the workers new manager?',
                choices: returnManager
            }])
                .then((data) => {
                    // Decode the prompt data to obtain the users option
                    const { updateEmployeeManager, selectNewManager } = data;
                    console.log(data)
                    //SQL to add an update the manager of a worker with to stop sql insertion
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
//Application to develop a query that sees workers by manager only
seeEmployeesByManager = () => { 
    const seeEmployeesByManagerSQL = `SELECT e1.first_name AS employee_first_name, e1.last_name AS employee_last_name, 
    e2.first_name AS manager_first_name, e2.last_name AS manager_last_name, e1.manager_id
FROM employee e1
JOIN employee e2 ON e1.manager_id = e2.id
WHERE e1.manager_id IS NOT NULL;`; 
  
    connection.promise().query(seeEmployeesByManagerSQL)
        .then(([rows, fields]) => {
        console.log(`\n${rows.length} Employees Currently have a Manager\n`)
            console.table(rows);
            startPrompt();
    })
        .catch(console.log)
}
// Application to develop a query that sees employees by unit
seeEmployeesByDepartment = () => { 
    const seeEmployeesByDepartmentSQL = `SELECT e.first_name, e.last_name, d.name AS department
    FROM employee e
    INNER JOIN role r ON e.role_id = r.id
    INNER JOIN department d ON r.department_id = d.id
    ORDER BY d.name;
    `; 
  
    connection.promise().query(seeEmployeesByDepartmentSQL)
        .then(([rows, fields]) => {
        console.log(`\nViewing employees by department.\n`)
            console.table(rows);
            startPrompt();
    })
        .catch(console.log)
}
//Application to delete a employee.
deleteEmployee = () => {
    const returnEmployeeSQL = `SELECT * FROM employee`;
    connection.promise().query(returnEmployeeSQL)
        .then(([rows, fields]) => {
            //retrieve information on the worker
            const returnEmployees = rows.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
            inquirer.prompt([{
                type: 'list',
                name: 'deleteEmployee',
                message: 'Select the worker you would like to remove?',
                choices: returnEmployees
            },])
                .then((data) => {
                    // Decode the prompt data to obtain the users option
                    const { deleteEmployee } = data;
                    //SQL to add delete an employee with to stop sql insertion
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
//Application to delete a role.
deleteRole = () => {
    const returnRolesSQL = `SELECT * FROM role`;
    connection.promise().query(returnRolesSQL)
        .then(([rows, fields]) => {
            //Retrieve data on the roles
            const returnRoles = rows.map(({ id, title}) => ({ name: title, value: id }));
            inquirer.prompt([{
                type: 'list',
                name: 'deleteRole',
                message: 'Choose the role you would like to remove?',
                choices: returnRoles
            },])
                .then((data) => {
                    // Decode the prompt data to obtain the users option
                    const { deleteRole } = data;
                    //SQL to insert an update the role of an employee with ? to stop sql insertion
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
//Application to delete a department unit.
deleteDepartment = () => {
    const returnDepartmentsSQL = `SELECT * FROM Department`;
    connection.promise().query(returnDepartmentsSQL)
        .then(([rows, fields]) => {
            //retrieve data on the Departments
            const returnDepartments = rows.map(({ id, name}) => ({ name: name, value: id }));
            inquirer.prompt([{
                type: 'list',
                name: 'deleteDepartment',
                message: 'Select the Department you would like to delete?',
                choices: returnDepartments
            },])
                .then((data) => {
                    // Decode the prompt data to obtain the users option
                    const { deleteDepartment } = data;
                    //SQL to insert an update the department of an employee with  to stop sql insertion
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
//Application to see the unit budget for a selected department.
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