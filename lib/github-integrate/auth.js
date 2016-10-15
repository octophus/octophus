'use babel';

import GitHubApi from 'github';
import Promise from 'bluebird';

let token = "032d780f7d72949cc43" + /* fuzzzzzzzzzzzzzzzzzzzzz */ "4f51f3b3b202ca7521951";

let github = new GitHubApi({
	debug: true,
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

console.log(github);

export default github;
