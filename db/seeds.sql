-- adding names to the department 
INSERT INTO department (name)
VALUES 
('Sales'),
('Engineering'),
('Finance'),
('Legal');

--Adding within the roles the title, salary and the department ID
INSERT INTO role (title, salary, department_id)
VALUES
('Sales Lead', 100000, 1),
('Salesperson', 80000, 1),
('Lead Engineer', 150000, 2), 
('Software Engineer', 120000, 2),
('Account Manager', 160000, 3), 
('Accountant', 125000, 3),
('Legal team lead', 250000, 4),
('Lawyer', 190000, 4);
