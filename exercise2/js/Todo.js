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

  _left() {
    return this._$left
      .append(this._$roles.append(this._createNewElement('div', 'heading borderedBelow', 'ROLES')))
      .append(this._$employees.append(this._createNewElement('div', 'heading borderedBelow', 'Employees')));
  }

  _right() {
    return this._$right.append(
      this._divWithJustClass('todoSection')
        .append(this._createNewElement('div', 'todoHeading heading', 'ToDos'))
        .append(this._divWithJustClass('expandCollapse')
          .append(this._image('images1 expandAll', 'images/add.jpg', ''))
          .append(this._image('images1 collapseAll', 'images/collapse.jpg', ''))
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
          this._left()
        )
        .append(
          this._right()
        )
      )
      .append(
        this._buttons()
      )
      .append(this._divWithJustClass('marginDiv')).append(this._$employeeRoleDropDown);
  }

  _addEventListenerToBody() {
    this._$body.on('click', (eventObject) => {
      const $target = $(eventObject.target);
      if ($target.is('input#addEmployee')) {
        this._addEmployee();
      } else if ($target.is('input#addRole')) {
        this._addRole();
      } else if ($target.is('img.collapse')) {
        this._collapse($target);
      } else if ($target.is('img.expand')) {
        this._expand($target);
      } else if ($target.is('img.collapseAll')) {
        this._collapseAll($target);
      } else if ($target.is('img.expandAll')) {
        this._expandAll($target);
      } else if ($target.is('img.roleDelete')) {
        this._deleteRole($target);
      } else if ($target.is('img.roleEmployeeDelete')) {
        this._deleteRoleEmployee($target);
      } else if ($target.is('img.employeeDelete')) {
        this._deleteEmployee($target);
      } else if ($target.is('img.roleAdd')) {
        this._addNewEmployeeToRole($target);
      } else if ($target.is('img.add')) {
        this._addToDo($target, '');
      } else if ($target.is('img.cancel')) {
        this._cancelToDo($target);
      } else if ($target.is('img.delete')) {
        this._deleteToDo($target);
      } else if ($target.is('img.edit')) {
        this._editToDo($target);
      } else if ($target.is('img.save')) {
        this._saveToDo($target);
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
    return employeeDiv.append(this._image('hidden sameRow delete employeeDelete', 'images/delete.jpg', ''))
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
      .prepend(this._image('hidden sameRow delete roleDelete', 'images/delete.jpg', ''))
      .append(this._image('sameRow roleAdd', 'images/add.jpg', 'Add Employee to this Role'))
      .append(this._divWithJustClass(id))
      .hover(() => {
        roleDiv.find('img.roleDelete').toggleClass('hidden');
      });
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

  _divWithJustClass(id) {
    return $('<div />', {
      'class': `${id}`,
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
    target.closest('div.todoSection')
      .siblings('div')
      .find('.roleHeader')
      .siblings('div')
      .slideDown(1000);

    target.closest('div.todoSection')
      .siblings('div')
      .find('.roleHeader')
      .find('.expand')
      .removeClass('expand')
      .addClass('collapse')
      .attr('src', 'images/collapse.jpg');
  }

  _collapseAll(target) {
    target.closest('div.todoSection')
      .siblings('div')
      .find('.roleHeader')
      .siblings('div')
      .slideUp(1000);

    target.closest('div.todoSection')
      .siblings('div')
      .find('.roleHeader')
      .find('.collapse')
      .removeClass('collapse')
      .addClass('expand')
      .attr('src', 'images/add.jpg');
  }

  _expand(target) {
    target.closest('div.roleHeader')
      .siblings('div')
      .slideDown(1000);

    target
      .removeClass('expand')
      .addClass('collapse')
      .attr('src', 'images/collapse.jpg');
  }

  _collapse(target) {
    target.closest('div.roleHeader')
      .siblings('div')
      .slideUp(1000);

    target
      .removeClass('collapse')
      .addClass('expand')
      .attr('src', 'images/add.jpg');
  }

  _deleteRole(target) {
    if (confirm(':::Are you sure you want to delete role?')) {
      const className = target.parent('div').attr('id');
      $(`.${className}`).remove();
      $(`div#${className}`).remove();
    }
  }

  _deleteEmployee(target) {
    if (confirm(':::Are you sure you want to delete employee?')) {
      const className = target.closest('div').attr('id');
      $(`.${className}`).remove();
      $(`div#${className}`).remove();
    }
  }

  _deleteRoleEmployee(target) {
    if (confirm(':::Are you sure you want to delete employee from role?')) {
      const className = target.closest('div').parent('div').parent('div').attr('id');
      const employee = target.closest('div').attr('class').split(/\s+/)[1];
      $(`.${className}.${employee}`).remove();
      $('.roleDelete').removeClass('revealed').addClass('hidden');
    }
  }

  _addNewEmployeeToRole(target) {
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

  _updateOnChange(target) {
    const className = target.closest('div').attr('id');
    const role = target.closest('div').text();
    this._$employeeRoleDropDown.one('change', () => {
      const employee = this._$employeeRoleDropDown.children('option').filter(':selected').text();
      const employeeClass = this._$employeeRoleDropDown.val();
      this._checkForExistenceAndContinue(target, className, role, employeeClass, employee);
    });
  }

  _checkForExistenceAndContinue(target, className, role, employeeClass, employee) {
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
    target.next('div')
      .append(employeeDiv.append(
        this._image('hidden sameRow roleEmployeeDelete delete', 'images/delete.jpg', '')
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
        .append(this._createNewElement('div', 'roleHeader', role).append(this._image('sameRow expandCollapse collapse', 'images/collapse.jpg', '')))
        .append(
          this._createNewElement('div', `employeeDetails ${roleClass} ${employeeClass}`, '')
            .append(this._createNewElement('div', 'employee', employee))
            .append(this._createNewElement('div', 'employeeTodo', `<span>Add todos for ${employee} here</span>`).append(this._image('sameRow add', 'images/add.jpg', '')))
          )
      );
  }

  _appendToexistingRole(roleClass, role, employeeClass, employee) {
    $(`div.employeeToDoSection.${roleClass}`)
      .append(this._createNewElement('div', `employeeDetails ${roleClass} ${employeeClass}`, '')
        .append(this._createNewElement('div', 'employee', employee))
        .append(this._createNewElement('div', 'employeeTodo', `<span>Add todos for ${employee} here</span>`)
          .append(this._image('sameRow add', 'images/add.jpg', ''))
        )
      );
  }

  _addToDo(target, value) {
    const $saveImage = this._image('sameRow save', 'images/save.jpg', '');
    const $deleteImage = this._image('sameRow cancel', 'images/delete.jpg', '');
    this._addAccordingToContext(target, value, $saveImage, $deleteImage);
  }

  _addAccordingToContext(target, value, saveImage, deleteImage) {
    if (!target.siblings('div.toDoInputDiv').length) {
      target.closest('div.employeeTodo').find('span').removeClass('revealed').addClass('hidden');
      if (value) {
        this._inputEditSaveDeleteItem('Update todo here...', value, saveImage, deleteImage)
        .insertAfter(target.closest('div.toDoDataDiv'));
        target.closest('div.toDoDataDiv').remove();
      } else {
        target.closest('div').append(this._inputEditSaveDeleteItem('Add a new todo here...', value, saveImage, deleteImage));
      }
    }
  }

  _inputEditSaveDeleteItem(placeholder, value, saveImage, deleteImage) {
    return this._createNewElement('div', 'toDoInputDiv', '')
      .append(this._input('toDoInput', placeholder, 'text', value))
      .append(saveImage)
      .append(deleteImage)
  }

  _cancelToDo(target) {
    if (!target.closest('div.toDoInputDiv').siblings('div.toDoDataDiv').length) {
      target.closest('div.employeeTodo').find('span').removeClass('hidden').addClass('revealed');
    }
    target.closest('div.toDoInputDiv').remove();
  }

  _saveToDo(target) {
    const input = target.closest('div.employeeTodo').find('input.toDoInput').val();
    if (input) {
      this._createNewElement('div', 'toDoDataDiv', '')
        .append(this._createNewElement('b', '', input))
        .append(this._image('sameRow edit', 'images/edit.jpg', ''))
        .append(this._image('sameRow delete', 'images/delete.jpg', ''))
        .insertAfter(target.closest('div.toDoInputDiv'));
      target.closest('div.toDoInputDiv').remove();
    } else {
      alert(':::ToDo data cannot be empty.');
    }
  }

  _editToDo(target) {
    const input = target.closest('div.toDoDataDiv').find('b').text();
    this._addToDo(target, input);
  }

  _deleteToDo(target) {
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
  
  const addEmployee = $('<input />', {
    'type': 'button',
    'id': 'addEmployee',
    'value': 'Add Employee',
    'class': 'button',
  });
  
  const employeeRoleDropDown = $('<select />', { 'class': 'hidden', });
  new Todo(body, left, right, roles, employees, addRole, addEmployee, employeeRoleDropDown);
}); 

