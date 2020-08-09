import { Express } from 'express';
import * as asyncHandler from 'express-async-handler';
import { EmployeesController } from '../controllers/employees-controller';
import { ExpressError } from '../express-error';

export class EmployeesRoutesRegistrar {
  static registerRoutes(app: Express, controller: EmployeesController) {
    app.route('/employees')
      .get(asyncHandler(async (_req, res) => {
        res.json(await controller.getEmployees());
      }))
      .post(asyncHandler(async (req, res) => {
        res.json(await controller.addEmployee(req.body));
      }));
    
    app.route('/employees/:employeeID')
      .get(asyncHandler(async (req, res) => {
        const employeeID = +req.params.employeeID;
        const employee = await controller.getEmployeeDetail(employeeID);
        if (employee) res.json(employee);
        else throw new ExpressError(404, `Employee with ID ${employeeID} not found.`);
      }));
  }
}
