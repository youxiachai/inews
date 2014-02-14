/**
 * Created by youxiachai on 14-2-14.
 */
var crypto = require('crypto');

var pawwd = '123456';

console.log(crypto.createHash('md5').update(pawwd).digest('hex'))
console.log(crypto.createHash('sha1').update(pawwd).digest('hex'))

//  sdF!#$FDA
//sha1($password . '$' . $key);
//console.log(crypto.createHash('sha1').update('123456' + '$' + 'sdF!#$FDA').digest('hex'))
var password = crypto.createHash('sha1').update('123456' + '$' + 'd#!AVFed').digest('hex')

console.log(password)


console.log(parseInt(100 / 50) + 1)

var href = /^\/users\/\d$/
console.log(href.test('/users/1'));