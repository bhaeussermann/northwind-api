export interface Employee {
  lastName: string;
  firstName: string;
  title: string;
  birthDate: string;
}

export interface EmployeeWithId extends Employee {
  id: number;
}
