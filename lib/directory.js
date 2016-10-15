'use babel';

import path from 'path';

import myFile from './file';
import DirectoryOrig from './directory-orig';

export default class Directory extends DirectoryOrig {

  open() {
    // TODO: Load this dir and replace self.folders and self.files
    if (!this.ghDir) {
      return new Promise( (resolve, reject) => { resolve(); } );
    }

    return this.ghDir.open()
      .then(() => {
        this.folders = this.ghDir.folders.map(folder => new Directory({
          parent: this,
          name: path.basename(folder.path),
          ghDir: folder,
        }));

        this.files = this.ghDir.files.map(file => new myFile({
          parent: this,
          name: path.basename(file.path),
          ghFile: file,
        }));

        return this;
      });

  };

}
