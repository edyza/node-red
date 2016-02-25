var express = require('express');
var requestProxy = require('express-request-proxy');
var fs = require('fs');
var async = require('async');

var app;
var server;

module.exports = {
    init: function (callback) {
        app = express();

        app.use(express.static('build/public'));

        var nodes;
        app.get('/nodes', function (res, req) {
            if (!nodes) {
                nodes = fs.readFileSync('static-api/nodes');
            }
            res.send(nodes);
        })

        app.all('/*', requestProxy({
            url: "http://localhost:1880/*"
        }));

        if (callback) {
            callback();
        }
    },
    start: function (callback) {
        server = app.listen(8081, function () {
            console.log('Example app listening on port ' + server.port + '!');

            if (callback) {
                callback();
            }
        });
    },
    stop: function (callback) {
        if (server) {
            server.close();
        }

        if (callback) {
            callback();
        }
    }
};
