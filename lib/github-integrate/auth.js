'use babel';

import GitHubApi from 'github';
import Promise from 'bluebird';

let token = "032d780f7d72949cc43" + /* fuzzzzzzzzzzzzzzzzzzzzz */ "4f51f3b3b202ca7521951";

let github = new GitHubApi({
  debug: true,
  protocol: "https",
  headers: {
    "User-Agent": "Octophus/0.0.1",
  },
  Promise: Promise,
  timeout: 5000
});

github.authenticate({
  type: "token",
  token: token
});

global.taskcnt = 0;

let _handler = github.handler;

function checkSaving(block) {
  if (block.method !== 'POST' && block.method !== 'PATCH') {
    return false;
  }
  if (block.description === "Create a Tree") {
    return true;
  }
  if (block.description === "Update a Reference") {
    return true;
  }
  if (block.description === "Create a Commit") {
    return true;
  }
  return false;
}

let statusView = null;

github.handler = function (msg, block, callback) {
  if (!statusView) {
    statusView = require('../octophus').statusView;
  }
  const isSaving = checkSaving(block);
  if (isSaving) {
    statusView.notifySaving('start');
  }
  let _callback = function () {
    if (isSaving) {
      statusView.notifySaving('end');
    }
    callback.apply(github, arguments);
  };
  _handler.call(github, msg, block, _callback);
};

export default github;
