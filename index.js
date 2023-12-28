"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIOMetrics = exports.metrics = void 0;
var express = require("express");
var prom = require("prom-client");
function metrics(ioServer, options) {
    return new SocketIOMetrics(ioServer, options);
}
exports.metrics = metrics;
var SocketIOMetrics = /** @class */ (function () {
    function SocketIOMetrics(ioServer, options) {
        this.boundNamespaces = new Set();
        this.defaultOptions = {
            port: 9090,
            path: '/metrics',
            createServer: true,
            collectDefaultMetrics: false,
            checkForNewNamespaces: true
        };
        this.options = __assign(__assign({}, this.defaultOptions), options);
        this.ioServer = ioServer;
        this.register = prom.register;
        this.initMetrics();
        this.bindMetrics();
        if (this.options.collectDefaultMetrics) {
            prom.collectDefaultMetrics({
                register: this.register
            });
        }
        if (this.options.createServer) {
            this.start();
        }
    }
    /*
    * Metrics Server
    */
    SocketIOMetrics.prototype.start = function () {
        if (!this.expressServer || !this.expressServer.listening) {
            this.initServer();
        }
    };
    SocketIOMetrics.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.expressServer.close()];
            });
        });
    };
    SocketIOMetrics.prototype.initServer = function () {
        var _this = this;
        this.express = express();
        this.expressServer = this.express.listen(this.options.port);
        this.express.get(this.options.path, function (req, res) {
            res.set('Content-Type', _this.register.contentType);
            res.end(_this.register.metrics());
        });
    };
    /*
    * Metrics logic
    */
    SocketIOMetrics.prototype.initMetrics = function () {
        this.metrics = {
            connectedSockets: new prom.Gauge({
                name: 'socket_io_connected',
                help: 'Number of currently connected sockets'
            }),
            connectTotal: new prom.Counter({
                name: 'socket_io_connect_total',
                help: 'Total count of socket.io connection requests',
                labelNames: ['namespace']
            }),
            disconnectTotal: new prom.Counter({
                name: 'socket_io_disconnect_total',
                help: 'Total count of socket.io disconnections',
                labelNames: ['namespace']
            }),
            eventsReceivedTotal: new prom.Counter({
                name: 'socket_io_events_received_total',
                help: 'Total count of socket.io received events',
                labelNames: ['event', 'namespace']
            }),
            eventsSentTotal: new prom.Counter({
                name: 'socket_io_events_sent_total',
                help: 'Total count of socket.io sent events',
                labelNames: ['event', 'namespace']
            }),
            bytesReceived: new prom.Counter({
                name: 'socket_io_receive_bytes',
                help: 'Total socket.io bytes received',
                labelNames: ['event', 'namespace']
            }),
            bytesTransmitted: new prom.Counter({
                name: 'socket_io_transmit_bytes',
                help: 'Total socket.io bytes transmitted',
                labelNames: ['event', 'namespace']
            }),
            errorsTotal: new prom.Counter({
                name: 'socket_io_errors_total',
                help: 'Total socket.io errors',
                labelNames: ['namespace']
            })
        };
    };
    SocketIOMetrics.prototype.bindMetricsOnEmitter = function (server, labels) {
        var _this = this;
        var blacklisted_events = new Set([
            'error',
            'connect',
            'disconnect',
            'disconnecting',
            'newListener',
            'removeListener'
        ]);
        server.on('connect', function (socket) {
            // Connect events
            _this.metrics.connectTotal.inc(labels);
            _this.metrics.connectedSockets.set(_this.ioServer.engine.clientsCount);
            // Disconnect events
            socket.on('disconnect', function () {
                _this.metrics.disconnectTotal.inc(labels);
                _this.metrics.connectedSockets.set(_this.ioServer.engine.clientsCount);
            });
            // Hook into emit (outgoing event)
            var org_emit = socket.emit;
            socket.emit = function (event) {
                var data = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    data[_i - 1] = arguments[_i];
                }
                if (!blacklisted_events.has(event)) {
                    var labelsWithEvent = __assign({ event: event }, labels);
                    _this.metrics.bytesTransmitted.inc(labelsWithEvent, _this.dataToBytes(data));
                    _this.metrics.eventsSentTotal.inc(labelsWithEvent);
                }
                return org_emit.apply(socket, __spreadArray([event], data, true));
            };
            // Hook into onevent (incoming event)
            var org_onevent = socket.onevent;
            socket.onevent = function (packet) {
                if (packet && packet.data) {
                    var _a = packet.data, event_1 = _a[0], data = _a[1];
                    if (event_1 === 'error') {
                        _this.metrics.connectedSockets.set(_this.ioServer.engine.clientsCount);
                        _this.metrics.errorsTotal.inc(labels);
                    }
                    else if (!blacklisted_events.has(event_1)) {
                        var labelsWithEvent = __assign({ event: event_1 }, labels);
                        _this.metrics.bytesReceived.inc(labelsWithEvent, _this.dataToBytes(data));
                        _this.metrics.eventsReceivedTotal.inc(labelsWithEvent);
                    }
                }
                return org_onevent.call(socket, packet);
            };
        });
    };
    SocketIOMetrics.prototype.bindNamespaceMetrics = function (server, namespace) {
        if (this.boundNamespaces.has(namespace)) {
            return;
        }
        var namespaceServer = server.of(namespace);
        this.bindMetricsOnEmitter(namespaceServer, { namespace: namespace });
        this.boundNamespaces.add(namespace);
    };
    SocketIOMetrics.prototype.bindMetrics = function () {
        var _this = this;
        Object.keys(this.ioServer._nsps).forEach(function (nsp) {
            return _this.bindNamespaceMetrics(_this.ioServer, nsp);
        });
        if (this.options.checkForNewNamespaces) {
            setInterval(function () {
                Object.keys(_this.ioServer._nsps).forEach(function (nsp) {
                    return _this.bindNamespaceMetrics(_this.ioServer, nsp);
                });
            }, 2000);
        }
    };
    /*
    * Helping methods
    */
    SocketIOMetrics.prototype.dataToBytes = function (data) {
        try {
            return Buffer.byteLength((typeof data === 'string') ? data : JSON.stringify(data) || '', 'utf8');
        }
        catch (e) {
            return 0;
        }
    };
    return SocketIOMetrics;
}());
exports.SocketIOMetrics = SocketIOMetrics;
