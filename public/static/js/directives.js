/**
 * Created by youxiachai on 14-3-18.
 */


'use strict';

/* Directives */


var inewsDirectives = angular.module('inews.directives', []);

inewsDirectives.directive('topmenu', function() {
        return {
            restrict: 'C',
            replace : true,
            template: '<header id="header"><menu class="wrapper clearfix"><li class="on"><a href="#"><i class="font font-monitor"></i> iNews</a></li><li><a href="#latest"><i class="font font-clock"></i> Latest</a></li><li><a href="#leaders" class="topuser"><i class="font font-user"></i> Leaders</a></li><li class="submit"><a href="#shared"><i class="font font-edit"></i> Share one</a></li></menu></header>'
        }
    });