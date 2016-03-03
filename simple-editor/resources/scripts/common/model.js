(function () {
    ngApp.factory('LocationsModel', ['$resource', function ($resource) {
        var Locations = $resource('/api/:resource', {}, {
            query: {method:'GET', params:{
                resource: 'locations',
                latitude: '@latitude',
                longitude: '@longitude',
                limit: '@limit',
                list: '@list'
            }, isArray: true}
        });
        var factory = {};
        factory.getLocations = function (callback, that) {
            Locations.query(function (locs) {
                callback(locs, that);
            });
        };
        factory.getLocationsSorted = function (latitude, longitude, limit, callback, that) {
            Locations.query({latitude: latitude, longitude: longitude, limit: limit, list:'true'}, function (locs) {
                callback(locs, that);
            });
        };
        factory.getClosestLocation = function (latitude, longitude, callback, that) {
            Locations.get({latitude: latitude, longitude: longitude}, function (loc) {
                callback(loc, that);
            });
        };

        return factory;
    }]);

    ngApp.factory('UserInfoModel', ['$resource', function ($resource) {
        // var UserResource = $resource('/api/user', {
        //     locationPresets: '@locationPresets',
        //     first_name: '@first_name',
        //     last_name: '@last_name',
        //     payment_processor_ID: '@payment_processor_ID'
        // }, {isArray: false});
        var UserResource = $resource('/api/user', {}, {
            query: {method:'GET', params:{}, isArray: false},
            update: {method:'PUT', params:{}, isArray: false}
        });

        var factory = {};

        factory.getUserInfo = function (info, callback) {
            UserResource.query(info, function (userInfo) {
                callback(userInfo);
            });
        };

        factory.updateUserInfo = function (update, callback) {
            UserResource.update(update, function (res) {
                callback(res);
            });
        };

        factory.addAddress = function (address, callback) {
            UserResource.update({address: {save: address}}, function (res) {
                callback((res && res.message === 'success'), res);
            });
        };

        factory.editAddress = function (address, callback) {
            // TODO: add support for acutally editing addresses, not just adding ones
            UserResource.update({address: {save: address}}, function (res) {
                callback((res && res.message === 'success'), res);
            });
        };

        factory.deleteAddress = function (address, callback) {
            UserResource.update({address: {remove: address}}, function (res) {
                callback((res && res.message === 'success'), res);
            });
        };

        factory.addCard = function (token, callback) {
            UserResource.update({single_use_stripe_token: token}, function (res) {
                callback((res && res.message === 'success'), res);
            });
        };

        factory.editCard = function (card, callback) {
            // TODO: add support for acutally editing addresses, not just adding ones
            UserResource.update({card: {save: card}}, function (res) {
                callback((res && res.message === 'success'), res);
            });
        };

        factory.deleteCard = function (card, callback) {
            UserResource.update({card: {remove: card}}, function (res) {
                callback((res && res.message === 'success'), res);
            });
        };

        return factory;
    }]);

    ngApp.factory('StaticModel', [function () {
        var factory = {};
        factory.states = [
            'AK',
            'AL',
            'AR',
            'AZ',
            'CA',
            'CO',
            'CT',
            'DE',
            'FL',
            'GA',
            'HI',
            'IA',
            'ID',
            'IL',
            'IN',
            'KS',
            'KY',
            'LA',
            'MA',
            'MD',
            'ME',
            'MI',
            'MN',
            'MO',
            'MS',
            'MT',
            'NC',
            'ND',
            'NE',
            'NH',
            'NJ',
            'NM',
            'NV',
            'NY',
            'OH',
            'OK',
            'OR',
            'PA',
            'RI',
            'SC',
            'SD',
            'TN',
            'TX',
            'UT',
            'VA',
            'VT',
            'WA',
            'WI',
            'WV',
            'WY'
        ];
        factory.months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        factory.range = (function () {
            var cache = {};
            return function (min, max, step) {
                var isCacheUseful = (max - min) > 70;
                var cacheKey;

                if (isCacheUseful) {
                    cacheKey = max + ',' + min + ',' + step;

                    if (cache[cacheKey]) {
                        return cache[cacheKey];
                    }
                }

                var _range = [];
                step = step || 1;
                for (var i = min; i <= max; i += step) {
                    _range.push(i);
                }

                if (isCacheUseful) {
                    cache[cacheKey] = _range;
                }

                return _range;
            };
        })();

        return factory;
    }]);
})();
