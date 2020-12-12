USE hr_db

INSERT INTO departments (name)
VALUES 
('Ministry of Silly Walks'),
('Fawlty Towers');

INSERT INTO jobroles (title, salary, department_id)
VALUES
('Office assistant', 30000.00, 1),
('Clerk', 20000.00, 1),
('Office Manager', 40000.00, 1),
('Chef', 40000.00, 2),
('Manager', 40000.00, 2),
('Ganitor', 40000.00, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('John', 'Cleese',3, NULL),
('Graham', 'Chapman',5, NULL),
('Michael', 'Palin',2,1),
('Terry', 'Jones',4,2),
('Eric', 'Idle',6,3),
('Andrew', 'Sachs',4,5);
