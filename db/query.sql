--Query to add an worker
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES ('John', 'Doe', NULL, 1);

-- Query to see all roles

SELECT 
  role.title,
  department.name AS department,
  role.salary
FROM employee employee
INNER JOIN role role ON employee.role_id = role.id
INNER JOIN department department ON role.department_id = department.id;

