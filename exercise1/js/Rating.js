'use strict'

class Rating {

  //Rating constructor
  constructor(body, table, products, ratings) {
    this._$body = body;
    this._$table = table;
    this._products = products;
    this._ratings = ratings;
    this._init();
  }

  _init() {
    this._addTableHeader();
    this._addProductsForRating();
    this._addEventListenerToBody();
  }

  _addTableHeader() {
    const $firstRow = $('<div />', {'id': 'firstRow',});
    this._$table.append($firstRow);
    $firstRow.append($('<div />', {
      'html': '',
      'class': `content heading`,
    }));

    this._ratings.forEach((rating, columnIndex) => {
      $firstRow.append($('<div />', {
        'html': rating,
        'class': `column${columnIndex} content heading`,
      }));
    });

    this._$body.append(
      this._$table.append($firstRow)
    );
  }

  _addProductsForRating() {
    this._products.forEach((product, rowIndex) => {
      let $row = $('<div />', {'id': `row${rowIndex}`,});
      $row.append($('<div />', {
        'html': product,
        'class': `row${rowIndex} content heading row`,
      }));

      this._ratings.forEach((rating, columnIndex) => {
        this._addColumnToRow($row, rowIndex, columnIndex);
      });

      this._$table.append($row);
    });
  }

  _addColumnToRow(row, rowIndex, columnIndex) {
    const $column = $('<div />', { 'class': 'content', });
    const $radio = $('<input />', {
      'type': 'radio',
      'id': `radio${rowIndex}${columnIndex}`,
      'name': `radio${rowIndex}`,
      'class': `row${rowIndex}~column${columnIndex}`,
    });
    
    row.append(
      $column.append($radio)
    );
  }

  _addEventListenerToBody() {
    this._$body.on('click', (eventObject) => {
      const $target = $(eventObject.target);
      if ($target.is('input')) {
        this._useRadio($target);
      } else if ($target.is('div.row')) {
        this._useProduct($target);
      }
    });
  }

  _useRadio(target) {
    const targetClass = target.attr('class');
    target.get(0).checked ? this._highlightProductAndRating(targetClass) : null;
  }

  _useProduct(target) {
    const targetClass = target.siblings('div').find('input:checked').length ? target.siblings('div').find('input:checked').attr('class') : null;
    if (targetClass) {
      target.siblings('div').find('input:checked').length ? this._highlightProductAndRating(targetClass) : null;
    }
  }

  _highlightProductAndRating(targetClass) {
    const rowIndex = targetClass.substring(0, targetClass.indexOf('~'));
    const columnIndex = targetClass.substring(targetClass.indexOf('~')+1);
    this._removeHighlightFromAll(targetClass);
    $(`.${rowIndex}`).addClass('highlighted');
    $(`.${columnIndex}`).addClass('highlighted');
  }

  _removeHighlightFromAll(targetClass) {
    $('div').removeClass('highlighted');
  }
}

$(() => {
  const body = $('body');
  const table = $('<div />');
  const products = ['Coffee', 'Tea', 'Sodas'];
  const ratings = ['Love it', 'Like it', 'No Views', 'Dislike it', 'Abhor it'];
  new Rating(body, table, products, ratings);
}); 

