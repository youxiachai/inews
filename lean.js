/**
 * Created by youxiachai on 14-2-14.
 */
var crypto = require('crypto');

var pawwd = '123456';

console.log(crypto.createHash('md5').update('youxiachai@gmail.com').digest('hex'))


//  sdF!#$FDA
//sha1($password . '$' . $key);
//console.log(crypto.createHash('sha1').update('123456' + '$' + 'sdF!#$FDA').digest('hex'))
var password = crypto.createHash('sha1').update('123456' + '$' + 'd#!AVFed').digest('hex')

//console.log(password)
//
//
//console.log(parseInt(100 / 50) + 1)
//
//var href = /^\/users\/\d$/
//console.log(href.test('/users/1'));

var atEx = /@(\w+)/g;

var xx1 = '@youxiachai x ';

//console.log(atEx.match(xx1))

console.log(xx1.match(atEx))

var xss = require('xss');
var html = xss('<script>alert("xss");</script>');

var email = xss('youxachai@gameil.com')
console.log(email)
console.log(html);

var marked = require('marked');
marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});

console.log(marked('I am using __markdown__. <script>alert("xss");</script>'));


console.log(marked('## ook'));

var test1 = '/users/notifications?status=1';

console.log(test1.split('=')[1])
var test2= '/users/notifications';
console.log(test2.split('=')[1])

console.log(!0)


var validator = require('validator');

console.log(validator.isNull(null))//=> true
