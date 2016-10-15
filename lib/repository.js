'use babel';

import tmp from 'tmp';

export default class Repository {
    constructor(auth, user, repo, branch) {
        this.auth = auth;
        this.user = user;
        this.repo = repo;
        this.branch = branch;

        tmp.dir({ mode: 0700, prefix: 'octuphus_' }, (err, path, cleanupCallback) => {
            if (err) throw err;
            console.log('tmpdir used: ', path);
            this.tmppath = path;
            this.cleanupCallback = cleanupCallback;
        });
    }
    destroy() {
        if (this.cleanupCallback) this.cleanupCallback();
    }
    readFile(/*<TODO>*/) {
        
    }
    readDir(/*<TODO>*/) {

    }
}
