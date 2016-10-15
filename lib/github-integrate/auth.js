'use babel';

import GitHubApi from 'github';
import Promise from 'bluebird';

// let token = atom.config.get('octophus.token');
let token = "38aa5ece0bd55aef14300616ba86e97b52a05741";

let github = new GitHubApi({
	protocol: "https",
	headers: {
		"User-Agent": "Octophus/0.0.1",
	},
	Promise: Promise,
	timeout: 5000
});

github.authenticate({
	type: "token",
	token: token
})

github.repos.getAll({}, (err, res) => {
	console.log(JSON.stringify(res, null, 2));
	console.log(JSON.stringify(res.meta, null, 2));
});

export default github;


