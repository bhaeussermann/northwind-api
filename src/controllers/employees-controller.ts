import { Pool } from 'pg';
import { Employee } from '../models/employee';
import moment = require('moment');

export class EmployeesController {
  private pool: Pool;
  
  constructor() {
    this.pool = new Pool();
  }

  async getEmployees(): Promise<Employee[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT "EmployeeID" id, "LastName" lastname, "FirstName" firstname, "Title" title, "BirthDate" birthdate FROM Employees');
      return result.rows.map(r => ({
        id: r.id,
        lastName: r.lastname,
        firstName: r.firstname,
        title: r.title,
        birthDate: moment(r.birthdate).format('yyyy-MM-DD')
      }));
    } finally {
      client.release();
    }
  }
}
