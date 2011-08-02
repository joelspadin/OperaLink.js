

function authorize() {
	opera.link.consumer(
		'nqcGiIYdmDCLNqoiHr6tlUEaPgYwtYA4',
		'CgIxItz8YxkO6tB2uHUl6MuTxIK8Vcza');
	opera.link.loadToken();
}

// Helper functions

/**
 * Creates a string with the given level of indentation
 */
function indent(level) {
	var string = '';
	for (var i = level; i > 0; i--)
		string += '    ';
	return string;
}

/**
 * Formats an object as a string
 */
function writeObject(obj, name, level) {
	level = level || 0;
	
	var string = indent(level) + (name ? name + ': ' : '') + '{';
	level++;
	for (var key in obj) {
		if (typeof obj[key] == 'object') {
			if (level == writeObject.maxLevel)
				string += '\n' + indent(level) + key + ': [Level Limit]';
			else
				string += '\n' + writeObject(obj[key], key, level);
		}
		else
			string += '\n' + indent(level) + key + ': ' + obj[key];
	}
	level--;
	return string + '\n' + indent(level) + '}';
}

writeObject.maxLevel = 3;

/**
 * Clones any object that can be formatted as JSON
 */
function cloneObject(obj) {
	return JSON.parse(JSON.stringify(obj));
}


beforeEach(function() {
	this.addMatchers({
		toBeOfType: function(type) {
			return this.actual instanceof type;
		}
	});
});