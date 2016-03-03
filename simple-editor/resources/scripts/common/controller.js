var ngApp;

(function () {
    var splitReferrer = document.referrer.split('#asynchronous=');
    if (splitReferrer[1]) {
        window.close();
    }
})();

(function () {
    ngApp = angular.module('Edyza', ['ngResource', 'ngSanitize', 'ngMaterial', 'ngMessages']);
    ngApp.config(function ($mdThemingProvider, $mdIconProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('green')
            .accentPalette('red');
        // .primaryPalette('4565AF')
        // .accentPalette('FFD202');
        $mdIconProvider.defaultIconSet('resources/images/mdi.svg')
            .defaultFontSet('mdi');
    });

    ngApp.filter('trusted', ['$sce', function ($sce) {
        return function (url) {
            return $sce.trustAsResourceUrl(url);
        };
    }]);

    ngApp.filter('capitalize', function() {
        return function(input, scope) {
            if (input != null) {
                input = input.toLowerCase();
                return input.substring(0, 1).toUpperCase() + input.substring(1);
            }
        };
    });

    ngApp.directive('formatPhone', function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elem, attrs, ctrl, ngModel) {
                elem.on('keyup', function () {
                    var origVal = elem.val().replace(/[^\w\s]/gi, '');
                    if (origVal.length === 10) {
                        var str = origVal.replace(/(.{3})/g, '$1-');
                        var phone = str.slice(0, -2) + str.slice(-1);
                        jQuery('#phonenumber').val(phone);
                    }
                });
            }
        };
    });

    document.createCookie = function (name,value,days) {
        var expires = '';
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toGMTString();
        }
        document.cookie = name + '=' + value + expires + '; path=/';
    };

    document.eraseCookie = function (name) {
        document.createCookie(name, '', -1);
    };

    document.getCookie = function (name) {
        var value = '; ' + document.cookie;
        var parts = value.split('; ' + name + '=');
        if (parts.length == 2) {
            return parts.pop().split(';').shift();
        }
    };
})();
