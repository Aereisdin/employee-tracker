const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const { get } = require("lodash");


const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Be sure to update with your own MySQL password!
  password: "ANgrc213",
  database: "workplace_db",
});

connection.connect((err) => {
  if (err) {
    throw err;
  }
  runSearch();
});

const runSearch = () => {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Display current employees, their roles and departments",
        "Add an employee",
        "Update an employee",
        "Delete an employee",
        "Display departments",
        "Add a department",
        "Update a department",
        "Delete a department",
        "Display roles",
        "Add a role",
        "Update a role",
        "Delete a role",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
      case "Display current employees, their roles and departments":
        displayAll();
        break;

      case "Add an employee":
        addEmp();
        break;

      case "Update an employee":
        updateEmp();
        break;

      case "Delete an employee":
        deleteEmp();
        break;

      case "Display departments":
        seeDept();
        break;

      case "Add a department":
        addDept();
        break;

      case "Update a department":
        updateDept();
        break;
  
      case "Delete a department":
        deleteDept();
        break;

      case "Display roles":
        seeRole();
        break;

      case "Add a role":
        addRole();
        break;

      case "Update a role":
        updateRole();
        break;

      case "Delete a role":
        deleteRole();
        break;

      default:
        console.log(`Invalid action: ${answer.action}`);
        break;
      }
    });
};

const displayAll = () => {
  const query = "SELECT Employee.First_Name AS 'First Name', Employee.Last_Name AS 'Last Name', Role.Title, Role.Salary, Department.Department_Name AS 'Department', Manager.First_Name AS 'Manager First Name', Manager.Last_Name AS 'Manager Last Name' FROM Employee INNER JOIN Role ON Employee.role_id = Role.id INNER JOIN Department ON Role.department_id = Department.id LEFT JOIN Employee AS Manager ON Employee.manager_id = Manager.id;";
  connection.query(query, (err, res) => {
    const table = cTable.getTable(res);
    console.log("\n"+table);
    runSearch();
  });
};

const addEmp = () => {
  inquirer.prompt([{
    type: "list",
    name: "role",
    message: "Please select the role of the employee",
    choices: ["Production Manager", "Engineer", "Sales", "Sales Manager"]
  },
  {
    type: "list",
    name: "manager",
    message: "Please select the manager of the employee",
    choices: ["Jonathan Smith - Production", "Lisa Frank - Sales Manager", "Itsuki Hatsumoto - Sales Manager", "Tom Jones - CEO"]
  },
  {
    type: "input",
    name: "first",
    message: "Please input the first name of the employee"
  },
  {
    type: "input",
    name: "last",
    message: "Please input the last name of the employee"
  }])
  .then((answers) => {
    if(answers.role === "Production Manager"){answers.role = 2}
    else if(answers.role === "Engineer"){answers.role = 3}
    else if(answers.role === "Sales Manager"){answers.role = 5}
    else answers.role = 4;
    if(answers.manager === "Jonathan Smith - Production"){answers.manager = 2}
    else if(answers.manager === "Lisa Frank - Sales Manager"){answers.manager = 4}
    else if(answers.manager === "Itsuki Hatsumoto - Sales Manager"){answers.manager = 10}
    else answers.manager = 1;
    connection.query( "INSERT INTO Employee SET ?",
      
      {
        First_Name: answers.first,
        Last_Name: answers.last,
        role_id: answers.role || 0,
        manager_id: answers.manager || 0,
      },
      displayAll());
  })
  .catch((err) => console.error(err));
};

const updateEmp = () => {
  inquirer.prompt([{
    type: "input",
    name: "employee",
    message: "Please enter the first and last name of the employee you wish to update",
  },
  {
    type: "list",
    name: "role",
    message: "Please select the new role of the employee",
    choices: ["Production Manager", "Engineer", "Sales", "Sales Manager"]
  },
  {
    type: "list",
    name: "manager",
    message: "Please select the new manager of the employee",
    choices: ["Jonathan Smith - Production", "Lisa Frank - Sales Manager", "Itsuki Hatsumoto - Sales Manager", "Tom Jones - CEO"]
  },
  {
    type: "input",
    name: "first",
    message: "Please input the first name of the employee"
  },
  {
    type: "input",
    name: "last",
    message: "Please input the last name of the employee"
  }])
  .then((ans) => {
    if(ans.role === "Production Manager"){ans.role = 2}
    else if(ans.role === "Engineer"){ans.role = 3}
    else if(ans.role === "Sales Manager"){ans.role = 5}
    else ans.role = 4;
    if(ans.manager === "Jonathan Smith - Production"){ans.manager = 2}
    else if(ans.manager === "Lisa Frank - Sales Manager"){ans.manager = 4}
    else if(ans.manager === "Itsuki Hatsumoto - Sales Manager"){ans.manager = 10}
    else ans.manager = 1;
    var fullName = ans.employee;
    var name = fullName.split(' ');
    connection.query( `UPDATE Employee SET ? WHERE First_Name = "${name[0]}" AND Last_Name = "${name[1]}"`,
      
      {
        First_Name: ans.first,
        Last_Name: ans.last,
        role_id: ans.role || 0,
        manager_id: ans.manager || 0,
      },
      displayAll());
  })
  .catch((err) => console.error(err));
}

const deleteEmp = () => {
  inquirer.prompt([{
    type: "input",
    name: "employee",
    message: "Please enter the first and last name of the employee you wish to delete",
  }])
  .then((ans) => {
    var fullName = ans.employee;
    var name = fullName.split(' ');
    connection.query( `DELETE FROM Employee WHERE First_Name = "${name[0]}" AND Last_Name = "${name[1]}"`,
      displayAll());
})
  .catch((err) => console.error(err));
}

const seeDept = () => {
  const query = "SELECT Department.Department_Name AS 'Current Departments', Department.id AS 'Department Number' FROM Department;";
  connection.query(query, (err, res) => {
    const table = cTable.getTable(res);
    console.log("\n"+table);
    runSearch();
  });
};

const addDept = () => {
  inquirer.prompt([{
    type: "input",
    name: "department",
    message: "Please enter the name of the new department you wish to add",
  }])
    .then((ansAddDept) => {
      connection.query( "INSERT INTO Department SET ?",
        
        {
          Department_Name: ansAddDept.department
        },
        displayAll());
    })
    .catch((err) => console.error(err));
  }

const updateDept = () => {
  inquirer.prompt([{
    type: "input",
    name: "olddept",
    message: "Please enter the department name you wish to update",
  },
  {
    type: "input",
    name: "newdept",
    message: "Please input the new department name"
  }
  ])
  .then((deptUp) => {
    connection.query( `UPDATE Department SET ? WHERE Department_Name = '${deptUp.olddept}' ;`,
      
      {
        Department_Name: deptUp.newdept           
      },
      displayAll());
  })
  .catch((err) => console.error(err));
}

const deleteDept = () => {
  inquirer.prompt([{
    type: "input",
    name: "dept",
    message: "Please enter the name of the department you wish to delete",
  }])
  .then((deleteDept) => {
    connection.query( `DELETE FROM Department WHERE Department_Name = "${deleteDept.dept}"`,
      displayAll());
})
  .catch((err) => console.error(err));
}

const seeRole = () => {
  const query = "SELECT Role.Title AS 'Title', Role.Salary AS 'Gross Pay Per Month' FROM Role;";
  connection.query(query, (err, res) => {
    const table = cTable.getTable(res);
    console.log("\n"+table);
    runSearch();
  });
};

const addRole = () => {
  inquirer.prompt([{
    type: "input",
    name: "newrole",
    message: "Please enter the name of the new role you wish to add",
  },
  {
    type: "number",
    name: "salary",
    message: "Please enter the amount for gross monthly pay",
  },
  {
    type: "number",
    name: "roledept",
    message: "Please enter the number of the department where this new role will work",
  }
  ])
  .then((ansAddRole) => {
    connection.query( "INSERT INTO Role SET ?",
      {
        Title: ansAddRole.newrole,
        Salary: ansAddRole.salary,
        department_id: ansAddRole.roledept
      },
      displayAll());
  })
  .catch((err) => console.error(err));
  }

  const updateRole = () => {
    inquirer.prompt([{
      type: "input",
      name: "oldrole",
      message: "Please enter the role you wish to update",
    },
    {
      type: "input",
      name: "newrole",
      message: "Please input the new role name"
    },
    {
      type: "number",
      name: "salary",
      message: "Please input the new salary"
    },
    {
      type: "number",
      name: "newdept",
      message: "Please input the new department number for this role"
    }
    ])
    .then((roleUp) => {
      connection.query( `UPDATE Role SET ? WHERE Title = '${roleUp.oldrole}' ;`,
        {
          Title: roleUp.newrole,
          Salary: roleUp.salary,
          department_id: roleUp.newdept
        },
        displayAll());
    })
    .catch((err) => console.error(err));
  }
  
const deleteRole = () => {
  inquirer.prompt([{
    type: "input",
    name: "role",
    message: "Please enter the name of the role you wish to delete",
  }])
  .then((deleteRole) => {
    connection.query( `DELETE FROM Role WHERE Title = "${deleteRole.role}"`,
      displayAll());
})
  .catch((err) => console.error(err));
}
