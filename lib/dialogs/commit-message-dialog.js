'use babel';

import Dialog from './dialog';

export default class CommitMessageDialog extends Dialog {

  constructor() {
    super({
      'prompt': 'Commit with message:',
      'initialPath': '',
      'select': false,
      'iconClass': 'icon-file-directory'
    });
  }

  onConfirm(msg) {
    this.trigger('do-commit-message', msg);
  }

}
