'use babel';

import pathutil from 'path';
import github from './auth';
import fs from 'fs-plus';
import Promise from 'bluebird';
import base64 from 'base64-js';

export default class File {
  constructor(repo, path, local_path, mode, sha, parent) {
    this.repo = repo;
    this.path = path;
    this.local_path = local_path;
    this.mode = mode;
    this.sha = sha;
    this.parent = parent;

    this.modified = false;
    this.__name = "File";
  }

  get local() {
    return this.local_path;
  }

  get remote() {
    return "https://github.com/" + this.repo.owner + "/" + this.repo.name + "/blob/" + this.repo.branch + this.path;
  }

  get root() {
    return "https://github.com/" + this.repo.owner + "/" + this.repo.name + "/tree/" + this.repo.branch + "/";
  }

  open() {
    return github.gitdata.getBlob({
      owner: this.repo.owner,
      repo: this.repo.name,
      sha: this.sha
    }).then(res => {
      return new Promise((resolve, reject) => {
        fs.writeFile(this.local_path, Buffer.from(res.content, "base64"), {}, err => {
          if (err) reject(err)
          resolve(this.local_path);
        });
      });
    }).catch(err => {
      throw err;
    });
  }

  save(child) {
    if (child) this.modified_childs.push(child);
    if (this.modified) return;
    this.modified = true;
    if (this.parent) this.parent.save(this);

    setTimeout(() => {
    	this.repo.saveAll();
    }, atom.config.get('octophus.saveTimeout'));
  }

  // This creates a new blob containing the content of the current file.
  // Returns a Premise list of new blob sha.
  // Note that it returns [] if there are no changes.
  saveRemote() {
    if (!this.modified) return new Promise((resolve, reject) => {
      resolve([]);
    });
    return new Promise((resolve, reject) => {
      fs.readFile(this.local_path, (err, data) => {
        if (err) reject(err);
        this.modified = false;
        resolve(data);
      });
    }).then(data => {
      data = base64.fromByteArray(data);
      return github.gitdata.createBlob({
        owner: this.repo.owner,
        repo: this.repo.name,
        content: data,
        encoding: "base64",
      });
    }).then(obj => {
      this.sha = obj.sha;
      return [obj.sha];
    });
  }
}
