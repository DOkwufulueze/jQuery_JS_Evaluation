class SearchManager {
  constructor(callerContext) {
    this._callerContext = callerContext;
    this._DOMElement = new DOMElement();
    this._$searchField = this._DOMElement._returnInput('sameRow', 'Search Employee', 'text', '').attr('id', 'searchField');

    this._$searchButton = this._DOMElement._returnInput('sameRow', '', 'button', 'Search').attr('id', 'search');

    this._$searchButton.data({
      'className': this, 
      'methodName': '_search'
    });
  }

  _returnSearchArea() {
    return this._DOMElement._createNewElement('div', 'section', '', '')
      .append(this._$searchField)
      .append(this._$searchButton);
  }

  _search() {
    this._$searchField.val() ? this._generateCases() : alert(":::Search field is empty.");
  }

  _generateCases() {
    const firstCase = $(`div.right div.employee:not(:has('div')):caseInsensitiveSearch(${this._$searchField.val()})`);
    const secondCase = $(`div.right div.toDoDataDiv:not(:has('div')):caseInsensitiveSearch(${this._$searchField.val()})`)
      .closest('div.employeeTodo')
      .siblings('div.employee');
    const thirdCase = $(`div.right div:not(:has('div')):caseInsensitiveSearch(${this._$searchField.val()})`)
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

