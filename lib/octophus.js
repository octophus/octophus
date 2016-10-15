'use babel';

import OctophusView from './octophus-view';
import OpenGithubDiag from './dialogs/open-github-dialog';
import { CompositeDisposable } from 'atom';
import packageConfig from './config.json';

var TreeView, Directory;

export default {
  config: packageConfig,
  octophusView: null,
  modalPanel: null,
  subscriptions: null,
  treeView: null,

  activate(state) { 
    if (!TreeView) {
      TreeView = require('./view/tree-view');
      Directory = require('./directory');
    }

    atom.project.octophusdir = new Directory({
      parent: null,
      name: "/"
    });

    dir = atom.project.octophusdir;
    dir.folders = [new Directory({
      parent: null,
      name: "folder1"
    })];
    // this.treeView = new TreeView();
    // this.treeView.showOnline();
    // this.treeView.attach();

    this.octophusView = new OctophusView(state.octophusViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.octophusView.getElement(),
      visible: false
    });

    atom.commands.add('atom-workspace', {

      'octophus:toggle': () => this.toggle(),

      'octophus:open-repo': () => {
        let dialog = new OpenGithubDiag();
        dialog.on('open-repo', (repo) => {
          console.log("aaa " + repo);
          dialog.detach();
        });
        dialog.attach();
      }
    });

    console.log(1);
    atom.workspace.observeTextEditors((ed) => {
      console.log(2);
      const buffer = ed.buffer;
      const listener = buffer.onDidSave(this.fileSaved);
    });
  },

  fileSaved: (event) => {
    console.log("save " + event.path);
  },

  deactivate() {
    this.treeView.detach();
    this.modalPanel.destroy();
    this.octophusView.destroy();
  },

  serialize() {
    return {
      octophusViewState: this.octophusView.serialize()
    };
  },

  toggle() {
    console.log('Octophus was toggled!');
    return (
      this.modalPanel.isVisible() ?
        this.modalPanel.hide() :
        this.modalPanel.show()
    );
  }

};
