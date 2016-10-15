'use babel';

import fs from 'fs-plus';
import tmp from 'tmp';
import Promise from 'bluebird';
import mkdirp from 'mkdirp';
import pathutil from 'path';

export default class Repository {
    constructor(gh, owner, repo, branch) {
        this.gh = gh;
        this.owner = owner;
        this.repo = repo;
        this.branch = branch;

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
        return this.gh.repos.getContent(this.owner, this.repo, path, this.branch);
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
    readDir(/*<TODO>*/) {
        
    }
}

