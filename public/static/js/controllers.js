/**
 * Created by youxiachai on 14-3-14.
 */


var inewsControllers = angular.module('inews.controllers', ['ngRoute']);

inewsControllers.controller('indexCtrl', ['$scope', 'Article','$routeParams', function ($scope, Article, $routeParams){

//    $routeParams.limit = 2;
//    console.log($routeParams);
     Article.get($routeParams, function (data) {
         var articles = data.data;
         $scope.articles = articles.list;
         $scope.page = articles.pageInfo.page;
         $scope.totalPage = [];
         for(var i = 0 ; i < articles.pageInfo.totalPage; i++){
             $scope.totalPage.push(i);
         }


//         console.log( $scope.totalPage.length)
//         console.log(articles.pageInfo.totalPage)
     }, function (err){
         console.log(err);
         alert('err');
     });

    $scope.signin = function () {
        console.log('sigin');
    }

}])

inewsControllers.controller('articleCtrl',['$scope',  '$routeParams','Article','Comment', function ($scope,$routeParams, Article, Comment){
    console.log('article')
    console.log($routeParams)

    Article.get($routeParams, function (result){
        $scope.article = result.data;
    });

    Comment.get($routeParams, function(result) {
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