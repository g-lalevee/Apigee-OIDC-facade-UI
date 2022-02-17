//*******************************************/

var bodyParser = require("body-parser")
var fs = require("fs")
var jwt = require('jsonwebtoken');
var request = require("request")
var session = require("express-session")

//*******************************************/

module.exports = function (app) {
	app.get('/', function(req, res, next) {
		console.log("Call /index.html   ");
		fs.readFile('./html/index.html', 'utf8', (error, page) => {
			evaluate_vars(page, (error, page) => {
				if (error) { throw new Error(error) }
				res.send(page)
			})
		})
	}) 

	app.post('/endSession', function(req, res, next) {
		delete req.session.access_token
		res.send("removed access token from server-side session");
	})

	app.post('/getAccessToken', function(req, res, next) {
		var code = req.body.code;
		var code_verifier = req.body.code_verifier;
		console.log("the authorization code is: " + code);
		// exchange the authorization code
		// for an access token
		var options = {
			method: 'POST',
			url: process.env.ISSUER + "/token",
			form: {
				"grant_type": "authorization_code",
				"code": code,
				"code_verifier": code_verifier,
				"redirect_uri": process.env.REDIRECT_URI
			  },
			headers: {
				'cache-control': 'no-cache',
				'authorization': 'Basic ' + getBasicAuthString(),
				'content-type': 'application/x-www-form-urlencoded'
			}
		}

		request(options, function (error, response, body) {
			if (error) {
				console.log("error", error);
				throw new Error(error);
			}
			console.log("Body from Apigee")
			console.log(body);
			var obj = JSON.parse(body);
			if (obj.hasOwnProperty("access_token")) {
				console.log("the access token is: " + req.session.access_token);
				req.session.access_token = obj.access_token;
			}
			if (obj.hasOwnProperty("idp.jwt")) {
				console.log("The ID Token is" + obj["idp.jwt"]);
			 	req.session.id_token = obj["idp.jwt"];
			}
			var response_to_browser = {}
			response_to_browser.access_token = obj.access_token;
			response_to_browser.access_token_decoded = obj.access_token;
			response_to_browser.id_token = obj["idp.jwt"];
			response_to_browser.id_token_decoded = jwt.decode(obj["idp.jwt"]);
			console.log(response_to_browser.id_token_decoded)
			console.log("the response to the browser is: ")
			console.dir(response_to_browser)
			res.json(JSON.stringify(response_to_browser))
		})
	})

	app.post('/getData', function(req, res, next) {
		var endpoint = req.body.endpoint;
		console.log(" ");
		console.log("---------------------------------------------");
		console.log("the requested endpoint is: " + endpoint);
		console.log(" ");
		console.log("the access_token token is: \n" + req.body.access_token + "\n");
		console.log(" ");
		// send the access token to the requested API endpoint
		if (process.env.hasOwnProperty("DATA_URI") && process.env.DATA_URI != "") {
			var url = process.env.DATA_URI // + "/" + req.body.endpoint
			console.log("sending request to: " + url)
			var options = {
				method: 'GET',
				url: url,
				headers: {
					'cache-control': 'no-cache',
					'authorization': "Bearer " + req.body.access_token,
					'x-apikey': process.env.CLIENT_ID,
					'accept': 'application/json',
					'content-type': 'application/x-www-form-urlencoded'
				}
			}
			console.log("the header is: \n" , options.headers);
			console.log(" ");	
			request(options, function (error, response, body) {
				if (error) throw new Error(error)
				console.log("******\nresponse from API gateway: ")
				console.log("the status code is: " + response.statusCode)
				console.log("the body is:")
				console.log(body)
				if (response.statusCode == 403) {
					res.json({message: 'forbidden'})
					console.log("the request is forbidden")
				}
				else if (response.statusCode == 401) {
					res.json({ message: 'unauthorized' })
					console.log("the request is unauthorized")
				}
				// Add ec here for 504
				else {
					res.json(body)
				}
			})
		}
		else {
			res.json({message: 'data_uri not yet defined.'})
		}
	})


	function getBasicAuthString() {
		var x = process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
		var y = new Buffer(x).toString('base64')
		return y
	}
}

function evaluate_vars(page, callback) {
	var regex
	for (var key in process.env) {
		regex = new RegExp('{{' + key + '}}', 'g')
		page = page.replace(regex, process.env[key])
	}
	return callback(null, page)
}
