var express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    OAuth2Strategy = require('passport-oauth2'),
    app = express(),
    // move to .env file
    clientId = process.env.BETASERIES_API_KEY,
    clientSecret = process.env.BETASERIES_SECRET,
    server;

app.use(bodyParser.json());
app.use(passport.initialize());

passport.use('betaseries', new OAuth2Strategy({
        authorizationURL: 'https://www.betaseries.com/authorize',
        tokenURL: 'https://api.betaseries.com/members/access_token',
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: 'http://localhost:2569/auth/betaseries/callback',
        customHeaders: {
            'X-BetaSeries-Version': '2.4',
            'X-BetaSeries-Key': clientId
        }
    },
    function(accessToken, refreshToken, params, profile, done) {
        console.log('params:', params);
        done(null, params.id);
    }
));

app.get('/', function(req, res) {
    res.send('Hello World');
});

app.get('/login', function(req, res) {
    res.send('<a href="/auth/betaseries">Log In with Betaseries</a>');
});

// Redirect the user to the OAuth 2.0 provider for authentication.  When
// complete, the provider will redirect the user back to the application at
//     /auth/provider/callback
app.get('/auth/betaseries', passport.authenticate('betaseries'));

// The OAuth 2.0 betaseries has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
app.get('/auth/betaseries/callback',
    passport.authenticate('betaseries', {
        successRedirect: '/',
        failureRedirect: '/login'
    })
);

server = app.listen(2569, function() {
    console.log('Server listening on port %s', server.address().port);
});
