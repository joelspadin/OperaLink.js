describe("Bookmarks", function() {
	
	var olink = opera.link;
	var bookmarks = opera.link.bookmarks;
	var server = OLinkServer;
	
	function cb(data) {
		console.log('status: ' + data.status + '\nresponse: ' + data.response);
	}
	
	//olink.debug = true;
	authorize();

	beforeEach(function() {
		setupBookmarks();
	})

	it('request to "/bookmark" should return Method Not Allowed', function() {
		var callback = sinon.spy();
		bookmarks.get('', callback);
		server.respond();
		
		expect(callback).toHaveBeenCalledWith({
			status: olink.response.MethodNotAllowed,
			response: ''
		});	
	});

	it('should be able to get all bookmarks', function() {
		var callback = sinon.spy();
		bookmarks.getAll(callback);
		server.respond();
		
		expect(callback).toHaveBeenCalledWith({
			status: olink.response.Ok,
			response: fakeBookmarkData
		});
	});
	
	it('should be able to get a bookmark by ID', function() {
		var callback = sinon.spy();
		bookmarks.get('D57C973715B847CAB4A8B8398D325CAC', callback);
		server.respond();
		
		expect(callback).toHaveBeenCalledWith({
			status: olink.response.Ok,
			response: server.findById(fakeBookmarkData, 'D57C973715B847CAB4A8B8398D325CAC')
		});
	});
	
	it("should be able to get a bookmark folder's children by its ID", function() {
		var callback = sinon.spy();
		bookmarks.getAll('4E1601F6F30511DB9CA51FD19A7AAECA', callback);
		server.respond();
		
		expect(callback).toHaveBeenCalledWith({
			status: olink.response.Ok,
			response: server.findById(fakeBookmarkData, '4E1601F6F30511DB9CA51FD19A7AAECA').children
		});
	})
	
	it('should be able to get a bookmark within a folder by its ID', function() {
		var callback = sinon.spy();
		bookmarks.get('4E1601F6F30511DB9CA51FD19A7AAECA/740C2D4ABC09468DB5A26170AF2609E6', callback);
		server.respond();
		
		expect(callback).toHaveBeenCalledWith({
			status: olink.response.Ok,
			response: server.findById(fakeBookmarkData, '4E1601F6F30511DB9CA51FD19A7AAECA/740C2D4ABC09468DB5A26170AF2609E6')
		});
	});
	
	
	function setupBookmarks() {
		var respond = OLinkServer.makeResponse;
		var server = OLinkServer.server;

		server.respondWith(/\/bookmark(\/\?.+)$/, function(xhr) {
			if (xhr.method == 'GET')
				respond(405, 'html', '', xhr);
		});

		server.respondWith(/\/bookmark\/descendants(\/?.+)$/, function(xhr) {
			if (xhr.method == 'GET')
				respond(200, 'json', fakeBookmarkData, xhr);
		});

		server.respondWith(/\/bookmark\/([0-9A-Z/]+)(\/\?.+)$/, function(xhr, id) {
			if (xhr.method == 'GET') {
				var data = OLinkServer.findById(fakeBookmarkData, id);
				respond(200, 'json', data, xhr);
			}
		});

		server.respondWith(/\/bookmark\/([0-9A-Z/]+)\/descendants(\/\?.+)$/, function(xhr, id) {
			if (xhr.method == 'GET') {
				var data = OLinkServer.findById(fakeBookmarkData, id).children;
				respond(200, 'json', data, xhr);
			}
		});

	}


	var fakeBookmarkData = [
		{
			'item_type': 'bookmark_folder',
			'id': '4E1601F6F30511DB9CA51FD19A7AAECA',
			'properties': {
				'show_in_panel': false,
				'title': 'Trash',
				'panel_pos': -1,
				'show_in_personal__bar': false,
				'type': 'trash',
				'personal_bar_pos': -1
			},
			'children': [
				{
					'item_type': 'bookmark',
					'id': '740C2D4ABC09468DB5A26170AF2609E6',
					'properties': {
						 'created': '2011-04-24T02:39:52Z',
						 'uri': 'http://test.com',
						 'title': 'Trash Test'
					}
				}
			]
		},
		{
			'item_type': 'bookmark',
			'id': 'D57C973715B847CAB4A8B8398D325CAC',
			'properties': {
				'created': '2011-04-19T04:39:35Z',
				'uri': 'http://opera.com',
				'title': 'Test Bookmark'
			}
		}
	]
	
	
});


