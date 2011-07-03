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

function fakeGetRequest(props) {
    spyOn(opera.link, 'get').andCallFake(function(u, p, cb) {
        var responseObject = {'status': opera.link.response.Ok,
                              'responseText': ''};
        for (var i in props) {
            responseObject[i] = props[i];
        }
        cb(responseObject);
    });
}

beforeEach(function() {
	this.addMatchers({
		toBeOfType: function(type) {
			return this.actual instanceof type;
		}
	});
});