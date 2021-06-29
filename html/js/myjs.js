

var signIn = new OktaSignIn(
    {
        baseUrl: '{{OKTA_TENANT}}'
    }
)

signIn.session.get(function (res) {
    // Okta session exists
    if (res.status === 'ACTIVE') {
        console.log("there is an Okta session.")
        console.dir(res)
        var arr = res.login.split("@") // get short login name

        $("#username").html(arr[0])
    }

    // No session, or error retrieving the session. Render the Sign-In Widget.
    else if (res.status === 'INACTIVE') {
        console.log("there is no Okta session.")
        $("#username").html("[none]")
    }
})

function log_out() {

    localStorage.clear();

    $.ajax({
        type: 'POST',
        url: '/endSession',
        success: function(data) {
            console.log("server-side access token cleared.")
            signIn.session.close(function (err) {
                if (err) {
                    // errors usually happen bc Okta session does not exist
                    location.reload(true)
                }
                console.log("successfully signed user out.")
                location.reload(true)
            })
        }
    })
}

window.onload = function() {

            // look for login url in local storage
    // just for reference
    if (localStorage.getItem("authURI")) {
        console.log("authn uri: " + localStorage.getItem("authURI"));
    }

    // look for parameters in url
    if (window.location.hash) {
        var urlParams = getParams(window.location.hash.substring(1));

        console.log("the url params are: ");

        // show the url parameters nicely in the console
        for (const prop in urlParams) {
            console.log(prop + ": " + urlParams[prop]);
        }

        // if we have an authorization code, send it to the server
        // immediately to get an access token and id token from Okta.
        // The tokens will be sent to the server, but the server side app
        // will also send them down to the browser for demo purposes
        if (urlParams.code) {
            getAccessToken(urlParams.code)
        }
    }
}



function getParams(hash) {

var arr = hash.split("&");

var params = {};

// convert the url params to an object
for (var i = 0; i < arr.length; i++) {
    var kvp = arr[i].split("=");
    params[kvp[0]] = kvp[1];
}

return params;
}

function getAccessToken(code) {

$.ajax({
    type: 'POST',
    data: JSON.stringify({ "code": code}),
    contentType: 'application/json',
    url: '/getAccessToken',
    success: function(data) {
        var obj = JSON.parse(data)

        console.log("access token:")
        console.log(obj.access_token)

        console.log("id token:")
        console.log(obj.id_token)

        $("#access_token_decoded").html("<pre>" + JSON.stringify(obj.access_token_decoded, null, 1) + "</pre>")

        $("#id_token_decoded").html("<pre>" + JSON.stringify(obj.id_token_decoded, null, 1) + "</pre>")
    }
});
}

// make a request to the API gateway
// request will go to the server-side app first so the app can include the access token
function getData(endpoint) {

$.ajax({
    type: 'POST',
    data: JSON.stringify({ "endpoint": endpoint }),
    contentType: 'application/json',
    url: '/getData',
    success: function(data) {
        console.dir(data)

        var obj

        if (typeof data === 'object') { obj = data }
        else { obj = JSON.parse(data) }

        $("#results_" + endpoint).html("<pre>" + JSON.stringify(obj, null, 1) + "</pre>");
    }
})
}

function getNonce() {
var text = "";
var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

for (var i = 0; i < 12; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

return text;
}

function redirectToOkta(level) {
//var uri = '{{ISSUER}}/v1/authorize?response_type=code&client_id={{CLIENT_ID}}&redirect_uri={{REDIRECT_URI}}&response_mode=fragment'

uri += '&state=' + getNonce()
uri += '&nonce=' + getNonce()
uri += '&prompt=login&scope=openid email address'

// additional scopes
//if (level === "silver" || level === "gold") { uri += " http://myapp.com/scp/silver"; };
//if (level === "gold") { uri += " http://myapp.com/scp/gold"; }

localStorage.setItem("authURI", uri);

console.log("authn URI: " + uri);

window.location = uri;
}
