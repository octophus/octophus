'use babel';

import pathutil from 'path';
import github from './auth';
import fs from 'fs-plus';

export default class File {
	constructor(repo, path, tmp, node, parent) {
		this.repo = repo;
		this.path = path;
		this.tmppath = tmp;
		this.node = node;
		this.parent = parent
	}

	get local() {
		return this.tmppath;
	}

	get remote() {
		return "https://github.com/" + this.repo.owner + "/" + this.repo.name + "/blob/" + this.repo.branch + this.path;
	}

	get root() {
		return "https://github.com/" + this.repo.owner + "/" + this.repo.name + "/tree/" + this.repo.branch + "/";
	}

	open() {
		github.gitdata.getBlob({
			owner: this.repo.owner,
			repo: this.repo.name,
			sha: this.node
		}).then( res => {
			fs.writeFile(this.tmppath, Buffer.from(res.content), {}, err => {
				if (err) {
					atom.notifications.addError(err);
					// throw err;
					return ;
				}
				atom.workspace.open(this.tmppath);
			})
		}).catch( err => { throw err; } );
	}
}
