// I found this somewhere on the Internet and modified it a bit to fit my needs.
// I don't remember where it is from now, but I'm guessing StackOverflow.

var debug;

if (false)
	debug = function() {}
else
	debug = (function() {
		var max,
			depth = 0,
			INDENT = "\t\t\t\t\t\t\t\t\t\t\t\t\t\t";
		function valueToStr(value, depth) {
			
			if (value instanceof HTMLElement)
				return value.toString();
			
			switch(typeof value) {
				case "object": 
					return objectToStr(value, depth + 1);
				case "function": 
					return "function";
				case "string":
					return "'"+value+"'";
				case "undefined":
					return "undefined";
				default:         
					return value;
			}
		};
		function objectToStr(object, depth) {
			if(depth > max)
				return 'DEPTH LIMIT';
			var type = Object.prototype.toString.call(object),
				output = "\n",
				indent = INDENT.substr(0, depth);
			for(var key in object)
				output += indent + valueToStr(key) + ": " + valueToStr(object[key], depth) + ",\n";
			indent = INDENT.substr(0, depth - 1);
			switch(type) {
				case "[object Object]":
					return "{ " + output.substr(0, output.length - 2) + "\n" + indent + "}";  
				case "[object Array]":
					return "[ " + output.substr(0, output.length - 2) + "\n" + indent + "]";  
				default:
					return;
			}
		};
		return function(value, MAX) {
			max = MAX || 2;
			value = valueToStr(value, depth);
			opera.postError(value);
		};
	})();


