const express = require("express");
const employeeController = require("../../controllers/employeesController");

const router = express.Router();

router
  .route("/")
  .get(employeeController.getAllEmployees)
  .post(employeeController.postNewEmployee)
  .put(employeeController.updateEmployee)
  .delete(employeeController.deleteEmployee);

router.route("/:id").get(employeeController.getEmployee);

module.exports = router;
