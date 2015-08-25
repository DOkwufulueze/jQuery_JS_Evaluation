class Employee {
  constructor(callerContext) {
    this._callerContext = callerContext;
    this._DOMElement = new DOMElement();
  }

  _returnEmployeesContainer() {
    const $employees = this._DOMElement._createNewElement('div', 'employees', '', '');
    $employees.append(this._DOMElement._createNewElement('div', 'heading borderedBelow', 'Employees', ''));
    return $employees;
  }

  _addEmployee() {
    const employee = prompt("Enter Employee Name");
    const date = new Date();
    const id = date.getTime();
    const $employeeDiv = this._DOMElement._createNewElement('div', 'employeesEmployee', employee, id);
    this._confirmEmployeeBeforeAdding(employee, $employeeDiv);
  }

  _confirmEmployeeBeforeAdding(employee, $employeeDiv) {
    if (employee) {
      this._callerContext._$employees.append(this._newEmployee($employeeDiv));
    }
  }

  _newEmployee(employeeDiv) {
    return employeeDiv.append(this._DOMElement._returnImage('hidden sameRow employeeDelete', 'images/delete.jpg', '').data({
      'className': new DataDeleteManager(this._callerContext),
      'methodName': '_deleteData',
      'parameters': 'target, Employee',
    }))
      .hover(() => {
        employeeDiv.find('img.employeeDelete').toggleClass('hidden');
      });
  }
}

