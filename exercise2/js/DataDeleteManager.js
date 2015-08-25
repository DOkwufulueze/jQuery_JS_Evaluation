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
      $('div.employeeToDoSection').length > 0 ? $('div.right').removeClass('hidden').addClass('revealed') : $('div.right').removeClass('revealed').addClass('hidden')
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

