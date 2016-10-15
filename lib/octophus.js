'use babel';

import OctophusView from './octophus-view';
import OpenGithubDiag from './dialogs/open-github-dialog';
import { CompositeDisposable } from 'atom';

export default {

  octophusView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
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
