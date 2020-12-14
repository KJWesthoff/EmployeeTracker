const cTable = require('console.table');
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: 'localhost',
    user: 'hr_person',
    password: 'pinkgrass62',
    database: 'hr_db',
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
});

/*
connection.connect(err => {
    if(err) throw err;
    console.log('connected as id ' + connection.threadId + '\n');  
});
*/


allDepartments = async () => {
    //Queries for all departments;
    try {
    const result= await connection.execute(
        "SELECT departments.name AS Department, departments.id AS DeptNo FROM departments")   
        return result[0];
    } catch (err) {
        console.log("error found \n" + err)
    }    
};

getDepartMentIdByName = async (deptName) => {
    try {
        const result = await connection.execute(
            "SELECT departments.id FROM departments WHERE departments.name = ?", [deptName]
        );
        return result[0];
    } catch (err) {
        console.log("error found \n" + err)
    }
}; 




// job title, role id, the department that role belongs to, and the salary for that role
allRoles = async () => {
    // Queries all jobroles
    try{
    const result = await connection.execute(
        `SELECT jobroles.title AS Title, jobroles.id AS Id, departments.name AS Department, jobroles.salary AS Salary 
        FROM jobroles 
        INNER JOIN departments ON jobroles.department_id = departments.id`)
        return result[0];
    } catch (err) {
        console.log("error found \n" + err)
    }    
    
};

//showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
allEmployees = async () => {
    // Query all employees
    try {
    const result = await connection.execute(
        `SELECT e.id As No, CONCAT(e.first_name ,' ' , e.last_name) AS 'Name', j.title as Title, j.salary AS Salary ,d.name as Department , CONCAT(m.first_name, ' ' , m.last_name) AS "Manager"
        FROM employees AS e
        JOIN jobroles AS j ON e.role_id = j.id
        JOIN departments AS d ON j.department_id = d.id
        LEFT JOIN employees m ON m.id = e.manager_id
       `) 
       return result[0];
    } catch (err) {
        console.log("error found \n" + err)
    }    
};

//enter the name of the department and that department is added to the database
addDepartment = async (name) =>{
     // adding department ;
    try {
    const query = await connection.execute(
        `INSERT INTO departments (name) VALUE (?)`,
        [name]);
    console.log("Department " + name +" added");     
    } catch (err) {
        console.log("error found \n" + err)
    }    
    
}


//enter the name, salary, and department for the role and that role
addRole = async (inpDict) =>{

    try {
    const query = await connection.execute(
        `INSERT INTO jobroles (title, salary, department_id) VALUE (?,?,?)`,
        [inpDict.title, inpDict.salary,inpDict.department_id]); 
    } catch (err) {
        console.log("error found \n" + err)   
    }    
    

}

//enter the employee’s first name, last name, role, and manager
addEmployee = (employeeObj) =>{
   
    const query = connection.query(
        `INSERT INTO employees SET ?`,
         employeeObj,
        function(err,res) {
            if(err) throw err;
            console.log(`${firstName}, ${lastName} was added to employees on row: ${res.insertId}\n`)   
        }
    );
}


//select an employee to update and their new role
updateEmployeeRole = (employee_no, new_role_id) => {
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

//select an employee to update and their new role
updateEmployeeManager = (employee_no, new_namager_id) => {
  
    const query = connection.execute(
        `UPDATE employees SET manager_id = ? WHERE id = ?`,
        [new_namager_id, employee_no], 
        function(err,res) {
            if(err) throw err;
            
        }
    );
}


//showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
employeesByManager = async (item) => {
    // Query all employees
    try {
    const result = await connection.execute(
        `SELECT e.id As No, CONCAT(e.first_name ,' ' , e.last_name) AS 'Name', j.title as Title, j.salary AS Salary ,d.name as Department , CONCAT(m.first_name, ' ' , m.last_name) AS Manager
        FROM employees AS e
        JOIN jobroles AS j ON e.role_id = j.id
        JOIN departments AS d ON j.department_id = d.id
        LEFT JOIN employees m ON m.id = e.manager_id
        WHERE m.id = ?`, [item]) 
       return result[0];
    } catch (err) {
        console.log("error found \n" + err)
    }    
};

employeesByDepartment = async (item) => {
    // Query all employees
    try {
    const result = await connection.execute(
        `SELECT e.id As No, CONCAT(e.first_name ,' ' , e.last_name) AS 'Name', j.title as Title, j.salary AS Salary ,d.name as Department , CONCAT(m.first_name, ' ' , m.last_name) AS Manager
        FROM employees AS e
        JOIN jobroles AS j ON e.role_id = j.id
        JOIN departments AS d ON j.department_id = d.id
        LEFT JOIN employees m ON m.id = e.manager_id
        WHERE d.id = ?`, [item]) 
       return result[0];
    } catch (err) {
        console.log("error found \n" + err)
    }    
};


deleteDepartment = async (filterId) => {
    try {
        const result = await connection.query(
            `DELETE FROM departments WHERE id = ? `, [filterId]
        );
        
    } catch (err) {
        console.log("error found \n" + err)
    }  
}

deleteRole = async (filterId) => {
    try {
        const result = await connection.query(
            `DELETE FROM jobroles WHERE id = ? `, [filterId]
        );
        
    } catch (err) {
        console.log("error found \n" + err)
    }  
}

deleteEmployee = async (filterId) => {
    try {
        const result = await connection.query(
            `DELETE FROM employees WHERE id = ? `, [filterId]
        );
        
    } catch (err) {
        console.log("error found \n" + err)
    }  
}



module.exports = allDepartments ;