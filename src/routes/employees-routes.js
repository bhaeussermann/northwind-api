'use strict';
module.exports = app => {
  const controller = require('../controllers/employees-controller');

  app.route('/employees-count')
    .get(controller.getEmployeesCount);
};
