/**
 * Created by youxiachai on 14-3-14.
 */


var inewsControllers = angular.module('inews.controllers', []);

inewsControllers.controller('indexCtrl', ['$scope', 'Article', function ($scope, Article){


     Article.list.get({limit : '2'})
         .$promise.then(function(data) {
             console.log(data);
             var articles = data.data;
             $scope.articles = articles.list;
             console.log(articles);
             $scope.page = articles.pageInfo.page;
             $scope.totalPage = new Array(articles.pageInfo.totalPage);

         });

    $scope.signin = function () {
        console.log('sigin');
    }

}])

inewsControllers.controller('articleCtrl',['$scope',  '$routeParams','Article','Comment', function ($scope,$routeParams, Article, Comment){
    console.log('article')
    console.log($routeParams)

    Article.list.get($routeParams)
        .$promise.then(function(result) {
            $scope.article = result.data;
        });

    Comment.list.get($routeParams)
        .$promise.then(function(result) {
            var  comments =  result.data;
            $scope.comments = comments.list;
            $scope.page =  comments.pageInfo.page;
            $scope.totalPage = new Array(comments.pageInfo.totalPage);
        });


}])

inewsControllers.controller('userCtrl', ['$scope', 'User', function ($scope, User) {
    console.log('init submit')
    $scope.submit = function () {
        console.log($scope);
        console.log($scope.user);
        console.log('submit !');
    }
}])