-- Develop departements names --
INSERT INTO department (name)
VALUES 
('Sales'),
('Engineering'),
('Finance'),
('Legal');

-- Based on role develop title, earnings and department id --
INSERT INTO role (title, salary, department_id)
VALUES
('Sales Lead', 150000, 1),
('Salesperson', 85000, 1),
('Lead Engineer', 250000, 2), 
('Software Engineer', 320000, 2),
('Account Manager', 260000, 3), 
('Accountant', 125000, 3),
('Legal team lead', 350000, 4),
('Lawyer', 190000, 4);

-- Based on employee develop first and laste name, role id and manager id --
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Yuxuan', 'Li', 1, NULL), 
('Mike', 'Chan', 2, 1),
('Ashley', 'Rodriguez', 3, NULL),
('Kevin', 'Tupik', 4, 3),
('Kunal', 'Singh', 5, NULL),
('Malia', 'Brown', 6, 5),
('Sarah', 'Lourd', 7, NULL),
('Tom', 'Allen', 8, 7);