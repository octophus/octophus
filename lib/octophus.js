'use babel';

import OctophusView from './octophus-view';
import OpenGithubDiag from './dialogs/open-github-dialog';
import { CompositeDisposable } from 'atom';

var TreeView, Directory;

export default {
  config: {
    hideLocalWhenDisplayed: {
      type: 'boolean',
      'default': false
    },
    showHiddenFiles: {
      type: 'boolean',
      'default': true
    },
    showViewOnStartup: {
      type: 'boolean',
      'default': true
    },
    enableCopyFilename: {
      type: 'boolean',
      'default': true
    },
    "multipleHosts ( Beta )":{
      type:"boolean",
      "default":false
    }
  },
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
    this.treeView = new TreeView();
    this.treeView.showOnline();

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
