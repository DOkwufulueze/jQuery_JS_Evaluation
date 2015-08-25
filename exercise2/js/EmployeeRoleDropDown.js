class EmployeeRoleDropDown {
  constructor(callerContext) {
    this._callerContext = callerContext;
    this._DOMElement = new DOMElement();
    this._Role = new Role(this._callerContext);
  }

  _returnEmployeeRoleDropDown() {
    const $employeeRoleDropDown = this._DOMElement._createNewElement('select', 'hidden', '', '');
    return $employeeRoleDropDown;
  }

  _addEventListener() {
    this._callerContext._$employeeRoleDropDown.on('change', () => {
      this._employee = this._callerContext._$employeeRoleDropDown
      .children('option')
      .filter(':selected')
      .text();
      this._employeeClass = this._callerContext._$employeeRoleDropDown.val();
      this._updateOnChange();
    });
  }

  _prepareEmployeeRoleDropDown(target) {
    const target = $(target);
    const employees = $('div.employees div.employeesEmployee');
    this._callerContext._$employeeRoleDropDown.html(this._DOMElement._returnOption('Select Employee', ''));
    this._populateEmployeeRoleDropDownWithEmployees(employees, target);
  }

  _populateEmployeeRoleDropDownWithEmployees(employees, target) {
    if (employees.length) {
      employees.each((index, employee) => {
        this._callerContext._$employeeRoleDropDown.append(this._DOMElement._returnOption($(employee).text(), $(employee).attr('id')));
      });

      this._revealEmployeeRoleDropDown();
      this._updateTarget(target);
    }
  }

  _revealEmployeeRoleDropDown() {
    this._callerContext._$employeeRoleDropDown.removeClass('hidden').addClass('revealed');
  }

  _updateTarget(target) {
    this._callerContext._target = target;
  }

  _updateOnChange() {
    const target = $(this._callerContext._target);
    const className = target.closest('div').attr('id');
    const role = target.closest('div').text();
    this._checkForExistenceAndContinue(target, className, role, this._employeeClass, this._employee);
  }

  _checkForExistenceAndContinue(target, className, role, employeeClass, employee) {
    const target = $(target);
    if (!target.siblings('div').find(`div.${employeeClass}`).length) {
      const $employeeDiv = this._DOMElement._createNewElement('div', `${className} ${employeeClass}`, employee, '');
      this._Role._appendRoleImagesAndSetToggling(target, $employeeDiv);
      this._callerContext._initializeToDo(className, role, employeeClass, employee);
      this._callerContext._$employeeRoleDropDown.removeClass('revealed').addClass('hidden');
    } else {
      alert(':::Employee/Role combination already exists.');
      this._prepareEmployeeRoleDropDown(target);
    }
  }
}

