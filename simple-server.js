var express = require('express');
var request = require('request');
var requestProxy = require('express-request-proxy');
var fs = require('fs');
var async = require('async');

var app;
var server;

module.exports = {
    init: function (callback) {
        app = express();

        app.use(express.static('build/public'));

        var nodes = {
            json: undefined,
            html: undefined
        };
        app.get('/nodes', function (req, res) {
            if (req.get("accept") == "application/json") {
                if (!nodes.json) {
                    nodes.json = fs.readFileSync('static-api/nodes.json');
                }
                res.contentType('application/json; charset=utf-8');
                res.send(nodes.json);
            } else {
                if (!nodes.html) {
                    nodes.html = fs.readFileSync('static-api/nodes.html');
                }
                res.send(nodes.html);
            }
        });

        app.all('/*', function (req, res, next) {
            next();
        }, requestProxy({
            url: "http://localhost:1880/*"
        }));

        if (callback) {
            callback();
        }
    },
    start: function (callback) {
        if (!server) {
            server = app.listen(8081, function () {
                console.log('Example app listening on port ' + server.address().port + '!');

                if (callback) {
                    callback();
                }
            });
        }
    },
    stop: function (callback) {
        if (server) {
            server.close();
            server = undefined;
        }
        if (app) {
            app = undefined;
        }

        if (callback) {
            callback();
        }
    }
};
