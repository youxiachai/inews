/**
 * Created by youxiachai on 14-2-13.
 */

var http = require('http'),
    express = require('express'),
    favicon = require('static-favicon'),
    app = express ();

app.set('port', 4001);

//app.use(express.logger('dev'));

app.use(require('morgan')('dev'));

// cookie support
// cookie support
//app.use(express.cookieParser('testInews'));

// add req.session cookie support


//app.use(express.cookieSession());


//app.use(require('cookie-parser')('testInews'));

app.use(require('cookie-session')('testInews'));

app.use(require('body-parser')());


app.use(require('method-override')())

//app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/public/templates');
app.set('view engine', 'ejs');


app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(express.static(__dirname + '/public/static'));
app.use('/templ' , express.static(__dirname + '/public/templates'));


//app.get('/', function (req, res){
//
//    res.redirect('index.html');
//})

require('./controllers/account')(app)
require('./controllers/article')(app)

http.createServer(app).listen(app.get('port'), function () {
    console.log('env: ' + process.env.NODE_ENV);
    console.log('Express server listening on port ' + app.get('port'));
});
