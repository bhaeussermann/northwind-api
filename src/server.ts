import * as express from 'express';
import { EmployeesRoutesRegistrar } from './routes/employees-routes-registrar';
import { EmployeesController } from './controllers/employees-controller';

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

EmployeesRoutesRegistrar.registerRoutes(app, new EmployeesController());

app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + ' not found' });
});

app.listen(port);

console.log('Employees API server started on port ' + port);
