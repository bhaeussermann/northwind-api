import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import { OpenApiValidator } from 'express-openapi-validator';
import { EmployeesRoutesRegistrar } from './routes/employees-routes-registrar';
import { EmployeesController } from './controllers/employees-controller';

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

new OpenApiValidator({
  apiSpec: './dist/api-spec.yaml',
  validateRequests: true,
  validateResponses: true
})
.install(app)
.then(() => {
  EmployeesRoutesRegistrar.registerRoutes(app, new EmployeesController());

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors
    });
  });

  http.createServer(app).listen(port);
  console.log('Employees API server started on port ' + port);
});
