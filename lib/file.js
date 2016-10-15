'use babel';

import FileOrig from './file-orig';

export default class File extends FileOrig {

  open() {
  	atom.project.octophus.openfiles[localPath] = this.ghFile;
    this.ghFile.open().then((localPath) => {
      atom.workspace.open(localPath);
    });
  };

}
