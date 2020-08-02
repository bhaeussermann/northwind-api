import { Express } from 'express';
import * as asyncHandler from 'express-async-handler';
import { EmployeesController } from '../controllers/employees-controller';

export class EmployeesRoutesRegistrar {
  static registerRoutes(app: Express, controller: EmployeesController) {
    app.route('/employees')
      .post(asyncHandler(async (_req, res) => {
        res.json(await controller.addEmployee());
      }));
  }
}
