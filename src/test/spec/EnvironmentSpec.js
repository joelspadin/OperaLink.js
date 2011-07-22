describe("OperaLink.js Environment", function() {
	
	var olink = opera.link;
	authorize();

	
	describe("Storage", function() {
	
		it('should exist', function() {
			expect(olink.storage).toBeDefined();
			expect(olink.storage).not.toBeNull();
		});
	
		it('should be a storage object', function() {
			expect(olink.storage).toBeOfType(Storage);
		});
	});
	
	xdescribe("Authorization", function() {
	
		it('should have a valid OAuth token', function() {
			var complete = false;
			var authorized = false;
			olink.testAuthorization(function(result) {
				authorized = result;
				complete = true;
			});
			
			waitsFor(function() { return complete; }, 
				'testAuthorization never completed', 10000);
			
			runs(function() {
				expect(authorized).toBeTruthy();
			});
		});
	
	});
	
});