/**
 * Created by youxiachai on 14-3-14.
 */

var inewsApp = angular.module('inews', [
    'ngRoute',
    'inews.services',
    'inews.controllers',
    'inews.directives',
    'inews.filters'
])

inewsApp.config(['$routeProvider', function ($routeProvider){

    var index = {
        templateUrl: 'partials/index.html',
        controller: 'indexCtrl'
    }

    var login = {
        templateUrl: 'partials/login.html',
        controller : 'userCtrl'
    }

    var articles = {
        templateUrl: 'partials/article.html',
        controller : 'articleCtrl'
    }

    $routeProvider.
        when('/', index).
        when('/login', login).
        when('/articles/:id', articles).
        otherwise({
            redirectTo: '/'
        });
}])