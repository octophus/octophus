'use babel';

import pathutil from 'path';
import github from './auth';
import fs from 'fs-plus';
import Promise from 'bluebird';

export default class File {
	constructor(repo, path, local_path, mode, sha, parent) {
		this.repo = repo;
		this.path = path;
		this.local_path = local_path;
		this.mode = undefined;
		this.sha = sha;
		this.parent = parent;

		this.modified = false;
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
		}).then( res => {
			return new Promise((resolve, reject) => {
				fs.writeFile(this.local_path, Buffer.from(res.content), {}, err => {
					if (err) reject(err)
					resolve(this.local_path);
				});
			});
		}).catch( err => { throw err; } );
	}

	save() {
		let last = this;
		this.modified = true;
		for (let cur = this.parent; cur; cur = cur.parent) {
			cur.modified_childs.push(last);
			if (cur.modified) break;
			cur.modified = true;
			last = cur;
		}

		// <TODO>: Add save trigger here.
	}

	// This creates a new blob containing the content of the current file.
	// Returns a Premise list of new blob sha.
	// Note that it returns [] if there are no changes.
	saveRemote() {
		if (!cur.modified) return new Promise((resolve, reject) => { resolve([]); });
		return new Promise((resolve, reject) => {
			fs.readFile(this.local_path, (err, data) => {
				if (err) reject(err);
				this.modified = false;
				resolve(data);
			});
		}).then(data => {
			// <TODO>: Change to base64?
			return github.gitdata.createBlob(this.repo.owner, this.repo.name, data);
		}).then(obj => {
			this.sha = obj.sha;
			return [obj.sha];
		});
	}
}
