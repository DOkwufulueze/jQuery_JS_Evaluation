'use strict'

class ToDo {

  //ToDo constructor
  constructor(body, left, right, roles, employees, addRole, addEmployee, employeeRoleDropDown, searchField, searchButton) {
    this._$body = body;
    this._$left = left;
    this._$right = right;
    this._$roles = roles;
    addRole.data({
      'className': new Role(this), 
      'methodName': '_addRole',
    });

    this._$addRole = addRole;
    addEmployee.data({
      'className': new Employee(this), 
      'methodName': '_addEmployee',
    });

    this._$addEmployee = addEmployee;
    this._$employeeRoleDropDown = employeeRoleDropDown;
    this._EmployeeRoleDropDown = new EmployeeRoleDropDown(this);
    searchButton.data({
      'className': new SearchManager(this), 
      'methodName': '_search'
    });

    this._$searchButton = searchButton;
    this._$searchField = searchField;
    this._DOMElement = new DOMElement();
    this._$employees = employees;
    this._init();
  }

  _init() {
    this._setPageUp();
    this._addEventListenerToBody();
  }

  _returnLeftSection() {
    return this._$left
      .append(this._$roles.append(this._DOMElement._createNewElement('div', 'heading borderedBelow', 'ROLES')))
      .append(this._$employees.append(this._DOMElement._createNewElement('div', 'heading borderedBelow', 'Employees')));
  }

  _returnRightSection() {
    return this._$right.append(
      this._DOMElement._createNewElement('div', 'todoSection', '')
        .append(this._DOMElement._createNewElement('div', 'todoHeading heading', 'ToDos'))
        .append(this._DOMElement._createNewElement('div', 'expandCollapse', '')
          .append(this._DOMElement._returnImage('images1 expandAll', 'images/add.jpg', '').data({'methodName': '_expandAll', 'parameters': 'target',}))
          .append(this._DOMElement._returnImage('images1 collapseAll', 'images/collapse.jpg', '').data({'methodName': '_collapseAll', 'parameters': 'target',}))
        )
      );
  }

  _returnSearchArea() {
    return $('<div />', {'class': 'section'})
      .append(this._$searchField)
      .append(this._$searchButton);
  }

  _returnMidSection() {
    return $('<div />', {'class': 'section'})
      .append(
        this._returnLeftSection()
      )
      .append(
        this._returnRightSection()
      );
  }

  _returnButtons() {
    return $('<div />', {'class': 'section'})
      .append(this._$addRole)
      .append(this._$addEmployee);
  }

  _setPageUp() {
    this._EmployeeRoleDropDown._addEventListener();
    this._$body
      .append(this._returnSearchArea())
      .append(this._returnMidSection())
      .append(this._returnButtons())
      .append(this._DOMElement._createNewElement('div', 'marginDiv', '')).append(this._$employeeRoleDropDown);
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
    return this._DOMElement._createNewElement('div', 'toDoInputDiv', '')
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
      this._DOMElement._createNewElement('div', `employeeToDoSection ${roleClass}`, '')
        .append(this._DOMElement._createNewElement('div', 'roleHeader', role).append(this._DOMElement._returnImage('sameRow expandCollapse collapse', 'images/collapse.jpg', '').data({'methodName': '_collapse', 'parameters': 'target, ""',})))
        .append(
          this._DOMElement._createNewElement('div', `employeeDetails ${roleClass} ${employeeClass}`, '')
            .append(this._DOMElement._createNewElement('div', 'employee', employee))
            .append(this._DOMElement._createNewElement('div', 'employeeTodo', `<span>Add todos for ${employee} here</span>`).append(this._DOMElement._returnImage('sameRow add', 'images/add.jpg', '').data({'methodName': '_addToDo', 'parameters': 'target,',})))
          )
      );
  }

  _appendToExistingRole(roleClass, role, employeeClass, employee) {
    $(`div.employeeToDoSection.${roleClass}`)
      .append(this._DOMElement._createNewElement('div', `employeeDetails ${roleClass} ${employeeClass}`, '')
        .append(this._DOMElement._createNewElement('div', 'employee', employee))
        .append(this._DOMElement._createNewElement('div', 'employeeTodo', `<span>Add todos for ${employee} here</span>`)
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

    target.closest('div.toDoInputDiv').remove();
  }

  _saveToDo(target) {
    const target = $(target);
    const input = target.closest('div.employeeTodo').find('input.toDoInput').val();
    this._saveIfInputElseStop(input, target);
  }

  _saveIfInputElseStop(input, target) {
    if (input) {
      this._DOMElement._createNewElement('div', 'toDoDataDiv', '')
        .append(this._DOMElement._createNewElement('b', '', input))
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

class DOMElement {
  constructor() {

  }

  _returnDiv(className, html, id) {
    return $('<div />', {
      'class': className,
      'id': id,
      'html': html,
    });
  }

  _returnImage(className, sourceAttribute, title) {
    return $('<img />', {
      'src': sourceAttribute,
      'class': className,
      'title': title,
    }) ; 
  }

  _createNewElement(tag, className, html) {
    return $(`<${tag} />`, {
      'class': className,
      'html': html,
    });
  }

  _returnInput(className, placeholder, type, value) {
    return $('<input />', {
      'type': type,
      'placeholder': placeholder,
      'class': className,
      'value': value,
    });
  }

  _returnOption(html, value) {
    return $('<option />', {
      'value': value,
      'html': html,
    });
  }
}

class DataDeleteManager {
  constructor(callerContext) {
    this._callerContext = callerContext;
  }

  _deleteData(target, data) {
    const target = $(target);
    if (confirm(`:::Are you sure you want to delete ${data}?`)) {
      const className = target.closest('div').attr('id');
      $(`.${className}`).remove();
      $(`div#${className}`).remove();
      this._callerContext._$employeeRoleDropDown.removeClass('revealed').addClass('hidden');
    }
  }

  _deleteRoleEmployee(target) {
    const target = $(target);
    if (confirm(':::Are you sure you want to delete employee from role?')) {
      const className = target.closest('.rolesRole').attr('id');
      const employee = target.closest('div').attr('class').split(/\s+/)[1];
      $(`.${className}.${employee}`).remove();
      $('.roleDelete').removeClass('revealed').addClass('hidden');
      this._callerContext._$employeeRoleDropDown.removeClass('revealed').addClass('hidden');
    }
  }
}

class Employee {
  constructor(callerContext) {
    this._callerContext = callerContext;
    this._DOMElement = new DOMElement();
  }

  _addEmployee() {
    const employee = prompt("Enter Employee Name");
    const date = new Date();
    const id = date.getTime();
    const $employeeDiv = this._DOMElement._returnDiv('employeesEmployee', employee, id);
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

class Role {
  constructor(callerContext) {
    this._callerContext = callerContext;
    this._DOMElement = new DOMElement();
  }

  _addRole() {
    const role = prompt("Enter Role Name");
    const date = new Date();
    const id = date.getTime();
    const $roleDiv = this._DOMElement._returnDiv('rolesRole', `<b>${role}</b>`, id);
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
      .append(this._DOMElement._createNewElement('div', id, ''))
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

class EmployeeRoleDropDown {
  constructor(callerContext) {
    this._callerContext = callerContext;
    this._DOMElement = new DOMElement();
    this._Role = new Role(this._callerContext);
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
      const $employeeDiv = this._DOMElement._createNewElement('div', `${className} ${employeeClass}`, employee);
      this._Role._appendRoleImagesAndSetToggling(target, $employeeDiv);
      this._callerContext._initializeToDo(className, role, employeeClass, employee);
      this._callerContext._$employeeRoleDropDown.removeClass('revealed').addClass('hidden');
    } else {
      alert(':::Employee/Role combination already exists.');
      this._prepareEmployeeRoleDropDown(target);
    }
  }
}

class SearchManager {
  constructor(callerContext) {
    this._callerContext = callerContext;
  }

  _search() {
    this._callerContext._$searchField.val() ? this._generateCases() : alert(":::Search field is empty.");
  }

  _generateCases() {
    const firstCase = $(`div.right div.employee:not(:has('div')):caseInsensitiveSearch(${this._callerContext._$searchField.val()})`);
    const secondCase = $(`div.right div.toDoDataDiv:not(:has('div')):caseInsensitiveSearch(${this._callerContext._$searchField.val()})`)
      .closest('div.employeeTodo')
      .siblings('div.employee');
    const thirdCase = $(`div.right div:not(:has('div')):caseInsensitiveSearch(${this._callerContext._$searchField.val()})`)
      .siblings('div')
      .find('.employee');
    this._locateEmployees(firstCase, secondCase, thirdCase);
  }

  _locateEmployees(firstCase, secondCase, thirdCase) {
    const affectedDivs = firstCase.length ? firstCase : false
      || secondCase.length ? secondCase : false
      || thirdCase.length ? thirdCase : false;    
    this._checkCriteriaSatisfaction(affectedDivs);
  }

  _checkCriteriaSatisfaction(containers) {
    containers ? this._blinkText(containers) : alert(':::No employee meets your search criteria.');
  }

  _blinkText(containers) {
    $('div.marked').removeClass('marked');
    this._blinkSeveralTimes(containers);
    this._slideUpOthers(containers);
  }

  _blinkSeveralTimes(containers) {
    containers.each((index, container) => {
      this._slideDownThis(container);
      $(container).fadeTo(100, 0, () => {$(container).addClass('highlighted');});
      this._repeat($(container), 4);
      $(container)
        .delay(100)
        .fadeTo(500, 1, () => {$(container).removeClass('highlighted');}); 
      $(container).closest('div.employeeDetails').siblings('div.roleHeader').addClass('marked');
    });
  }

  _slideDownThis(container) {
    let $innerTarget = $(container).closest('div.employeeDetails').siblings('div.roleHeader').find('img.expandCollapse');
    this._callerContext._expand($innerTarget);
  }

  _slideUpOthers(containers) {    
    if (containers.length) {
      const $target = $('.right .todoSection .collapseAll');
      this._callerContext._collapseAll($target);
    }
  }

  _repeat(container, times) {
    const i = 0;
    while (i < times) {
      container
        .delay(100)
        .fadeTo(100, 1)
        .delay(100)
        .fadeTo(100, 0);        
      i++;
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
  const employees = $('<div />', {'class': 'employees'});
  const roles = $('<div />', {'class': 'roles'});
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

  const searchField = $('<input />', {
    'type': 'text',
    'id': 'searchField',
    'placeholder': 'Search Employee',
    'class': 'sameRow',
  });

  const searchButton = $('<input />', {
    'type': 'button',
    'id': 'search',
    'value': 'Search',
    'class': 'sameRow',
  });

  const employeeRoleDropDown = $('<select />', { 'class': 'hidden', });
  new ToDo(body, left, right, roles, employees, addRole, addEmployee, employeeRoleDropDown, searchField, searchButton);
}); 

