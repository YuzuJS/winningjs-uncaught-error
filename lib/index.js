﻿"use strict";
/* global MSApp, WinJS */

var NS = "uncaughtError";
var makeEmitter = require("pubit-as-promised").makeEmitter;
var events = ["error"];

module.exports = function winningjsUncaughtErrorPlugin(target) {

    function publishError(error) {
        var parts = error.message.split(":");
        var normalizedError = {
            name: parts.length === 1 ? "UnknownError" : parts[0].trim(),
            message: parts[1] ? parts[1].trim() : parts[0],
            number: error.number, // TODO pull number from message using RegEx.
            url: error.filename,
            lineNumber: error.lineno,
            column: error.colno
        };
        publish("error", normalizedError);
    }

    WinJS.Application.onerror = function (eventInfo) {
        publishError(eventInfo.detail.error);
        return true;
    };

    var that = target[NS] = {};
    var publish = makeEmitter(that, events);

    that.terminateApp = MSApp.terminateApp.bind(MSApp);
};
