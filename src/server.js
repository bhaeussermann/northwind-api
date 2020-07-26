'use strict';
require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const routes = require('./routes/employees-routes');
routes(app);

app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + ' not found' });
});

app.listen(port);

console.log('Employees API server started on port ' + port);
