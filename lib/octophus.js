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
    dir.name = "user/repo:master";
    if (!this.treeView) {
      this.treeView = new TreeView();
    }
    this.treeView.detach();
    atom.project.octophustree = this.treeView;

    this.octophusView = new OctophusView(state.octophusViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.octophusView.getElement(),
      visible: false
    });

    atom.commands.add('atom-workspace', {

      'octophus:toggle': () => this.toggle(),

      'octophus:open-repo': () => {
        console.log('abc');
        let dialog = new OpenGithubDiag();
        dialog.on('open-repo', (repo) => {
          console.log("aaa " + repo);
          dialog.detach();
        });
        dialog.attach();
      }
    });
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
    this.treeView.toggle();
    console.log('Octophus was toggled!');
    return (
      this.modalPanel.isVisible() ?
        this.modalPanel.hide() :
        this.modalPanel.show()
    );
  }

};
