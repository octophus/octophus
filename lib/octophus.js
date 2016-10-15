'use babel';

import OctophusView from './octophus-view';
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

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'octophus:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
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
