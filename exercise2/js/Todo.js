'use strict'

class Todo {

  //Todo constructor
  constructor(body, left, right, roles, employees, addRole, addEmployee, employeeRoleDropDown) {
    this._$body = body;
    this._$left = left;
    this._$right = right;
    this._$roles = roles;
    this._$employees = employees;
    this._$addRole = addRole;
    this._$addEmployee = addEmployee;
    this._$employeeRoleDropDown = employeeRoleDropDown;
    this._init();
  }

  _init() {
    this._setupPage();
    this._addEventListenerToBody();
  }

  _leftSection() {
    return this._$left
      .append(this._$roles.append(this._createNewElement('div', 'heading borderedBelow', 'ROLES')))
      .append(this._$employees.append(this._createNewElement('div', 'heading borderedBelow', 'Employees')));
  }

  _rightSection() {
    return this._$right.append(
      this._createNewElement('div', 'todoSection', '')
        .append(this._createNewElement('div', 'todoHeading heading', 'ToDos'))
        .append(this._createNewElement('div', 'expandCollapse', '')
          .append(this._image('images1 expandAll', 'images/add.jpg', '').data({'methodName': '_expandAll', 'parameters': 'target',}))
          .append(this._image('images1 collapseAll', 'images/collapse.jpg', '').data({'methodName': '_collapseAll', 'parameters': 'target',}))
        )
      );
  }



  _buttons() {
    return $('<div />')
      .append(this._$addRole)
      .append(this._$addEmployee)
  }

  _setupPage() {
    this._$body
      .append($('<div />')
        .append(
          this._leftSection()
        )
        .append(
          this._rightSection()
        )
      )
      .append(
        this._buttons()
      )
      .append(this._createNewElement('div', 'marginDiv', '')).append(this._$employeeRoleDropDown);
  }

  _addEventListenerToBody() {
    this._$body.on('click', (eventObject) => {
      const $target = $(eventObject.target);
      const parameters = $target.data('parameters') ? $target.data('parameters').split(',') : null;
      if (parameters) {
        if (parameters.indexOf('target') >= 0) {
          parameters[parameters.indexOf('target')] = $target;
        }
      }
      
      const methodName = this[`${$target.data('methodName')}`];
      if (typeof methodName === 'function') {
        parameters ? methodName.apply(this, parameters) : methodName.apply(this);
      }
    });
  }

  _addEmployee() {
    const employee = prompt("Enter Employee Name");
    const date = new Date();
    const id = date.getTime();
    const $employeeDiv = this._div('employeesEmployee', employee, id);
    if (employee) {
      this._$employees
        .append(this._newEmployee($employeeDiv));
    }
  }

  _newEmployee(employeeDiv) {
    return employeeDiv.append(this._image('hidden sameRow employeeDelete', 'images/delete.jpg', '').data({'methodName': '_deleteEmployee', 'parameters': 'target',}))
      .hover(() => {
        employeeDiv.find('img.employeeDelete').toggleClass('hidden');
      })
  }

  _addRole() {
    const role = prompt("Enter Role Name");
    const date = new Date();
    const id = date.getTime();
    const $roleDiv = this._div('rolesRole', `<b>${role}</b>`, id);
    if (role) {
      this._$roles
        .append(
          this._newRole($roleDiv, id)
        );
    }
  }

  _newRole(roleDiv, id) {
    return roleDiv
      .prepend(this._image('hidden sameRow roleDelete', 'images/delete.jpg', '').data({'methodName': '_deleteRole', 'parameters': 'target',}))
      .append(this._image('sameRow roleAdd', 'images/add.jpg', 'Add Employee to this Role').data({'methodName': '_addNewEmployeeToRole', 'parameters': 'target',}))
      .append(this._createNewElement('div', id, ''))
      .hover(() => {
        roleDiv.find('img.roleDelete').toggleClass('hidden');
      });
  }

  _addNewEmployeeToRole(target) {
    const target = $(target);
    const employees = $('div.employees div.employeesEmployee');
    this._$employeeRoleDropDown.html(this._option('Select Employee', ''));
    if (employees.length) {
      employees.each((index, employee) => {
        this._$employeeRoleDropDown.append(this._option($(employee).text(), $(employee).attr('id')));
      });

      this._$employeeRoleDropDown.removeClass('hidden').addClass('revealed');
      this._updateOnChange(target);
    }
  }

  _image(className, source, title) {
    return $('<img />', {
      'src': source,
      'class': className,
      'title': title,
    }) ; 
  }

  _div(className, html, id) {
    return $('<div />', {
      'class': className,
      'id': id,
      'html': html,
    });
  }

  _createNewElement(tag, className, html) {
    return $(`<${tag} />`, {
      'class': className,
      'html': html,
    });
  }

  _input(className, placeholder, type, value) {
    return $('<input />', {
      'type': 'text',
      'placeholder': 'Update todo here...',
      'class': 'toDoInput',
      'value': value,
    });
  }

  _option(html, value) {
    return $('<option />', {
      'value': value,
      'html': html,
    });
  }

  _expandAll(target) {
    const target = $(target);
    target.closest('div.todoSection')
      .siblings('div')
      .find('.roleHeader')
      .siblings('div')
      .slideDown(1000);

    this._toggleHeadExpandCollapse(target, 'collapse', 'expand', 'collapse');
  }

  _collapseAll(target) {
    const target = $(target);
    target.closest('div.todoSection')
      .siblings('div')
      .find('.roleHeader')
      .siblings('div')
      .slideUp(1000);

      this._toggleHeadExpandCollapse(target, 'expand', 'collapse', 'add');
  }

  _expand(target) {
    const target = $(target);
    target.closest('div.roleHeader')
      .siblings('div')
      .slideDown(1000);

    this._toggleRoleExpandCollapse(target, 'collapse', 'expand', 'collapse');
  }

  _collapse(target) {
    const target = $(target);
    target.closest('div.roleHeader')
      .siblings('div')
      .slideUp(1000);

    this._toggleRoleExpandCollapse(target, 'expand', 'collapse', 'add');
  }

  _toggleHeadExpandCollapse(target, toAdd, toRemove, imageName) {
    target.closest('div.todoSection')
      .siblings('div')
      .find('.roleHeader')
      .find(`.${toRemove}`)
      .removeClass(toRemove)
      .addClass(toAdd)
      .attr('src', `images/${imageName}.jpg`)
      .data({'methodName': `_${toAdd}`, 'parameters': 'target',});
  }

  _toggleRoleExpandCollapse(target, toAdd, toRemove, imageName) {
    target
      .removeClass(toRemove)
      .addClass(toAdd)
      .attr('src', `images/${imageName}.jpg`)
      .data({'methodName': `_${toAdd}`, 'parameters': 'target',});
  }

  _deleteRole(target) {
    const target = $(target);
    if (confirm(':::Are you sure you want to delete role?')) {
      const className = target.parent('div').attr('id');
      $(`.${className}`).remove();
      $(`div#${className}`).remove();
      this._$employeeRoleDropDown.removeClass('revealed').addClass('hidden');
    }
  }

  _deleteEmployee(target) {
    const target = $(target);
    if (confirm(':::Are you sure you want to delete employee?')) {
      const className = target.closest('div').attr('id');
      $(`.${className}`).remove();
      $(`div#${className}`).remove();
      this._$employeeRoleDropDown.removeClass('revealed').addClass('hidden');
    }
  }

  _deleteRoleEmployee(target) {
    const target = $(target);
    if (confirm(':::Are you sure you want to delete employee from role?')) {
      const className = target.closest('div').parent('div').parent('div').attr('id');
      const employee = target.closest('div').attr('class').split(/\s+/)[1];
      $(`.${className}.${employee}`).remove();
      $('.roleDelete').removeClass('revealed').addClass('hidden');
      this._$employeeRoleDropDown.removeClass('revealed').addClass('hidden');
    }
  }

  _updateOnChange(target) {
    const target = $(target);
    const className = target.closest('div').attr('id');
    const role = target.closest('div').text();
    this._$employeeRoleDropDown.one('change', () => {
      const employee = this._$employeeRoleDropDown.children('option').filter(':selected').text();
      const employeeClass = this._$employeeRoleDropDown.val();
      this._checkForExistenceAndContinue(target, className, role, employeeClass, employee);
    });
  }

  _checkForExistenceAndContinue(target, className, role, employeeClass, employee) {
    const target = $(target);
    if (!target.siblings('div').find(`div.${employeeClass}`).length) {
      const $employeeDiv = this._createNewElement('div', `${className} ${employeeClass}`, employee);
      this._appendImagesAndSetToggling(target, $employeeDiv);
      this._initializeToDo(className, role, employeeClass, employee);
      this._$employeeRoleDropDown.removeClass('revealed').addClass('hidden');
    } else {
      alert(':::Employee/Role combination already exists.');
      this._addNewEmployeeToRole(target);
    }
  }

  _appendImagesAndSetToggling(target, employeeDiv) {
    const target = $(target);
    target.next('div')
      .append(employeeDiv.append(
        this._image('hidden sameRow roleEmployeeDelete', 'images/delete.jpg', '').data({'methodName': '_deleteRoleEmployee', 'parameters': 'target',})
      )
      .hover(() => {
        employeeDiv.find('img.roleEmployeeDelete').toggleClass('hidden');
      }));
  }

  _initializeToDo(roleClass, role, employeeClass, employee) {
    if ($(`div.employeeToDoSection.${roleClass}`).length) {
      this._appendToexistingRole(roleClass, role, employeeClass, employee);
    } else {
      this._appendNewRole(roleClass, role, employeeClass, employee);
    }
  }

  _appendNewRole(roleClass, role, employeeClass, employee) {
    this._$right.append(
      this._createNewElement('div', `employeeToDoSection ${roleClass}`, '')
        .append(this._createNewElement('div', 'roleHeader', role).append(this._image('sameRow expandCollapse collapse', 'images/collapse.jpg', '').data({'methodName': '_collapse', 'parameters': 'target, ""',})))
        .append(
          this._createNewElement('div', `employeeDetails ${roleClass} ${employeeClass}`, '')
            .append(this._createNewElement('div', 'employee', employee))
            .append(this._createNewElement('div', 'employeeTodo', `<span>Add todos for ${employee} here</span>`).append(this._image('sameRow add', 'images/add.jpg', '').data({'methodName': '_addToDo', 'parameters': 'target,',})))
          )
      );
  }

  _appendToexistingRole(roleClass, role, employeeClass, employee) {
    $(`div.employeeToDoSection.${roleClass}`)
      .append(this._createNewElement('div', `employeeDetails ${roleClass} ${employeeClass}`, '')
        .append(this._createNewElement('div', 'employee', employee))
        .append(this._createNewElement('div', 'employeeTodo', `<span>Add todos for ${employee} here</span>`)
          .append(this._image('sameRow add', 'images/add.jpg', '').data({'methodName': '_addToDo', 'parameters': 'target,',}))
        )
      );
  }

  _inputEditSaveDeleteItem(placeholder, value, saveImage, deleteImage) {
    return this._createNewElement('div', 'toDoInputDiv', '')
      .append(this._input('toDoInput', placeholder, 'text', value))
      .append(saveImage)
      .append(deleteImage)
  }

  _addToDo(target, value) {
    const target = $(target);
    const $saveImage = this._image('sameRow save', 'images/save.jpg', '').data({'methodName': '_saveToDo', 'parameters': 'target',});
    const $deleteImage = this._image('sameRow cancel', 'images/delete.jpg', '').data({'methodName': '_cancelToDo', 'parameters': 'target',});
    this._addAccordingToContext(target, value, $saveImage, $deleteImage);
  }

  _addAccordingToContext(target, value, saveImage, deleteImage) {
    const target = $(target);
    if (!target.siblings('div.toDoInputDiv').length) {
      target.closest('div.employeeTodo').find('span').removeClass('revealed').addClass('hidden');
      if (value) {
        this._inputEditSaveDeleteItem('Update todo here...', value, saveImage, deleteImage).insertAfter(target.closest('div.toDoDataDiv'));
        target.closest('div.toDoDataDiv').remove();
      } else {
        target.closest('div.employeeTodo').append(this._inputEditSaveDeleteItem('Add a new todo here...', value, saveImage, deleteImage));
      }
    }
  }

  _cancelToDo(target) {
    const target = $(target);
    if (!target.closest('div.toDoInputDiv').siblings('div.toDoDataDiv').length) {
      target.closest('div.employeeTodo').find('span').removeClass('hidden').addClass('revealed');
    }
    target.closest('div.toDoInputDiv').remove();
  }

  _saveToDo(target) {
    const target = $(target);
    const input = target.closest('div.employeeTodo').find('input.toDoInput').val();
    if (input) {
      this._createNewElement('div', 'toDoDataDiv', '')
        .append(this._createNewElement('b', '', input))
        .append(this._image('sameRow edit', 'images/edit.jpg', '').data({'methodName': '_editToDo', 'parameters': 'target',}))
        .append(this._image('sameRow delete', 'images/delete.jpg', '').data({'methodName': '_deleteToDo', 'parameters': 'target',}))
        .insertAfter(target.closest('div.toDoInputDiv'));
      target.closest('div.toDoInputDiv').remove();
    } else {
      alert(':::ToDo data cannot be empty.');
    }
  }

  _editToDo(target) {
    const target = $(target);
    const input = target.closest('div.toDoDataDiv').find('b').text();
    this._addToDo(target, input);
  }

  _deleteToDo(target) {
    const target = $(target);
    if (confirm(':::Are you sure you want to delete this todo item?')) {
      if (!(target.closest('div.employeeTodo').find('div.toDoDataDiv').length > 1)) {
        target.closest('div.employeeTodo').find('span').removeClass('hidden').addClass('revealed');
      }
      target.closest('div.toDoDataDiv').remove();
    }
  }
}

$(() => {
  const body = $('body');
  const left = $('<div />', {'class': 'left'});
  const right = $('<div />', {'class': 'right'});
  const roles = $('<div />', {'class': 'roles'});
  const employees = $('<div />', {'class': 'employees'});
  const addRole = $('<input />', {
    'type': 'button',
    'id': 'addRole',
    'value': 'Add Role',
    'class': 'button',
  });

  addRole.data({'methodName': '_addRole'}); 
  const addEmployee = $('<input />', {
    'type': 'button',
    'id': 'addEmployee',
    'value': 'Add Employee',
    'class': 'button',
  });

  addEmployee.data({'methodName': '_addEmployee'});  
  const employeeRoleDropDown = $('<select />', { 'class': 'hidden', });
  new Todo(body, left, right, roles, employees, addRole, addEmployee, employeeRoleDropDown);
}); 

