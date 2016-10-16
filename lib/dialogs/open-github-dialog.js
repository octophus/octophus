'use babel';

import Dialog from './dialog';

export default class OpenGithubDiag extends Dialog {

  constructor() {
    super({
      'prompt': 'Open GitHub repo: <user>/<repo>[:<branch>]',
      'initialPath': '',
      'select': false,
      'iconClass': 'icon-file-directory'
    });
  }

  onConfirm(repo) {
    console.log(repo);
    this.trigger('open-repo', repo);
  }

}
