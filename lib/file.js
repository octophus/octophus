'use babel';

import FileOrig from './file-orig';

export default class File extends FileOrig {

  open() {
    this.ghFile.open().then((localPath) => {
      atom.workspace.open(localPath);
    });
  };

}
