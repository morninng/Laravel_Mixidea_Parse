

Parse.Cloud.define("OgpRetrieve", function(request, response) {

	console.log("ogp retrieve called");
 	url_for_ogp = request.params.url;

	Parse.Cloud.httpRequest({
	  url: 'http://mixidea.org/api/get_ogp.php',
	  method: 'POST',
	  body: url_for_ogp,
	  headers: {
    	'Content-Type': 'application/x-www-form-urlencoded'
  	}
	}).then(function(httpResponse) {
	  // success
	  console.log("response received");
	  console.log(httpResponse.text);
	  console.log(httpResponse.data);
	  response.success(httpResponse.text);
	},function(httpResponse) {
	  // error
	  console.log("ogp retrieve failed");
    response.error('Request failed with response code ' + httpResponse.status);
	});

});

