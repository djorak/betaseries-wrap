var express = require('express'),
    app = express(),
    // move to .env file
    clientId = process.env.BETASERIES_API_KEY,
    clientSecret = process.env.BETASERIES_SECRET,
    oauth2,
    server;

oauth2 = {
    clientID: clientId,
    clientSecret: clientSecret,
    site: 'https://www.betaseries.com',
    tokenPath: '/members/access_token',
    authorizationPath: '/authorize'
};

app.get('/', function(req, res) {
    res.send('<a href="/login">Login with Betaseries</a>');
});

app.get('/login', function(req, res) {
    var params = {
            client_id: oauth2.clientID,
            redirect_uri: 'http://localhost:3000/auth/callback'
        },
        betaseriesUrl;

    params = Object.keys(params).reduce(function(pre, key) {
        return pre + (pre ? '&' : '') + key + '=' + encodeURIComponent(params[key]);
    }, '');

    betaseriesUrl = oauth2.site + oauth2.authorizationPath + '?' + params;

    console.log(betaseriesUrl);

    res.redirect(betaseriesUrl);
});

app.get('/auth/callback', function(req, res) {
    console.log(req, res);
    res.send('done');
});

server = app.listen(8080, function() {
    console.log('Server listening on port %s', server.address().port);
});
