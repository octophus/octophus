'use babel';

import pathutil from 'path';
import github from './auth';

export default class Directory {
	constructor(repo, path, tmp, node) {
		this.repo = repo;
		this.path = path;
		this.tmppath = pathutil.join(tmp, path);
		this.node = node; // Node SHA
	}

	open(_, callback) {
	}

	_fetchListComplete() {
	}

}
