const inquirer = require('inquirer');
const db = require('./server_promise');

 


const promptStart = () => {
    return inquirer.prompt([ 
        {
            type: 'list',
            name: 'choice',
            message: 'What do would you like to do',
            choices:    ["view all departments",
                        "view all roles",
                        "view all employees",
                        "add a department",
                        "add a role",
                        "add an employee",
                        "update an employee role"]
        }
    ]);
};


const promptAddDepartment = () => {
    return inquirer.prompt([
        {
            name: 'newDepartment',
            type: 'input',
            message: 'What is the name for the new department?',
            validate: nameInput => {
                if(nameInput){
                  return true;
                } else {
                  console.log("please enter new department name");
                  return false;
                }
              }
        }
    ]).then(res => {
        console.log("Call create new dopartement with name:" + res.newDepartment);
    });

};


const promptAddRole = (list) => {
    return inquirer.prompt([
        {
            name: 'newRoleTitle',
            type: 'input',
            message: 'What is the title for the new role?',
            validate: nameInput => {
                if(nameInput){
                  return true;
                } else {
                  console.log("please enter new role title");
                  return false;
                }
              }
        },
        {
            name: 'newRoleSalary',
            type: 'input',
            message: 'What is the salary for the new role?',
            validate: nameInput => {
                if(nameInput){
                  return true;
                } else {
                  console.log("please enter a salary");
                  return false;
                }
              }
        },
        {
            name: 'newRoleDepartment',
            type: 'list',
            message: 'Choose a Department?',
            choices: list
            
            
        }
    
    ]).then(res => {
        console.log("Call create new role in res. with name: " + res.newRoleDepartment);
    });

};



promptStart().then(res =>{
    switch(res.choice){
        case "view all departments":
            console.log("Call run veiw all depts");
            break;
        case "view all roles":
            console.log("Call run veiw all roles");
            break;
        case "view all employees":
            console.log("Call run veiw all emps");
            break;
        case "add a department":
            promptAddDepartment();
            break;
        case "add a role":
            allDepartments().then(res =>{
                var deptlist = res.map(l => l.Department);
                promptAddRole(deptlist);
            });
            break;
           
          
        case "add an employee":
                console.log("Call add emp.");
                break;
        case "update an employee role":
            console.log(" Call update an employee role");
            break;


    }
    
    
    
    
    
});