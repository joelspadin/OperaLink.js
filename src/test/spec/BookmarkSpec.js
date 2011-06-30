describe("Bookmarks", function() {
	
	var olink = opera.link;
	var bookmarks = opera.link.bookmarks;
	
	var allBookmarks;
	var createdBookmark;
	var trashedBookmark;
	
	var response;
	var timeout = 10000;
	var complete = false;
	
	authorize();
	
	beforeEach(function() {
		response = null;
		complete = false;
	});
	
	function callback(e) {
		response = e;
		complete = true;
	}
	
	it('should be able to get all bookmarks', function() {
		bookmarks.getAll(callback);
		
		waitsFor(function() { return complete; }, 'request never completed', timeout);
		
		runs(function() {
			expect(response).not.toBeNull();
			expect(response.status).toEqual(olink.response.Ok);
			expect(response.response).toBeOfType(Array);
			
			// Save list of all bookmarks for other tests
			allBookmarks = response.response;
		});

	});
	
	it('should be able to create a bookmark', function() {
		var params = {
			title: 'Create Bookmark Test',
			uri: 'http://google.com',
		};
		bookmarks.create(params, null, callback);
		
		waitsFor(function() { return complete; }, 'request never completed', timeout);
		
		runs(function() {
			expect(response).not.toBeNull();
			expect(response.status).toEqual(olink.response.Ok);
			expect(response.response).toBeOfType(Object);
			expect(response.response.properties.title).toEqual(params.title);
			expect(response.response.properties.uri).toEqual(params.uri);
			
			// Save the created bookmark
			createdBookmark = response.response;
		});
	});
	
	it('should be able to send a bookmark to the trash', function() {
		expect(createdBookmark).toBeDefined();
		bookmarks.trash(createdBookmark.id, callback);
		
		waitsFor(function() { return complete; }, 'request never completed', timeout);
		
		runs(function() {
			complete = false;
			expect(response).not.toBeNull();
			expect(response.status).toEqual(olink.response.Ok);
			expect(response.response).toBeOfType(Object);
			expect(response.response.id).toEqual(createdBookmark.id);
			
			// check that the bookmark is now in the trash folder
			bookmarks.getAll(callback);
		});
		
		waitsFor(function() { return complete; }, 'request never completed', timeout);
		
		runs(function() {
			expect(response.status).toEqual(olink.response.Ok);
			var items = response.response;
			var trash;
			for (var i = 0; i < items.length; i++) {
				if (items[i].item_type == 'bookmark_folder' && items[i].properties.type == 'trash') {
					trash = items[i];
					break;
				}
			}
				
			expect(trash).toBeDefined();	
			expect(trash.children).toBeOfType(Array);
			
			items = trash.children;
			for (var i = 0; i < items.length; i++) {
				if (items[i].id == createdBookmark.id) {
					trashedBookmark = items[i];
					break;
				}
			}
			
			expect(trashedBookmark).toBeDefined();
		});
	});

	it('should be able to permanently delete a bookmark', function() {
		expect(createdBookmark).toBeDefined();
		olink.bookmarks.deleteItem(createdBookmark.id, callback);
		
		waitsFor(function() { return complete; }, 'request never completed', timeout);
		
		runs(function() {
			expect(response).not.toBeNull();
			expect(response.status).toEqual(olink.response.Deleted);
		});
	});
	
	
});