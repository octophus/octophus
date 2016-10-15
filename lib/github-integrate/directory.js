'use babel';

import pathutil from 'path';
import github from './auth';
import File from "./file";
import Promise from 'bluebird';

export default class Directory {
	constructor(repo, path, local_path, mode, sha, parent=null) {
		this.repo = repo;
		this.path = path;
		this.local_path = local_path;
		this.mode = mode;
		this.sha = sha;
		this.parent = parent;

		this.modified = false;
		this.modified_childs = [];
		this.__name = "Directory";
	}

	get isRoot() {
		return this.path === "/";
	}

	get local() {
		return this.local_path;
	}

	get remote() {
		return "https://github.com/" + this.repo.owner + "/" + this.repo.name + "/tree/" + this.repo.branch + this.path;
	}

	get root() {
		return "https://github.com/" + this.repo.owner + "/" + this.repo.name + "/tree/" + this.repo.branch + "/";
	}

	sort() {
		this.folders.sort(function (a, b) {
			if (a.name == b.name)
				return 0;
			return a.name > b.name ? 1 : -1;
		});

		this.files.sort(function (a, b) {
			if (a.name == b.name)
				return 0;
			return a.name > b.name ? 1 : -1;
		});
	}

	exists(name, isdir) {
		if (isdir) {
			for (var a = 0, b = this.folders.length; a < b; ++a)
				if (this.folders[a].name == name)
					return a;
		} else {
			for (var a = 0, b = this.files.length; a < b; ++a)
				if (this.files[a].name == name)
					return a;
		}
		return null;
	}

	open() {
		if (this.sha == "<empty file>") return new Promise( (resolve, reject) => { resolve(); } );
		if (typeof this.files != "undefined") {
			return new Promise( (resolve, reject) => { resolve(); } );
		}
		return this._fetchListComplete()
	}

	save(child) {
		if (child) this.modified_childs.push(child);
	    if (this.modified) return;
	    this.modified = true;
	    if (this.parent) this.parent.save(this);
	}

	createFile(path) {
		let new_local_path = pathutil.join(this.local_path, path);
		new Promise((_, reject) => {
	  		fs.writeFile(new_local_path, "", {}, err => {
	  			if (err) reject(err);
	  		});
	  	}).then(() => {
			let new_file = new File(this.repo, pathutil.join(this.path, path), new_local_path, "100644", "<empty file>", this);
			this.files.push(new_file);
			new_file.save();
		});
	}

	createDirectory(path) {
		let new_directory = new Directory(this.repo, pathutil.join(this.path, path), pathutil.join(this.local_path, path), "040000", "<empty file>", this);
		this.folders.push(new_directory);
		new_directory.save();
	}

	_fetchListComplete() {
		let such_magic_promise = github.gitdata.getTree({
			owner: this.repo.owner,
			repo: this.repo.name,
			sha: this.sha
		});
		let files = [];
		let folders = [];
		such_magic_promise.then(res => {
			res.tree.forEach(obj => {
				if (obj.type == "blob") {
					files.push(
						new File(this.repo, pathutil.join(this.path, obj.path), pathutil.join(this.local_path, obj.path), obj.mode, obj.sha, this)
					)
				} else if (obj.type == "tree") {
					folders.push(
						new Directory(this.repo, pathutil.join(this.path, obj.path) + "/", pathutil.join(this.local_path, obj.path) + "/", obj.mode, obj.sha, this)
					)
				}
			})
		}).catch(err => { throw err; });
		such_magic_promise.then( () => {
			this.files = files;
			this.folders = folders;
			this.sort();
		});
		return such_magic_promise;
	}

	// This collects the changes on the whole working tree
	// Returns a Promise containing 
	saveRemote() {
		if (!this.modified) return new Promise((resolve, reject) => { resolve([]); });
		
		this.modified = false;
		return Promise.all(this.modified_childs.map(child => {
			return child.saveRemote().then(sha => {
				return {
					path: pathutil.basename(child.path),
					mode: child.mode,
					type: child.__name == "File" ? "blob" : "tree",
					sha: sha[0]
				};
			});
		})).then(trees => {
			return github.gitdata.createTree({
				owner: this.repo.owner,
				repo: this.repo.name,
				tree: trees,
				base_tree: this.sha
			});
		}).then(obj => {
			this.sha = obj.sha;
			return [obj.sha];
		});
	}
}
