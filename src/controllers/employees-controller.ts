import { Pool } from 'pg';
import { Employee, EmployeeWithId } from '../models/employee';
import moment = require('moment');

export class EmployeesController {
  private pool: Pool;
  
  constructor() {
    this.pool = new Pool();
  }

  async getEmployees(): Promise<EmployeeWithId[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT "EmployeeID" id, "LastName" lastname, "FirstName" firstname, "Title" title, "BirthDate" birthdate FROM Employees');
      return result.rows.map(r => ({
        id: r.id,
        lastName: r.lastname,
        firstName: r.firstname,
        title: r.title,
        birthDate: !r.birthdate ? null : moment(r.birthdate).format('yyyy-MM-DD')
      }));
    } finally {
      client.release();
    }
  }

  async addEmployee(employee: Employee): Promise<number> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO Employees ("LastName", "FirstName", "Title", "BirthDate") VALUES ($1::text, $2::text, $3::text, $4::date) RETURNING "EmployeeID" id',
        [ employee.lastName, employee.firstName, employee.title, employee.birthDate ]);
      return result.rows[0].id;
    } finally {
      client.release();
    }
  }
}
