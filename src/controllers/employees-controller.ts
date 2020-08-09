import { Pool } from 'pg';
import * as Cursor from 'pg-cursor';
import { Employee, EmployeeWithId } from '../models/employee';
import moment = require('moment');

export class EmployeesController {
  private pool: Pool;
  
  constructor() {
    this.pool = new Pool();
  }

  async getEmployees(): Promise<EmployeeWithId[]> {
    const client = await this.pool.connect();
    let cursor: Cursor;
    try {
      cursor = await client.query(
        new Cursor('SELECT "EmployeeID" id, "LastName" lastname, "FirstName" firstname, "Title" title, "BirthDate" birthdate FROM Employees'));
      let employees: EmployeeWithId[] = [];
      let didReadRows: boolean;
      do {
        const rows = await this.readRows(cursor, 100);
        for (const row of rows) {
          employees.push({
            id: row.id,
            lastName: row.lastname,
            firstName: row.firstname,
            title: row.title,
            birthDate: !row.birthdate ? null : moment(row.birthdate).format('yyyy-MM-DD')
          });
        }
        didReadRows = !!rows.length;
      }
      while (didReadRows);
      return employees;
    } finally {
      cursor?.close();
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

  private readRows(cursor: Cursor, rowCount: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      cursor.read(rowCount, (error, rows) => {
        if (error) reject(error);
        else resolve(rows);
      });
    });
  }
}
