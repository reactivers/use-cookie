'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var isBrowser = function () {
    return typeof window !== "undefined";
};
var tryJSONparse = function (obj) {
    try {
        return JSON.parse(obj);
    }
    catch (_a) {
        return obj;
    }
};
var tryJSONStringify = function (obj) {
    if (typeof obj === "string")
        return obj;
    try {
        return JSON.stringify(obj);
    }
    catch (_a) {
        return obj;
    }
};
Array(12).fill(0).map(function (_, index) { return ((index) % 12) + 1; });

var CookieContext = react.createContext({});
var CookieProvider = function (_a) {
    var _b = _a.withState, withState = _b === void 0 ? true : _b, onChange = _a.onChange, children = _a.children;
    var getCookies = react.useCallback(function () {
        if (!isBrowser())
            return {};
        var _cookies = document.cookie.split(';');
        var cookies = {};
        _cookies.forEach(function (cookie) {
            var _a = cookie.split("="), key = _a[0], value = _a[1];
            cookies[key.trim()] = tryJSONparse(value);
        });
        return cookies;
    }, []);
    var _c = react.useState(getCookies()), cookie = _c[0], setCookie = _c[1];
    var setItem = react.useCallback(function (_a) {
        var key = _a.key, value = _a.value, expireDays = _a.expireDays, expireHours = _a.expireHours, expire = _a.expire, _b = _a.path, path = _b === void 0 ? "/" : _b;
        if (!key)
            throw new Error("No key passed");
        var d = new Date();
        var oneHour = 60 * 60 * 1000;
        if (!!expireDays) {
            d.setTime(d.getTime() + (expireDays * 24 * oneHour));
        }
        else if (!!expireHours) {
            d.setTime(d.getTime() + (expireHours * oneHour));
        }
        var newCookie = tryJSONStringify(value);
        document.cookie = key.trim() + "=" + newCookie + ";expires=" + (expire || d.toUTCString()) + ";path=" + path;
        if (withState)
            setCookie(function (old) {
                var _a;
                var newCookies = __assign(__assign({}, old), (_a = {}, _a[key.trim()] = newCookie, _a));
                if (onChange)
                    onChange(newCookies);
                return newCookies;
            });
        else if (onChange)
            onChange(getCookies());
    }, [onChange, withState, getCookies]);
    var getItem = react.useCallback(function (key) {
        if (!key)
            throw new Error("No key passed");
        if (withState)
            return cookie[key];
        else
            return getCookies()[key];
    }, [cookie, withState, getCookies]);
    var removeItem = react.useCallback(function (key) {
        if (!key)
            throw new Error("No key passed");
        var invalidDate = "Thu, 01 Jan 1970 00:00:01 GMT";
        document.cookie = key.trim() + "= ;expires=" + invalidDate + ";";
        if (withState)
            setCookie(function (old) {
                var newCookie = __assign({}, old);
                delete newCookie[key.trim()];
                if (onChange)
                    onChange(newCookie);
                return newCookie;
            });
        else if (onChange)
            onChange(getCookies());
    }, [onChange, withState, getCookies]);
    return (jsxRuntime.jsx(CookieContext.Provider, __assign({ value: {
            cookie: cookie,
            getItem: getItem,
            setItem: setItem,
            removeItem: removeItem
        } }, { children: children }), void 0));
};
var useCookieContext = function () {
    var context = react.useContext(CookieContext);
    if (context === undefined) {
        throw new Error('useCookieContext must be used within an CookieContext.Provider');
    }
    return context;
};

var useCookie = function (key) {
    var _a = useCookieContext(), _getItem = _a.getItem, _setItem = _a.setItem, _removeItem = _a.removeItem, cookie = _a.cookie;
    var getItem = react.useCallback(function (_key) {
        if (_key === void 0) { _key = undefined; }
        return _getItem(key || _key);
    }, [_getItem]);
    var setItem = react.useCallback(function (_params) {
        var params = __assign({}, _params);
        if (!!key && !params.key)
            params.key = key;
        _setItem(params);
    }, [_setItem]);
    var removeItem = react.useCallback(function (_key) {
        if (_key === void 0) { _key = undefined; }
        return _removeItem(key || _key);
    }, [_removeItem]);
    return { getItem: getItem, setItem: setItem, removeItem: removeItem, cookie: cookie };
};

exports.CookieProvider = CookieProvider;
exports.useCookie = useCookie;
