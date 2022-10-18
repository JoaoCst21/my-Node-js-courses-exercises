const path = require("path");
const fsPromises = require("fs").promises;

const data = {};
data.employees = require("../model/employees.json");

const updateFileEmployees = async (dataFile) => {
  const pathFile = path.join(__dirname, "../model", "employees.json");
  const employeesData = JSON.stringify(dataFile, "", 2);

  // update file employees
  await fsPromises.writeFile(pathFile, employeesData, "utf-8");
};

const getAllEmployees = (request, response) => {
  console.log(data.employees);
  response.json(data.employees);
};

const postNewEmployee = async (request, response) => {
  const { firstname, lastname } = request.body;

  // create a new employee
  const id = data.employees.at(-1).id + 1;
  const newEmployee = { id, firstname, lastname };

  // update array employees
  data.employees.push(newEmployee);

  // update file employee
  await updateFileEmployees(data.employees);

  // send Response
  response.json(newEmployee);
};

const updateEmployee = async (request, response) => {
  // received updated employee
  const employee = request.body;

  // update array employees
  const index = data.employees.findIndex(({ id }) => id === employee.id);
  data.employees[index] = employee;

  // update file employees
  await updateFileEmployees(data.employees);

  // send Response
  response.json(employee);
};

const deleteEmployee = async (request, response) => {
  const { id } = request.body;

  // find Element
  const index = data.employees.findIndex((employee) => employee.id === id);

  // delete the element of the array;
  const employeeDeleted = data.employees.splice(index, 1);

  // update file employees
  await updateFileEmployees(data.employees);

  response.json(employeeDeleted);
};

const getEmployee = (request, response) => {
  const { id } = request.params;

  // find Element
  const index = data.employees.findIndex((employee) => employee.id === +id);

  // get the element of the array;
  const [employee] = data.employees.slice(index, index + 1);
  response.json(employee);
};

module.exports = {
  getAllEmployees,
  postNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
