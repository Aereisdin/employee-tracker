const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { get } = require('lodash');
const roleList = [];
const empList = [];

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: 'ANgrc213',
  database: 'workplace_db',
});

connection.connect((err) => {
  if (err) throw err;
  runSearch();
});

const runSearch = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'See current employees, departments and roles',
        'Add an employee',
        'Update an employee',
        'Delete an employee',
        'Add a department',
        'Update a department',
        'Delete a department',
        'Add a role',
        'Update a role',
        'Delete a role',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'See current employees, departments and roles':
          displayAll();
          break;

        case 'Add an employee':
          addEmp();
          break;

        case 'Find data within a specific range':
          rangeSearch();
          break;

        case 'Search for a specific song':
          songSearch();
          break;

        case 'Find artists with a top song and top album in the same year':
          songAndAlbumSearch();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

const displayAll = () => {
      const query = `SELECT Employee.First_Name, Employee.Last_Name, Role.Title, Role.Salary, Department.Department_Name, Manager.First_Name AS Manager_First, Manager.Last_Name AS Manager_Last FROM Employee INNER JOIN Role ON Employee.role_id = Role.id INNER JOIN Department ON Role.department_id = Department.id LEFT JOIN Employee AS Manager ON Employee.manager_id = Manager.id;`;
      connection.query(query, (err, res) => {
         const table = cTable.getTable(res);
         console.log(`\n`+table)
        runSearch();
      });
    };
const getInfo = () => {
  const getRoleList = `SELECT title FROM Role`;
  const getEmpName = `SELECT First_Name, Last_Name FROM Employee`;
  connection.query(getRoleList, (err, res) => {
    res.forEach(({title}) => roleList.push(`${title}`))
    console.log(roleList)
  });
  connection.query(getEmpName, (err, res) => {
    res.forEach(({First_Name, Last_Name}) => empList.push(`${First_Name} ${Last_Name}`))
    console.log(empList)
  });
}
const addEmp = () => {
  getInfo();
  inquirer.prompt({
    type: 'list',
    name: 'role',
    message: 'Please select the role of the employee',
    choices: [...roleList]
  },
  {
    type: 'list',
    name: 'manager',
    message: 'Please select the manager of the employee',
    choices: [...empList]
  },
  {
    type: 'input',
    name: 'last',
    message: 'Please input the first name of the employee'
  },
  {
    type: 'input',
    name: 'last',
    message: 'Please input the last name of the employee'
  })
  .then((answers) => { 
    const query =`INSERT INTO Employee('first_name', 'last_name', 'role_id', 'manager_id') VALUES (?, ?, ?, ?)`;
  connection.query(query, [answers.first, answers.last, answers.role, answers.manager], (err, res) => {
    console.log(`Added New Employee`);
    runSearch();
  })
  })
  .catch(err)

const rangeSearch = () => {
  inquirer
    .prompt([
      {
        name: 'start',
        type: 'input',
        message: 'Enter starting position: ',
        validate(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        },
      },
      {
        name: 'end',
        type: 'input',
        message: 'Enter ending position: ',
        validate(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        },
      },
    ])
    .then((answer) => {
      const query =
        'SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?';
      connection.query(query, [answer.start, answer.end], (err, res) => {
        res.forEach(({ position, song, artist, year }) => {
          console.log(
            `Position: ${position} || Song: ${song} || Artist: ${artist} || Year: ${year}`
          );
        });
        runSearch();
      });
    });
};

const songSearch = () => {
  inquirer
    .prompt({
      name: 'song',
      type: 'input',
      message: 'What song would you like to look for?',
    })
    .then((answer) => {
      console.log(answer.song);
      connection.query(
        'SELECT * FROM top5000 WHERE ?',
        { song: answer.song },
        (err, res) => {
          if (res[0]) {
            console.log(
              `Position: ${res[0].position} || Song: ${res[0].song} || Artist: ${res[0].artist} || Year: ${res[0].year}`
            );
          } else {
            console.error(`No results for ${answer.song}`);
          }
          runSearch();
        }
      );
    });
};

const songAndAlbumSearch = () => {
  inquirer
    .prompt({
      name: 'artist',
      type: 'input',
      message: 'What artist would you like to search for?',
    })
    .then((answer) => {
      let query =
        'SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist ';
      query +=
        'FROM top_albums INNER JOIN top5000 ON (top_albums.artist = top5000.artist AND top_albums.year ';
      query +=
        '= top5000.year) WHERE (top_albums.artist = ? AND top5000.artist = ?) ORDER BY top_albums.year, top_albums.position';

      connection.query(query, [answer.artist, answer.artist], (err, res) => {
        console.log(`${res.length} matches found!`);
        res.forEach(({ year, position, artist, song, album }, i) => {
          const num = i + 1;
          console.log(
            `${num} Year: ${year} Position: ${position} || Artist: ${artist} || Song: ${song} || Album: ${album}`
          );
        });

        runSearch();
      });
    });
}};
