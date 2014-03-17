
angular.module('inews.filters', []).
    filter('pageactive',function() {
        return function(page, index) {
            console.log('page ->' + page + ' index ' + index);
            return index + 1 == page ? 'active' : '';
        }
    })
    .filter('checkdiggs', function (){
        return function(article) {
             return article.isDigg ? 'on' : '';
        }
    })
