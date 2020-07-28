import { Express } from 'express';
import { EmployeesController } from '../controllers/employees-controller';

export class EmployeesRoutesRegistrar {
  static registerRoutes(app: Express, controller: EmployeesController) {
    app.route('/employees-count')
      .get((_req, res) => {
        res.json(controller.getEmployeesCount());
      });
  }
}
