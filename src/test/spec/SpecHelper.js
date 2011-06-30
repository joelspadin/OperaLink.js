/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function authorize() {
	opera.link.consumer(
		'nqcGiIYdmDCLNqoiHr6tlUEaPgYwtYA4',
		'CgIxItz8YxkO6tB2uHUl6MuTxIK8Vcza');
	opera.link.loadToken();
}

beforeEach(function() {
	this.addMatchers({
		toBeOfType: function(type) {
			return this.actual instanceof type;
		}
	});
});