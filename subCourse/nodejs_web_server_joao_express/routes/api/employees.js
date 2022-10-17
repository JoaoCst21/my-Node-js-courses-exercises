const express = require("express");
const path = require("path");
const fsPromises = require("fs").promises;

const router = express.Router();
const data = {};
data.employees = require("../../data/employees.json");

const updateFileEmployees = async (dataFile) => {
  const pathFile = path.join(__dirname, "../../data", "employees.json");
  const employeesData = JSON.stringify(dataFile, "", 2);

  // update file employees
  await fsPromises.writeFile(pathFile, employeesData, "utf-8");
};

router
  .route("/")
  .get((request, response) => {
    response.json(data.employees);
  })
  .post(async (request, response) => {
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
  })
  .put(async (request, response) => {
    // received updated employee
    const employee = request.body;
    console.log({ employee });

    // update array employees
    const index = data.employees.findIndex(({ id }) => id === employee.id);
    data.employees[index] = employee;

    // update file employees
    await updateFileEmployees(data.employees);

    // send Response
    response.json(employee);
  })
  .delete(async (request, response) => {
    const { id } = request.body;

    // find Element
    const index = data.employees.findIndex((employee) => employee.id === id);

    // delete the element of the array;
    const employeeDeleted = data.employees.splice(index, 1);

    // update file employees
    await updateFileEmployees(data.employees);

    response.json(employeeDeleted);
  });

router
  .route("/:id")
  .get((request, response) => {
    const { id } = request.params;
    response.json({ id });
  })
  .post((request, response) => {
    const { firstname, lastname } = request.params;
    response.json({
      firstname,
      lastname,
    });
  })
  .put((request, response) => {
    const { firstname, lastname } = request.params;
    response.json({
      firstname,
      lastname,
    });
  })
  .delete((request, response) => {
    const { id } = request.params;
    response.json({ id });
  });

module.exports = router;
