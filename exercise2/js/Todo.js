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
      .append(
        this._$roles.append($('<div />', {
          'class': 'heading borderedBelow',
          'html': 'ROLES',
        }))
      )
      .append(
        this._$employees.append($('<div />', {
          'class': 'heading borderedBelow',
          'html': 'Employees',
        })
        )
      );
  }

  _right() {
    return this._$right.append(
      $('<div />', { 'class': 'todoSection', })
        .append($('<div />', {
          'class': 'todoHeading heading', 
          'html': 'ToDos',
        }))
        .append($('<div />', { 'class': 'expandCollapse', })
          .append($('<img />', {
           'class': 'images1 expandAll',
           'id': 'expand',
           'src': 'images/add.jpg',
          }))
          .append($('<img />', {
           'class': 'images1 collapseAll',
           'id': 'collapse',
           'src': 'images/collapse.jpg',
          })
        )
      )
    );
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
      .append($('<div />')
        .append(this._$addRole)
        .append(this._$addEmployee)
      )
      .append($('<div />')
        .append(this._$employeeRoleDropDown)
      );
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
    const $employeeDiv = $('<div />', {
      'class': 'employeesEmployee',
      'id': `${id}`,
      'html': employee,
    });

    if (employee) {
      this._$employees
        .append($employeeDiv.append($('<img />', {
            'src': 'images/delete.jpg',
            'class': 'hidden sameRow employeeDelete delete',
          })
        )
        .hover(() => {
          $employeeDiv.find('img.employeeDelete').toggleClass('hidden');
        }));
    }
  }

  _addRole() {
    const role = prompt("Enter Role Name");
    const date = new Date();
    const id = date.getTime();
    const $roleDiv = $('<div />', {
      'class': 'rolesRole',
      'id': `${id}`,
      'html': `<b>${role}</b>`,
    });

    if (role) {
      this._$roles
        .append(
          $roleDiv.prepend($('<img />', {
              'src': 'images/delete.jpg',
              'class': 'hidden sameRow roleDelete delete',
            })
          )
          .append($('<img />', {
              'src': 'images/add.jpg',
              'class': 'sameRow roleAdd add',
              'title': 'Add Employee to this Role',
            })
          )
          .append($('<div />', {
              'class': `${id}`,
            })
          )
          .hover(() => {
            $roleDiv.find('img.roleDelete').toggleClass('hidden');
          })
        );
    }
  }

  _expandAll(target) {
    target.closest('div.todoSection')
      .siblings('div')
      .removeClass('hidden')
      .addClass('revealed');
  }

  _collapseAll(target) {
    target.closest('div.todoSection')
      .siblings('div')
      .removeClass('revealed')
      .addClass('hidden');
  }

  _expand(target) {
    target.closest('div.roleHeader')
      .siblings('div')
      .removeClass('hidden')
      .addClass('revealed');

    target
      .removeClass('expand')
      .addClass('collapse')
      .attr('src', 'images/collapse.jpg');
  }

  _collapse(target) {
    target.closest('div.roleHeader')
      .siblings('div')
      .removeClass('revealed')
      .addClass('hidden');

    target
      .removeClass('collapse')
      .addClass('expand')
      .attr('src', 'images/add.jpg');
  }

  _toggleDeleteImage(target) {
    target.find('img').toggleClass('revealed');
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
    }
  }

  _addNewEmployeeToRole(target) {
    const employees = $('div.employees div.employeesEmployee');
    this._$employeeRoleDropDown.html($('<option />', {
      'value': '',
      'html': 'Select Employee',
    }));

    if (employees.length) {
      employees.each((index, employee) => {
        this._$employeeRoleDropDown.append($('<option />', {
          'value': $(employee).attr('id'),
          'html': $(employee).text(),
        }));
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
      const $employeeDiv = $('<div />', {
        'class': 'employeesEmployee',
        'html': employee,
        'class': `${className} ${employeeClass}`,
      });

      target.next('div')
        .append($employeeDiv.append($('<img />', {
            'src': 'images/delete.jpg',
            'class': 'hidden sameRow roleEmployeeDelete delete',
          })
        )
        .hover(() => {
          $employeeDiv.find('img.roleEmployeeDelete').toggleClass('hidden');
        }));

      this._initializeToDo(className, role, employeeClass, employee);
      this._$employeeRoleDropDown.removeClass('revealed').addClass('hidden');
    });
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
      $('<div />', {'class': `employeeToDoSection ${roleClass}`, })
        .append($('<div />', {
          'class': 'roleHeader',
          'html': role,
        }).append($('<img />', {
            'src': 'images/collapse.jpg',
            'class': 'sameRow expandCollapse collapse',
          })))
        .append($('<div />', {
          'class': `employeeDetails ${roleClass} ${employeeClass}`,
        }).append($('<div />', {
            'class': 'employee',
            'html': employee,
          }))
          .append($('<div />', {
            'class': 'employeeTodo',
            'html': `<span>Add todos for ${employee} here</span>`,
          }).append($('<img />', {
              'src': 'images/add.jpg',
              'class': 'sameRow add',
            })))
        )
      );
  }

  _appendToexistingRole(roleClass, role, employeeClass, employee) {
    $(`div.employeeToDoSection.${roleClass}`)
      .append($('<div />', {
        'class': `employeeDetails ${roleClass} ${employeeClass}`,
      }).append($('<div />', {
          'class': 'employee',
          'html': employee,
        }))
        .append($('<div />', {
          'class': 'employeeTodo',
          'html': `<span>Add todos for ${employee} here</span>`,
        }).append($('<img />', {
            'src': 'images/add.jpg',
            'class': 'sameRow add',
          })))
      );
  }

  _addToDo(target, value) {
    const $saveImage = $('<img />', {
      'src': 'images/save.jpg',
      'class': 'sameRow save',
    });

    const $deleteImage = $('<img />', {
      'src': 'images/delete.jpg',
      'class': 'sameRow cancel',
    });

    this._addAccordingToContext(target, value, $saveImage, $deleteImage);
  }

  _addAccordingToContext(target, value, saveImage, deleteImage) {
    if (!target.siblings('div.toDoInputDiv').length) {
      target.closest('div.employeeTodo').find('span').removeClass('revealed').addClass('hidden');
      if (value) {
        $('<div />', {'class': 'toDoInputDiv',})
          .append($('<input />', {
            'type': 'text',
            'placeholder': 'Update todo here...',
            'class': 'toDoInput',
            'value': value,
          }))
          .append(saveImage)
          .append(deleteImage)
          .insertAfter(target.closest('div.toDoDataDiv'));

        target.closest('div.toDoDataDiv').remove();
      } else {
        target.closest('div').append($('<div />', {'class': 'toDoInputDiv',})
          .append($('<input />', {
            'type': 'text',
            'placeholder': 'Add a new todo here...',
            'class': 'toDoInput',
          }))
          .append(saveImage)
          .append(deleteImage)
        );
      }
    }
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
      $('<div />', {
        'class': 'toDoDataDiv',
        'html': `<b>${input}</b>`,
      }).append($('<img />', {
          'src': 'images/edit.jpg',
          'class': 'sameRow edit',
        }))
        .append($('<img />', {
          'src': 'images/delete.jpg',
          'class': 'sameRow delete',
        }))
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

