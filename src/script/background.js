
window.addEventListener('load', function() {

	//widget.preferences.clear();
	
	// stores the temporary reques token while performing 1st-time authentication
	var tempToken = null;
	// true if we are authorized to use Opera Link, false if we still need to authenticate
	var authorized = false;

	var tokenRequester = null;

	// Consumer key and secret for the test application
	opera.link.consumer(
		'0DJPd7HUoAH3OIKXxe9bxPL4iaWqL9Qi',
		'8t3nmu7br8uWHIcrKFPZfdPuwycoU1dI');

	/*
	var UIItemProperties = {
		title: 'Opera Link Test',
		onclick: buttonClicked,
	};

	var button = opera.contexts.toolbar.createItem(UIItemProperties);
	opera.contexts.toolbar.addItem(button);
	*/

	// If we have a saved access token, check that it is valid
	if (opera.link.loadToken()) {
		opera.link.testAuthorization(function(result) {
			authorized = result;
			debug('authorized ' + authorized);
		});
	}
	else
		debug('not authorized');
	
	

	function buttonClicked() {
		if (authorized) {
			// Run tests. Make sure the library actually works
			//tests.bookmarks.getAll();
			//tests.bookmarks.getOperaMini();
			//tests.bookmarks.create();
			//tests.bookmarks.createFolder();
			tests.bookmarks.trash();
		}
		else {
			if (tempToken) {
				// If waiting for a verifier, cancel the previous request and try again
				debug('cancelling previous authentication request');
				tempToken = null;
			}
			// Request authentication
			getRequestToken();
		}
	}
	
	
	
	opera.extension.onmessage = function(e) {
		switch(e.data.action) {
			case 'request_token':
				if (authorized)
					break;
				
				if (tempToken)
					tempToken = null;
				
				getRequestToken();
				tokenRequester = e.source;
				break;
				
			case 'verifier':
				// If we get a verifier code and we're waiting for one, finish authentication
				if (tempToken) {
					debug('getting access token');
					opera.link.getAccessToken(
						tempToken.token, 
						tempToken.secret, 
						e.data.verifier, 
						saveAccessToken, 
						requestFailed);
				}
				break;
		}
	}
   
	
	function requestFailed(xhr) {
		debug('error: ' + xhr.status + ' ' + xhr.statusText);
	}
	
	function getRequestToken() {
		opera.link.requestToken(function(e) {
			tempToken = {
				token: e.token,
				secret: e.secret
			};
		}, requestFailed);
	}
	
	function saveAccessToken() {
		debug('saving access token');
		opera.link.saveToken();
		tempToken = null;
		authorized = true;
		
		if (tokenRequester) {
			tokenRequester.postMessage({
				action: 'authorized'
			});
			tokenRequester = null;
		}
	}
	
	
}, false);




var tests = new function() {

	this.bookmarks = new function() {
		
		this.getAll = function() {
			opera.link.bookmarks.get('children', null, function(data) {
				debug(data.status);
				debug(data.response, 5);
			});
		}
		
		this.getOperaMini = function() {
			// Get all bookmarks
			opera.link.bookmarks.get('children', null, function(data) {
				if (data.status != opera.link.response.Ok) {
					debug('failed to get bookmarks');
					return;
				}
				
				debug('got all bookmarks');
				// Find the Opera Mini folder
				var item;
				for (var i = 0; i < data.response.length; i++) {
					item = data.response[i];
					if (item.properties.target == 'mini') {
						// Get all bookmarks inside the Opera Mini folder
						opera.link.bookmarks.get(item.id + '/children', null, function(data2) {
							debug('result');
							debug(data2.status);
							debug(data2.response, 5);
						});
						return;
					}
				}
				
				debug('no Opera Mini folder');
			});
		}
		
		this.create = function() {
			debug('getting favicon');
			
			var img = new Image();
			img.onload = function() {
				debug('making bookmark');
				var icon = opera.link.util.makeIcon(img);
				opera.link.bookmarks.create({
					title: 'Creation Test',
					uri: 'http://chaosinacan.com',
					description: 'Testing',
					icon: icon,
				}, null, function(data) {
					debug(data.status);
					debug(data.response, 5);
				});
			}
			img.onerror = function() {
				debug('failed to get favicon');
			}
			
			img.src = 'http://chaosinacan.com/favicon.ico'
		}
		
		this.createFolder = function() {
			debug('making folder');
			opera.link.bookmarks.createFolder({
				title: 'Folder Test',
			}, null, function(data) {
				if (data.status != opera.link.response.Ok) {
					debug('failed to make folder');
					return;
				}
				
				debug('making child bookmark in ' + data.response.id);
				opera.link.bookmarks.create({
					title: 'Child Test',
					uri: 'http://google.com',
				}, data.response.id, function(data2) {
					debug(data2.status);
					debug(data2.response, 5);
				});
			});
		}
		
		this.trash = function() {
			debug('making bookmark');
			opera.link.bookmarks.create({
				title: 'Trash Test',
				uri: 'http://blah.com',
			}, null, function(data) {
				debug('deleting bookmark ' + data.response.id);
				opera.link.bookmarks.trash(data.response.id, function(data2) {
					debug(data2.status);
					debug(data2.response, 5);
				});
			});
		}
		
	}

}