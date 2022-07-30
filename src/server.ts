import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as swaggerUi from 'swagger-ui-express';
import * as yaml from 'yamljs';
import * as OpenApiValidator from 'express-openapi-validator';
import { EmployeesRoutesRegistrar } from './routes/employees-routes-registrar';
import { EmployeesController } from './controllers/employees-controller';

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const apiSpec = yaml.load('./dist/api-spec.yaml');
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(apiSpec));

const validator = OpenApiValidator.middleware({
  apiSpec: './dist/api-spec.yaml',
  validateRequests: true,
  validateResponses: true
});
app.use(validator);

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
