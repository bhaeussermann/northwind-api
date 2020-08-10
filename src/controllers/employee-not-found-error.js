export class EmployeeNotFoundError extends Error {
  constructor(employeeId) {
    super(`Employee with ID ${employeeId} not found.`);
  }
}
