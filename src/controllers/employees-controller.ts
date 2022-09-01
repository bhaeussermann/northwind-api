import { Pool } from 'pg';
import * as Cursor from 'pg-cursor';
import { Employee, EmployeeWithId } from '../models/employee';
import moment = require('moment');
import { EmployeeNotFoundError } from './employee-not-found-error';

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
        new Cursor('SELECT "employee_id" id, "last_name" lastname, "first_name" firstname, "title" title, "birth_date" birthdate FROM employees'));
      let employees: EmployeeWithId[] = [];
      let didReadRows: boolean;
      do {
        const rows = await this.readRows(cursor, 100);
        for (const row of rows) {
          employees.push(this.getEmployeeFromRow(row));
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

  async getEmployeeDetail(employeeId: number): Promise<EmployeeWithId> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        `SELECT "employee_id" id, "last_name" lastname, "first_name" firstname, "title" title, "birth_date" birthdate FROM employees
        WHERE "employee_id" = $1::integer
        `, [ employeeId ]);
      if (!result.rows.length) throw new EmployeeNotFoundError(employeeId);
      return this.getEmployeeFromRow(result.rows[0]);
    }
    finally {
      client.release();
    }
  }

  async addEmployee(employee: Employee): Promise<number> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO employees ("last_name", "first_name", "title", "birth_date") VALUES ($1::text, $2::text, $3::text, $4::date) RETURNING "employee_id" id',
        [ employee.lastName, employee.firstName, employee.title, employee.birthDate ]);
      return result.rows[0].id;
    } finally {
      client.release();
    }
  }

  async updateEmployee(employeeId: number, employee: Employee): Promise<void> {
    let assignmentsExpressions = [];
    let parameters = [ employeeId ];

    const addAssignment = (columnName: string, value: any, valueType: 'text' | 'integer' | 'date' = 'text') => {
      parameters.push(value);
      assignmentsExpressions.push(`"${columnName}" = $${parameters.length}::${valueType}`);
    };

    if (employee.lastName) addAssignment('last_name', employee.lastName);
    if (employee.firstName) addAssignment('first_name', employee.firstName);
    if (employee.title) addAssignment('title', employee.title);
    if (employee.birthDate) addAssignment('birth_date', employee.birthDate, 'date');

    const client = await this.pool.connect();
    try {
      const result = await client.query(
        `UPDATE employees SET ${assignmentsExpressions.join(', ')} WHERE "employee_id" = $1::integer`,
        parameters);
      if (!result.rowCount) throw new EmployeeNotFoundError(employeeId);
    } finally {
      client.release();
    }
  }

  async deleteEmployee(employeeId: number): Promise<void> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('DELETE FROM employees WHERE "employee_id" = $1::integer', [ employeeId ]);
      if (!result.rowCount) throw new EmployeeNotFoundError(employeeId);
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

  private getEmployeeFromRow(row: any): EmployeeWithId {
    return {
      id: row.id,
      lastName: row.lastname,
      firstName: row.firstname,
      title: row.title,
      birthDate: !row.birthdate ? null : moment(row.birthdate).format('yyyy-MM-DD')
    };
  }
}
