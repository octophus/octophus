'use babel';

import GitHubApi from 'github';
import Promise from 'bluebird';

let github = new GitHubApi({
  debug: true,
  protocol: "https",
  headers: {
    "User-Agent": "Octophus/0.0.1",
  },
  Promise: Promise,
  timeout: 5000
});

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

function checkFetching(block) {
  return block.description === "Get a Tree";
}

let statusView = null;

github.handler = function (msg, block, callback) {
  if (!statusView) {
    statusView = require('../octophus').statusView;
  }
  const isSaving = checkSaving(block);
  const isFetching = checkFetching(block);
  isSaving && statusView.notifySaving('start');
  isFetching && statusView.notifyFetching('start');
  let _callback = function () {
    isSaving && statusView.notifySaving('end');
    isFetching && statusView.notifyFetching('end');
    callback.apply(github, arguments);
  };
  _handler.call(github, msg, block, _callback);
};

export default github;
