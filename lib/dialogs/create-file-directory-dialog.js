'use babel';

import Dialog from './dialog';

export default class CreateFileDialog extends Dialog {

  constructor() {
    super({
      'prompt': 'Create file / directory of name: ',
      'initialPath': '',
      'select': false,
      'iconClass': 'icon-file-directory'
    });
  }

  onConfirm(name) {
    this.trigger('do-create', name);
  }

}
