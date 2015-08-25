class Role {
  constructor(callerContext) {
    this._callerContext = callerContext;
    this._DOMElement = new DOMElement();
  }

  _returnRolesContainer() {
    const $roles = this._DOMElement._createNewElement('div', 'roles', '', '');
    $roles.append(this._DOMElement._createNewElement('div', 'heading borderedBelow', 'ROLES', ''));
    return $roles;
  }

  _addRole() {
    const role = prompt("Enter Role Name");
    const date = new Date();
    const id = date.getTime();
    const $roleDiv = this._DOMElement._createNewElement('div', 'rolesRole', `<b>${role}</b>`, id);
    this._confirmRoleBeforeAdding(role, $roleDiv, id);
  }

  _confirmRoleBeforeAdding(role, $roleDiv, id) {
    if (role) {
      this._callerContext._$roles.append(this._returnNewRole($roleDiv, id));
    }
  }

  _returnNewRole(roleDiv, id) {
    return roleDiv
      .prepend(this._DOMElement._returnImage('hidden sameRow roleDelete', 'images/delete.jpg', '').data({
        'className': new DataDeleteManager(this._callerContext),
        'methodName': '_deleteData',
        'parameters': 'target, Role',
      }))
      .append(this._DOMElement._returnImage('sameRow roleAdd', 'images/add.jpg', 'Add Employee to this Role').data({
        'className': new EmployeeRoleDropDown(this._callerContext),
        'methodName': '_prepareEmployeeRoleDropDown',
        'parameters': 'target',
      }))
      .append(this._DOMElement._createNewElement('div', id, '', ''))
      .hover(() => {
        roleDiv.find('img.roleDelete').toggleClass('hidden');
      });
  }

  _appendRoleImagesAndSetToggling(target, employeeDiv) {
    const target = $(target);
    target.next('div')
      .append(employeeDiv.append(
        this._DOMElement._returnImage('hidden sameRow roleEmployeeDelete', 'images/delete.jpg', '').data({
          'className': new DataDeleteManager(this._callerContext),
          'methodName': '_deleteRoleEmployee',
          'parameters': 'target',})
      )
      .hover(() => {
        employeeDiv.find('img.roleEmployeeDelete').toggleClass('hidden');
      }));
  }
}

