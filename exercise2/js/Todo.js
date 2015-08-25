'use strict'

class ToDo {

  //ToDo constructor
  constructor(body, left, right, addRole, addEmployee) {
    this._$body = body;
    this._$left = left;
    this._$right = right;
    this._Role = new Role(this);
    this._$roles = this._Role._returnRolesContainer();
    this._Employee = new Employee(this);
    this._$employees = this._Employee._returnEmployeesContainer();
    addRole.data({
      'className': this._Role, 
      'methodName': '_addRole',
    });

    this._$addRole = addRole;
    addEmployee.data({
      'className': this._Employee, 
      'methodName': '_addEmployee',
    });

    this._$addEmployee = addEmployee;
    this._EmployeeRoleDropDown = new EmployeeRoleDropDown(this);
    this._$employeeRoleDropDown = this._EmployeeRoleDropDown._returnEmployeeRoleDropDown();
    this._SearchManager = new SearchManager(this);
    this._DOMElement = new DOMElement();
    this._init();
  }

  _init() {
    this._setPageUp();
    this._addEventListenerToBody();
  }

  _returnLeftSection() {
    return this._$left
      .append(this._$roles)
      .append(this._$employees);
  }

  _returnRightSection() {
    return this._$right.append(
      this._DOMElement._createNewElement('div', 'todoSection', '', '')
        .append(this._DOMElement._createNewElement('div', 'todoHeading heading', 'ToDos', ''))
        .append(this._DOMElement._createNewElement('div', 'expandCollapse', '', '')
          .append(this._DOMElement._returnImage('images1 expandAll', 'images/add.jpg', '').data({'methodName': '_expandAll', 'parameters': 'target',}))
          .append(this._DOMElement._returnImage('images1 collapseAll', 'images/collapse.jpg', '').data({'methodName': '_collapseAll', 'parameters': 'target',}))
        )
      )
    .addClass('hidden');
  }

  _returnMidSection() {
    return this._DOMElement._createNewElement('div', 'section', '', '')
      .append(
        this._returnLeftSection()
      )
      .append(
        this._returnRightSection()
      );
  }

  _returnButtons() {
    return this._DOMElement._createNewElement('div', 'section', '', '')
      .append(this._$addRole)
      .append(this._$addEmployee);
  }

  _setPageUp() {
    this._EmployeeRoleDropDown._addEventListener();
    this._$body
      .append(this._SearchManager._returnSearchArea())
      .append(this._returnMidSection())
      .append(this._returnButtons())
      .append(this._DOMElement._createNewElement('div', 'marginDiv', '', '')).append(this._$employeeRoleDropDown);
  }

  _addEventListenerToBody() {
    this._$body.on('click', (eventObject) => {
      const $target = $(eventObject.target);
      const context = $target.data('className') ? $target.data('className') : this;
      const parameters = $target.data('parameters') ? $target.data('parameters').split(',') : null;
      parameters = this._refineParameters(parameters, $target);
      const methodName = context[`${$target.data('methodName')}`];
      this._useMethodName(parameters, methodName, context);
      $('div.marked').removeClass('marked');
    });
  }

  _refineParameters(parameters, target) {
    if (parameters) {
      if (parameters.indexOf('target') >= 0) {
        parameters[parameters.indexOf('target')] = target;
      }
    }

    return parameters;
  }

  _useMethodName(parameters, methodName, context) {
    if (typeof methodName === 'function') {
      parameters ? methodName.apply(context, parameters) : methodName.apply(context);
    }
  }

  _returnInputEditSaveDeleteItem(placeholder, value, saveImage, deleteImage) {
    return this._DOMElement._createNewElement('div', 'toDoInputDiv', '', '')
      .append(this._DOMElement._returnInput('toDoInput', placeholder, 'text', value))
      .append(saveImage)
      .append(deleteImage)
  }

  _expandAll(target) {
    const target = $(target);
    target.closest('div.todoSection')
      .siblings('div')
      .find('.roleHeader')
      .siblings('div')
      .slideDown(1000);
    this._toggleListVisibility(target, 'collapse', 'expand', 'collapse');
  }

  _collapseAll(target) {
    const target = $(target);
    target.closest('div.todoSection')
      .siblings('div')
      .find('.roleHeader:not(.marked)')
      .siblings('div')
      .slideUp(1000);
      this._toggleListVisibility(target, 'expand', 'collapse', 'add');
  }

  _expand(target) {
    const target = $(target);
    target.closest('div.roleHeader')
      .siblings('div')
      .slideDown(1000);
    this._toggleRoleVisibility(target, 'collapse', 'expand', 'collapse');
  }

  _collapse(target) {
    const target = $(target);
    target.closest('div.roleHeader')
      .siblings('div')
      .slideUp(1000);
    this._toggleRoleVisibility(target, 'expand', 'collapse', 'add');
  }

  _toggleListVisibility(target, toAdd, toRemove, imageName) {
    target.closest('div.todoSection')
      .siblings('div')
      .find('.roleHeader:not(.marked)')
      .find(`.${toRemove}`)
      .removeClass(toRemove)
      .addClass(toAdd)
      .attr('src', `images/${imageName}.jpg`)
      .data({'methodName': `_${toAdd}`, 'parameters': 'target',});
  }

  _toggleRoleVisibility(target, toAdd, toRemove, imageName) {
    target
      .removeClass(toRemove)
      .addClass(toAdd)
      .attr('src', `images/${imageName}.jpg`)
      .data({'methodName': `_${toAdd}`, 'parameters': 'target',});
  }

  _initializeToDo(roleClass, role, employeeClass, employee) {
    if ($(`div.employeeToDoSection.${roleClass}`).length) {
      this._appendToExistingRole(roleClass, role, employeeClass, employee);
    } else {
      this._appendNewRole(roleClass, role, employeeClass, employee);
    }
  }

  _appendNewRole(roleClass, role, employeeClass, employee) {
    this._$right.append(
      this._DOMElement._createNewElement('div', `employeeToDoSection ${roleClass}`, '', '')
        .append(this._DOMElement._createNewElement('div', 'roleHeader', role, '').append(this._DOMElement._returnImage('sameRow expandCollapse collapse', 'images/collapse.jpg', '').data({'methodName': '_collapse', 'parameters': 'target, ""',})))
        .append(
          this._DOMElement._createNewElement('div', `employeeDetails ${roleClass} ${employeeClass}`, '', '')
            .append(this._DOMElement._createNewElement('div', 'employee', employee, ''))
            .append(this._DOMElement._createNewElement('div', 'employeeTodo', `<span>Add todos for ${employee} here</span>`, '').append(this._DOMElement._returnImage('sameRow add', 'images/add.jpg', '').data({'methodName': '_addToDo', 'parameters': 'target,',})))
          )
      )
    .removeClass('hidden')
    .addClass('revealed');
  }

  _appendToExistingRole(roleClass, role, employeeClass, employee) {
    $(`div.employeeToDoSection.${roleClass}`)
      .append(this._DOMElement._createNewElement('div', `employeeDetails ${roleClass} ${employeeClass}`, '', '')
        .append(this._DOMElement._createNewElement('div', 'employee', employee, ''))
        .append(this._DOMElement._createNewElement('div', 'employeeTodo', `<span>Add todos for ${employee} here</span>`, '')
          .append(this._DOMElement._returnImage('sameRow add', 'images/add.jpg', '').data({'methodName': '_addToDo', 'parameters': 'target,',}))
        )
      );
  }

  _addToDo(target, value) {
    const target = $(target);
    const $saveImage = this._DOMElement._returnImage('sameRow save', 'images/save.jpg', '').data({'methodName': '_saveToDo', 'parameters': 'target',});
    const $deleteImage = this._DOMElement._returnImage('sameRow cancel', 'images/delete.jpg', '').data({'methodName': '_cancelToDo', 'parameters': 'target',});
    this._addAccordingToContext(target, value, $saveImage, $deleteImage);
  }

  _addAccordingToContext(target, value, saveImage, deleteImage) {
    const target = $(target);
    if (!target.siblings('div.toDoInputDiv').length) {
      target.closest('div.employeeTodo').find('span').removeClass('revealed').addClass('hidden');
      this._addEditOrNew(target, value, saveImage, deleteImage);
      $('.toDoInput').focus();
    }
  }

  _addEditOrNew(target, value, saveImage, deleteImage) {
    if (value) {
      this._returnInputEditSaveDeleteItem('Update todo here...', value, saveImage, deleteImage).insertAfter(target.closest('div.toDoDataDiv'));
      target.closest('div.toDoDataDiv').remove();
    } else {
      target.closest('div.employeeTodo').append(this._returnInputEditSaveDeleteItem('Add a new todo here...', value, saveImage, deleteImage));
    }
  }

  _cancelToDo(target) {
    const target = $(target);
    if (!target.closest('div.toDoInputDiv').siblings('div.toDoDataDiv').length) {
      target.closest('div.employeeTodo').find('span').removeClass('hidden').addClass('revealed');
    }

    const toFocus = target.closest('div.employeeTodo');
    target.closest('div.toDoInputDiv').remove();
    toFocus.get(0).scrollTop = 0;
  }

  _saveToDo(target) {
    const target = $(target);
    const toFocus = target.closest('div.employeeTodo');
    const input = target.closest('div.employeeTodo').find('input.toDoInput').val();
    this._saveIfInputElseStop(input, target);
    toFocus.get(0).scrollTop = 0;
  }

  _saveIfInputElseStop(input, target) {
    if (input) {
      this._DOMElement._createNewElement('div', 'toDoDataDiv', '', '')
        .append(this._DOMElement._createNewElement('b', '', input, ''))
        .append(this._DOMElement._returnImage('sameRow edit', 'images/edit.jpg', '').data({'methodName': '_editToDo', 'parameters': 'target',}))
        .append(this._DOMElement._returnImage('sameRow delete', 'images/delete.jpg', '').data({'methodName': '_deleteToDo', 'parameters': 'target',}))
        .insertAfter(target.closest('div.toDoInputDiv'));

      target.closest('div.toDoInputDiv').remove();
    } else {
      alert(':::ToDo data cannot be empty.');
    }
  }

  _editToDo(target) {
    const target = $(target);
    const toFocus = target.closest('div.employeeTodo');
    const input = target.closest('div.toDoDataDiv').find('b').text();
    this._addToDo(target, input);
  }

  _deleteToDo(target) {
    const target = $(target);
    if (confirm(':::Are you sure you want to delete this todo item?')) {
      if (!(target.closest('div.employeeTodo').find('div.toDoDataDiv').length > 1)) {
        target.closest('div.employeeTodo').find('span').removeClass('hidden').addClass('revealed');
      }

      const toFocus = target.closest('div.employeeTodo');
      target.closest('div.toDoDataDiv').remove();
      toFocus.get(0).scrollTop = 0;
    }
  }
}

$(() => {

  //Extending jQuery to do case-insensitive search for contains
  $.expr[":"].caseInsensitiveSearch = $.expr.createPseudo((parameters) => {
    return (element) => {
        return $(element).text().toUpperCase().indexOf(parameters.toUpperCase()) >= 0;
    };
  });

  const body = $('body');
  const left = $('<div />', {'class': 'left'});
  const right = $('<div />', {'class': 'right'});
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

  new ToDo(body, left, right, addRole, addEmployee);
}); 

