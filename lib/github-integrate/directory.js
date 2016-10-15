'use babel';

import pathutil from 'path';

export default class Directory {
	constructor(gh, repo, path, tmp) {
		this.gh = gh;
		this.repo = repo;
		this.path = path;
		this.tmppath = pathutil.join(tmp, path);
	}

	open(_, callback) {
		let gh = this.gh;
	}

	_fetchListComplete() {
	}

}
