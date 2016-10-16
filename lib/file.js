'use babel';

import FileOrig from './file-orig';

export default class File extends FileOrig {

  open() {
    this.ghFile.open().then((localPath) => {
      atom.workspace.open(localPath).then(editor => {
        const buffer = editor.getBuffer();
        buffer.__MAGIC_DO_NOT_MODIFY = this.ghFile;
      });
    });
  };

  openNewFile() {
    atom.workspace.open(this.ghFile.local_path).then(editor => {
      const buffer = editor.getBuffer();
      buffer.__MAGIC_DO_NOT_MODIFY = this.ghFile;
    });
  }

}
