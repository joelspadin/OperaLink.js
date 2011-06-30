
function $(sel) {
	return document.querySelector(sel);
}


// Utility functions to manipulate the DOM
var dom = new function DomUtils() {
	// makes a new element given its type, modifiers, and inner HTML
	this.make = function(element, modifiers, content) {
		var el = document.createElement(element);
		if (modifiers) {
			var mod = modifiers.split(' ');
			for (var i = 0; i < mod.length; i++) {
				if (mod[i][0] == '.') {
					el.addClass(mod[i].substr(1));
				}
				else if (mod[i][0] == '#') {
					el.id = mod[i].substr(1);
				}
				else if (mod[i][0] == '[') {
					var match = mod[i].match(/\[(.+?)(?:=(.+?))?\]/);
					if (match) 
						el.setAttribute(match[1], match[2] || '');
				}
			}
		}
		if (content)
			el.innerHTML = content;
		return el;
	}
	
	// Sets the value of a <select> element
	this.setOption = function(select, value) {
		for (var i = 0; i < select.options.length; i++) {
			if (select.options[i].value == value) {
				select.selectedIndex = i;
				return true;
			}
		}
		return false;
	}

	// Gets the checked value of a set of radio boxes
	this.getRadioValue = function(element) {
		var name = element.name;
		var inputs = element.form.elements[name];
		for (var i = 0; i < inputs.length; i++) {
			if (inputs[i].checked)
				return inputs[i].value;
		}
		return null;
	}
	
}



// Utility functions for HTML elements

HTMLElement.prototype.hasClass = function(className) {
	return this.className.split(' ').indexOf(className) != -1;
}

HTMLElement.prototype.addClass = function(className) {
	if (!this.hasClass(className))
		this.className = (this.className + ' ' + className).trim();
}

HTMLElement.prototype.removeClass = function(className) {
	this.className = this.className.split(' ').filter(function(item) {
		return item != className;
	}).join(' ');
}

HTMLElement.prototype.appendChildren = function(newChildren) {
	for (var i = 0; i < newChildren.length; i++) {
		this.appendChild(newChildren[i]);
	}
}

HTMLElement.prototype.removeSelf = function() {
	this.parentNode.removeChild(this);
}


function isError(result) {
	console.log(result.status);
	if (result.status == opera.link.response.Unauthorized)
		return true;
	
	return false;
}


function loadData() {
	var type = window.location.hash.substr(1);
	console.log('loading ' + type);
	
	switch (type) {
		case 'bookmarks':
			Bookmarks.buildTree();
			break;
		case 'notes':
			Notes.buildTree();
			break;
		case 'search':
			Search.buildList();
			break;
		case 'speeddial':
			SpeedDial.buildList();
			break;
		case 'urlfilter':
			UrlFilter.buildList();
			break;
	}
}



var Bookmarks = new function() {
	
	this.buildTree = function() {
		opera.link.bookmarks.getAll(function(result) {
			if (isError(result))
				return;
			
			console.log('got ' + result.response.length + ' bookmarks in root');
			
			var list = $('#bookmarks ul');
			list.innerHTML = '';
			
			for (var i = 0; i < result.response.length; i++) {
				Bookmarks.buildItem(result.response[i], list);
			}

		});
	}
	
	this.buildItem = function(item, parent) {
		
		debug(item);
		
		var el = dom.make('li', '.bookmark');
		var title = dom.make('span');
		title.textContent = item.properties.title + ' ' + item.id;
		
		var list = dom.make('ul', '.children');
		
		el.appendChild(title);
		el.appendChild(list);
		
		parent.appendChild(el);
		
		if (!item.children)
			return;
		for (var i = 0; i < item.children.length; i++) {
			Bookmarks.buildItem(item.children[i], list);
		}
	}
	
}


var Notes = new function() {
	
	this.buildTree = function() {
		opera.link.notes.getAll(function(result) {
			if (isError(result))
				return;
			
			console.log('got ' + result.response.length + ' notes in root');
			
			var list = $('#notes ul');
			list.innerHTML = '';
			
			for (var i = 0; i < result.response.length; i++) {
				Notes.buildItem(result.response[i], list);
			}

		});
	}
	
	this.buildItem = function(item, parent) {
		
		debug(item);
		
		var el = dom.make('li', '.note');
		var title = dom.make('span');
		title.textContent = item.properties.title || item.properties.content;
		
		var list = dom.make('ul', '.children');
		
		el.appendChild(title);
		el.appendChild(list);
		
		parent.appendChild(el);
		
		if (!item.children)
			return;
		for (var i = 0; i < item.children.length; i++) {
			Notes.buildItem(item.children[i], list);
		}
	}
	
}


var Search = new function() {
	
	this.buildList = function() {
		opera.link.searchengines.getAll(function(result) {
			if (isError(result))
				return;
			
			console.log('got ' + result.response.length + ' search engines');
			
			var list = $('#search ul');
			list.innerHTML = '';
			
			for (var i = 0; i < result.response.length; i++) {
				Search.buildItem(result.response[i], list);
			}

		});
	}
	
	this.buildItem = function(item, parent) {
		
		debug(item);
		
		var el = dom.make('li', '.search');
		var title = dom.make('span');
		title.textContent = item.properties.title;
		
		
		el.appendChild(title);	
		parent.appendChild(el);
	}
	
}


var SpeedDial = new function() {
	
	this.buildList = function() {
		opera.link.speeddial.getAll(function(result) {
			if (isError(result))
				return;
			
			console.log('got ' + result.response.length + ' speed dials');
			
			var list = $('#speeddial ul');
			list.innerHTML = '';
			
			for (var i = 0; i < result.response.length; i++) {
				SpeedDial.buildItem(result.response[i], list);
			}

		});
	}
	
	this.buildItem = function(item, parent) {
		
		debug(item);
		
		var el = dom.make('li', '.speeddial');
		var title = dom.make('span');
		title.textContent = item.properties.title;
		
		
		el.appendChild(title);	
		parent.appendChild(el);
	}
	
}

var UrlFilter = new function() {
	
	this.buildList = function() {
		opera.link.urlfilter.getAll(function(result) {
			if (isError(result))
				return;
			
			console.log('got ' + result.response.length + ' filters');
			
			var list = $('#urlfilter ul');
			list.innerHTML = '';
			
			for (var i = 0; i < result.response.length; i++) {
				UrlFilter.buildItem(result.response[i], list);
			}

		});
	}
	
	this.buildItem = function(item, parent) {
		
		debug(item);
		
		var el = dom.make('li', '.urlfilter');
		var title = dom.make('span');
		title.textContent = item.properties.content;
		
		
		el.appendChild(title);	
		parent.appendChild(el);
	}
	
}