'use babel';

import fs from 'fs-plus';
import tmp from 'tmp';
import Promise from 'bluebird';
import mkdirp from 'mkdirp';
import pathutil from 'path';
import github from './github';

export default class Repository {
    constructor(owner, repo, branch) {
        this.owner = owner;
        this.repo = repo;
        this.branch = branch;

		gh.gitdata.getReference({
			owner: owner,
			repo: repo,
			ref: "heads/" + this.branch
		}).then( (tree_root => {
			if (!tree_root.meta.status.startswith("20")) {
				throw tree_root.message;
			}
			this.sha = tree_root.object.sha;
		}).catch(err => { throw err; })

        this.tmppath_promise = new Promise( (resolve, reject) => {
            tmp.dir({ mode: 0o700, prefix: 'octuphus_' }, (err, path, cleanupCallback) => {
                if (err) reject(err);
                resolve([path, cleanupCallback]);
            });
        });
    }
    destroy() {
        if (this.cleanupCallback) this.cleanupCallback();
    }
    waitForTmp() {
        this.tmppath_ready.then( ([path, cleanupCallback]) => {
            console.log('Using tmpdir: ', path);
            this.tmppath = path;
            this.cleanupCallback = cleanupCallback;
        }).catch(err => { throw err });
    }
    fetchFile(path) {
        return this.gh.repos.getContent({
			owner: this.owner,
			repo: this.repo,
			path: path, 
			ref: this.branch
		});
    }
    downloadFile(path) {
        if (!this.tmppath) waitForTmp();
        let local_path = pathutil.join(this.tmppath, path);
        mkdirp.sync(pathutil.dirname(local_path));
        fetchFile(path).then(content => {
            fs.writeFile(local_path, content, err => {
                if (err) throw err;
            });
        }).catch(err => { throw err });
        return local_path;
    }
    readDir(path) {
        
    }
}

