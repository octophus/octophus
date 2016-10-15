'use babel';

import OpenGithubDiag from './dialogs/open-github-dialog';
import StatusView from './view/status-view';
import { CompositeDisposable } from 'atom';
import packageConfig from './config.json';
import githubAPI from './github-integrate/auth';

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
      Repository = require('./github-integrate/directory');
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

    dir2 = new Directory({
      parent: null,
      name: "hello"
    });

    if (!this.treeView) {
      this.treeView = new TreeView();
    }
    this.treeView.detach();
    atom.project.octophustree = this.treeView;

    atom.commands.add('atom-workspace', {

      'octophus:toggle': () => this.toggle(),

      'octophus:open-repo': () => {
        if (!githubAPI.tokenReady) {
          atom.notifications.addError("Please set GitHub Token first in octophus!");
          return;
        }
        let dialog = new OpenGithubDiag();
        dialog.on('open-repo', (fullrepo) => {
          console.log("aaa " + fullrepo);
          dialog.detach();
          this.statusView.attach();

          let user = fullrepo.split('/')[0];
          let repo = fullrepo.split(':')[0];
          let brench = fullrepo.split(':')[1];
          let responsory = new Responsory(user, repo, brench);
          responsory.getDirectory(function (ghDir) {
            name = ghDir.repo.name;
            dir = new Directory({
              parent: null,
              name: name,
              ghDir: ghDir
            });
            dir.open();
          });
        });
        dialog.attach();
      }
    });

    atom.workspace.observeTextEditors((ed) => {
      const buffer = ed.buffer;
      let path = null;

      const listener = buffer.onDidSave((ev) => {
        path = ev.path;
        // TODO save file
      });
      const listener2 = buffer.onDidDestroy(() => {
        if (path) {
          // TODO closed tab
        }
        listener.dispose();
        listener2.dispose();
      });

    });

    atom.config.observe('octophus.githubToken', this.setGithubToken);
  },

  setGithubToken: (token) => {
    if (!token || token.length <= 20) {
      atom.notifications.addWarning("Please set GitHub Token in octophus first.");
      atom.notifications.addWarning("We need repo access for github. See https://github.com/settings/tokens/new");
      return;
    }
    githubAPI.tokenReady = true;
    githubAPI.authenticate({
      type: "token",
      token: token
    });
  },

  consumeStatusBar(statusBar) {
    this.statusView = new StatusView();
    this.statusView.initialize(statusBar);
    if (!githubAPI.tokenReady) {
      this.statusView.attach('token');
    }
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
