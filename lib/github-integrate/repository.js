'use babel';

import fs from 'fs-plus';
import tmp from 'tmp';
import Promise from 'bluebird';
import mkdirp from 'mkdirp';
import pathutil from 'path';
import github from './auth';
import Directory from './directory';
import Promise from 'bluebird';

export default class Repository {
    constructor(owner, repo, branch) {
        this.owner = owner;
        this.name = repo;
        this.branch = branch;
		
		this.sha_promise = github.gitdata.getReference({
			owner: owner,
			repo: repo,
			ref: "heads/" + this.branch
		}).then(tree_root => {
			this.sha = tree_root.object.sha;
		}).catch(err => { throw err; })

        this.tmppath_promise = new Promise( (resolve, reject) => {
            tmp.dir({ mode: 0o700, prefix: 'octophus_' }, (err, path, cleanup_callback) => {
                if (err) reject(err);
				this.tmppath = path;
                this.cleanup_callback = cleanup_callback;
                resolve(path);
            });
        });
    }
    destroy() {
        if (this.cleanup_callback) this.cleanup_callback();
    }

	getDirectory() {
		return Promise.all([
			this.sha_promise,
			this.tmppath_promise
		]).then(() => {
			return new Directory(this, "/", this.tmppath, this.sha);
		}).catch(err => { throw err; })
	}

    updateHeadRefs(sha, force=true) {
        return github.gitdata.updateReference(this.owner, this.repo, 'heads/' + this.branch, sha, force);
    }

    commit(message, tree_sha, parents) {
        return github.gitdata.createCommit(this.owner, this.repo, message, tree_sha, parents);
    }

    saveAll() {
        
    }
}

