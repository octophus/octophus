'use babel';

import FileOrig from './file-orig';

export default class File extends FileOrig {

  open() {
    if (!this.statusView) {
      this.statusView = require('./octophus').statusView;
    }

    this.statusView.notifyFetching('start');

    return this.ghFile.open()
      .then(localPath => atom.workspace.open(localPath))
      .then(editor => {
        const buffer = editor.getBuffer();
        buffer.__MAGIC_DO_NOT_MODIFY = this.ghFile;
      })
      .finally(() => {
        this.statusView.notifyFetching('end');
      });
  };

  openNewFile() {
    atom.workspace.open(this.ghFile.local_path).then(editor => {
      const buffer = editor.getBuffer();
      buffer.__MAGIC_DO_NOT_MODIFY = this.ghFile;
    });
  }

}
