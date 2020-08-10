import { Express } from 'express';
import * as asyncHandler from 'express-async-handler';
import { EmployeesController } from '../controllers/employees-controller';
import { ExpressError } from '../express-error';
import { EmployeeNotFoundError } from '../controllers/employee-not-found-error';

export class EmployeesRoutesRegistrar {
  static registerRoutes(app: Express, controller: EmployeesController) {
    app.route('/employees')
      .get(asyncHandler(async (_req, res) => {
        res.json(await controller.getEmployees());
      }))
      .post(asyncHandler(async (req, res) => {
        res.json(await controller.addEmployee(req.body));
      }));
    
    app.route('/employees/:employeeId')
      .get(asyncHandler(async (req, res) => {
        try {
          res.json(await controller.getEmployeeDetail(+req.params.employeeId));
        } catch (error) {
          if (error instanceof EmployeeNotFoundError) throw new ExpressError(404, error.message);
          throw error;
        }
      }))
      .delete(asyncHandler(async (req, res) => {
        try {
          await controller.deleteEmployee(+req.params.employeeId);
          res.sendStatus(200);
        } catch (error) {
          if (error instanceof EmployeeNotFoundError) throw new ExpressError(404, error.message);
          throw error;
        }
      }));
  }
}
