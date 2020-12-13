const cTable = require('console.table');
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: 'localhost',
    user: 'hr_person',
    password: 'pinkgrass62',
    database: 'hr_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/*
connection.connect(err => {
    if(err) throw err;
    console.log('connected as id ' + connection.threadId + '\n');  
});
*/

/*
// showing department names and department ids
allDepartments = async () => {
    console.log("prints all departments \n");
    
    const query = await connection.execute(
        "SELECT departments.name AS Department, departments.id AS DeptNo FROM departments",
        function(err,res){
            if(err) throw err;
            console.table(cTable.getTable(res));
            return(query);
        }
    )
};
*/

allDepartments = async () => {
    console.log("prints all departments \n");
    
    const query = await connection.execute(
        "SELECT departments.name AS Department, departments.id AS DeptNo FROM departments")
        
    return(query[0]);
        
};



// job title, role id, the department that role belongs to, and the salary for that role
allRoles = () => {
    console.log("prints all jobroles \n");
    const query = connection.execute(
        `SELECT jobroles.title AS Job, jobroles.id AS Id, departments.name AS Department, jobroles.salary AS Salary 
        FROM jobroles 
        INNER JOIN departments ON jobroles.department_id = departments.id`,
        function(err,res){
            if(err) throw err;
            console.table(cTable.getTable(res));
        }
    )
};

//showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
allEmployees = () => {
    console.log("prints all employees\n");
    const query = connection.execute(
        `SELECT e.id As No, CONCAT(e.first_name ,' ' , e.last_name) AS 'Name', j.title as Title, j.salary AS Salary ,d.name as Department , CONCAT(m.first_name, ' ' , m.last_name) AS "Manager"
        FROM employees AS e
        JOIN jobroles AS j ON e.role_id = j.id
        JOIN departments AS d ON j.department_id = d.id
        LEFT JOIN employees m ON m.id = e.manager_id
       `,
        function(err,res){
            if(err) throw err;
            console.table(cTable.getTable(res));
        }
    )
};

//enter the name of the department and that department is added to the database
addDepartment = (name) =>{
    console.log('adding to department ' + name + '\n');
    const query = connection.execute(
        `INSERT INTO departments (name) VALUE (?)`,
        [name], 
        function(err,res) {
            if(err) throw err;
            console.log(name + " Inserted into departments on row: " + res.insertId +'\n')
            
        }
    );
}


//enter the name, salary, and department for the role and that role
addRole = (title, salary, department) =>{
    console.log(`adding to roles: ${title} at ${salary} in ${department} \n`);
    const query = connection.execute(
        `INSERT INTO jobroles (title, salary, department_id) VALUE (?,?,?)`,
        [title, salary, department], 
        function(err,res) {
            if(err) throw err;
            console.log(`${title} with salary ${salary} in department ${department} Inserted into jobroles on row: ${res.insertId}\n`)   
        }
    );
}

//enter the employee’s first name, last name, role, and manager
addEmployee = (firstName, lastName, role_id, manager_id) =>{
    console.log(`adding to employees: ${firstName}, ${lastName} as ${role_id} reporting to ${manager_id} \n`);
    const query = connection.execute(
        `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUE (?,?,?,?)`,
        [firstName, lastName, role_id, manager_id], 
        function(err,res) {
            if(err) throw err;
            console.log(`${firstName}, ${lastName} was added to employees on row: ${res.insertId}\n`)   
        }
    );
}


//select an employee to update and their new role
updateEmployeeRole = (employee_no, new_role_id) =>{
    console.log(`employe: ${employee_no} to ${new_role_id} \n`);
    const query = connection.execute(
        `UPDATE employees SET role_id = ? WHERE id = ?`,
        [new_role_id, employee_no], 
        function(err,res) {
            if(err) throw err;
            console.log(`Employee no ${employee_no} role was changed to ${new_role_id}\n`)   
        }
    );
}


/*
allDepartments();
allRoles();
allEmployees();
addDepartment('Camelot!'); 
allDepartments();
addRole('Prime Minister', 50000, 1)
allRoles();
addEmployee( 'Carol' , 'Cleveland', 2, 3);
allEmployees();
updateEmployeeRole(4, 5); 
allEmployees();
*/

//allDepartments().then(res =>{
//    console.log((res.map(l => l.Department)))
//});

//console.log("DONE")

module.exports = allDepartments ;