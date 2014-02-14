/**
 * Created by youxiachai on 14-2-13.
 */

var http = require('http'),
    express = require('express')
    app = express ();

app.set('port', 4001);

//app.use(express.logger('dev'));
// cookie support
// cookie support
app.use(express.cookieParser('testInews'));

// add req.session cookie support
app.use(express.cookieSession());
// app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());

//app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/public/templates');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public/static'));
app.use('/templ' , express.static(__dirname + '/public/templates'));


app.get('/', function (req, res){

    res.render('index')
})

require('./controllers/account')(app)
require('./controllers/article')(app)

http.createServer(app).listen(app.get('port'), function () {
    console.log('env: ' + process.env.NODE_ENV);
    console.log('Express server listening on port ' + app.get('port'));
});
