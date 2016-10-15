'use babel';

import OpenGithubDiag from './dialogs/open-github-dialog';
import StatusView from './view/status-view';
import { CompositeDisposable } from 'atom';
import packageConfig from './config.json';

var TreeView, Directory;

export default {
  config: packageConfig,
  modalPanel: null,
  subscriptions: null,
  treeView: null,

  activate(state) {
    if (!TreeView) {
      TreeView = require('./view/tree-view');
      Directory = require('./directory');
      File = require('./file');
    }

    atom.project.octophusdir = new Directory({
      parent: null,
      name: "/"
    });

    dir = atom.project.octophusdir;
    dir.folders = [new Directory({
      parent: dir,
      name: "folder1"
    })];
    dir.name = "user/repo:master";

    if (!this.treeView) {
      this.treeView = new TreeView();
    }
    this.treeView.detach();
    atom.project.octophustree = this.treeView;

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
    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'octophus:toggle': () => this.toggle()
    }));

  },

  consumeStatusBar(statusBar) {
    this.statusView = new StatusView();
    this.statusView.initialize(statusBar);
    this.statusView.updateStatusText();
    this.statusView.attach();

    this.statusView.notifySaving('start');
    this.statusView.notifySaving('end');
    this.statusView.notifyFetching('start');
    this.statusView.notifyFetching('end');
  },

  deactivate() {
    this.treeView.detach();
    this.modalPanel.destroy();
    this.subscriptions.dispose();
  },

  serialize() {
    return;
  },

  toggle() {
    this.treeView.toggle();
    console.log('Octophus was toggled!');
    return;
  }

};
