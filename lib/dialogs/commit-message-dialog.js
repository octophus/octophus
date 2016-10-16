'use babel';

import Dialog from './dialog';

export default class CommitMessageDialog extends Dialog {

  constructor() {
    super({
      'prompt': 'Commit Message To Save',
      'initialPath': '',
      'select': false,
      'iconClass': 'icon-file-directory'
    });
  }

  onConfirm(msg) {
    this.trigger('do-commit-message', msg);
  }

}
