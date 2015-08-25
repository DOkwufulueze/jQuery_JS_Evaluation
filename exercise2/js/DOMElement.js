class DOMElement {
  _returnImage(className, sourceAttribute, title) {
    return $('<img />', {
      'src': sourceAttribute,
      'class': className,
      'title': title,
    }) ; 
  }

  _createNewElement(tag, className, html, id) {
    return $(`<${tag} />`, {
      'class': className,
      'html': html,
      'id': id ? id : null,
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

