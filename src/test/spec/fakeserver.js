/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var OLinkServer = new function() {
	this.server = null;
	this.fakeApiUrl = '/';
	var oldApiUrl = opera.link.apiurl;
	
	beforeEach(function() {
		OLinkServer.server = sinon.fakeServer.create();
		opera.link.apiurl = OLinkServer.fakeApiUrl;
	});

	afterEach(function() {
		OLinkServer.server.restore();
		opera.link.apiurl = oldApiUrl;
	});
	
	this.respond = function() {
		this.server.respond();
	}
	
	function isArray(obj) {
		return (obj.constructor.toString().indexOf("Array") != -1)
	}
	
	/**
	 * Searches the data for an item with the given id and returns it
	 * or "null" if no item is found. If "id" has multiple parts, 
	 * i.e. "foo/bar", this will search for the id, "foo", then for a
	 * child elemenent, "bar".
	 */
	this.findById = function(data, id) {
		var parts = isArray(id) ? id :
			id.split('/').filter(function(x) { return !!x });
		
		for (var i = 0; i < data.length; i++) {
			if (data[i].id == parts[0]) {
				if (parts.length == 1)
					return data[i];
				else {
					parts.splice(0, 1);
					return OLinkServer.findById(data[i].children, parts);
				}
			}
		}
		
		return null;
	}
	
	
	this.makeResponse = function(status, type, data, xhr) {
		var h = {};
		type = type || 'text';
		data = data || '';
		
		if (typeof data === 'object')
			data = JSON.stringify(data);
		
		switch (type) {
			case 'text': h['Content-Type'] = 'text/plain'; break;
			case 'html': h['Content-Type'] = 'text/html; charset=utf-8'; break;
			case 'json': h['Content-Type'] = 'application/json; charset=utf-8'; break;
			break;
		}
		
		h['Content-Length'] = data.length;
		
		if (xhr)
			xhr.respond(status, h, data);
		
		return [status, h, data];
	}
	
	this.badRequest = function(xhr) {
		this.makeResponse(400, 'text', 'Bad Request', xhr);
	}
	
	this.methodNotAllowed = function(xhr) {
		this.makeResponse(405, 'html', '', xhr);
	}
	
}



