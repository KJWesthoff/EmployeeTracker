const inquirer = require('inquirer');
const db = require('./server_promise');
const cTable = require('console.table');
 


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
       addDepartment(res.newDepartment);
    });

};


const promptAddRole = async() => {
    // Quere the databas for the current list of departements
    let deptlist = await allDepartments()
    
    // destructure for use in inquirer list
    list = deptlist.map(({DeptNo , Department}) => ({name:Department, value:DeptNo}))
    //console.log(list)

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
                if(Number(nameInput)){
                  return true;
                } else {
                  console.log("please enter a salary NUMBER");
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
    
    ]).then(InqRes => { 
        // Deinde inputs and call the add role query functon
        input = {
            title:InqRes.newRoleTitle, 
            salary:InqRes.newRoleSalary,
            department_id: InqRes.newRoleDepartment
        }
        addRole(input);
            


            
    });
};

promptAddEmployee = async () => {
    //firstName, lastName, role_id, manager_id
    const roles = await allRoles();
    const roleslist =  roles.map(({Id , Title}) => ({name:Title, value:Id}))
    const managers = await allEmployees();
    const managerlist = managers.map(({Name, No}) => ({name:Name, value:No})); 

    return inquirer.prompt([
        {
            name: 'newEmployeeFirstName',
            type: 'input',
            message: 'First Name?',
            validate: nameInput => {
                if(nameInput){
                  return true;
                } else {
                  console.log("Please enter First Name");
                  return false;
                }
              }
        },
        {
            name: 'newEmployeeLastName',
            type: 'input',
            message: 'Last Name?',
            validate: nameInput => {
                if(nameInput){
                  return true;
                } else {
                  console.log("Please enter Last Name");
                  return false;
                }
              }
        },
        {
            name: 'newEmployeeRoleNo',
            type: 'list',
            message: 'Choose a Role?',
            choices: roleslist  
        },
        {
            name: 'newEmployeeManagerNo',
            type: 'list',
            message: 'Choose a Manager?',
            choices: managerlist  
        }

    ]).then(empInp => {
        newEmployeeObj = {
            "first_name" : empInp.newEmployeeFirstName,
            "last_name": empInp.newEmployeeLastName,
            "role_id" : empInp.newEmployeeRoleNo,
            "manager_id" : empInp.newEmployeeManagerNo
        };

        addEmployee(newEmployeeObj); 

    });
    
}


promptUpdateEmployee = async () => {
//updateEmployeeRole = (employee_no, new_role_id)
    const roles = await allRoles();
    const roleslist =  roles.map(({Id , Title}) => ({name:Title, value:Id}))
    const employees = await allEmployees();
    const employeeslist = employees.map(({Name, No}) => ({name:Name, value:No})); 

    return inquirer.prompt([
    {
        name: 'employeeNo',
        type: 'list',
        message: 'Who do you want to update?',
        choices: employeeslist  
    },
    {
        name: 'newRoleNo',
        type: 'list',
        message: 'What is the new role?',
        choices: roleslist  
    },

    ]).then(inqRes => {
        updateEmployeeRole(inqRes.employeeNo, inqRes.newRoleNo);
    })

}


function main() {
    promptStart().then(res =>{
        switch(res.choice){
            case "view all departments":
                allDepartments().then(res=>{
                    console.table(cTable.getTable(res));
                }).then(res=>{
                    main()
                });
                break;
            case "view all roles":
                allRoles().then(res=>{
                    console.table(cTable.getTable(res));
                }).then(res=>{
                    main()
                });
                break;
    
            case "view all employees":
                allEmployees().then(res=>{
                    console.table(cTable.getTable(res));
                }).then(res=>{
                    main()
                });
                break;
            case "add a department":
                promptAddDepartment()
                .then(res =>{
                    main();
                });
                
                break;
            case "add a role":    
                    promptAddRole().then(res =>{
                        main();
                    });
              
                break;
            case "add an employee":
                    promptAddEmployee()
                    .then(res =>{
                        main();
                    });;
                    break;
            case "update an employee role":
                promptUpdateEmployee()
                .then(res =>{
                    main();
                });
                break;


        }   
    });
};

main();