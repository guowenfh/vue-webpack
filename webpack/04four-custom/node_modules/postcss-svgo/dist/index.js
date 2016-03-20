'use strict';

exports.__esModule = true;

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _postcssValueParser = require('postcss-value-parser');

var _postcssValueParser2 = _interopRequireDefault(_postcssValueParser);

var _svgo = require('svgo');

var _svgo2 = _interopRequireDefault(_svgo);

var _isSvg = require('is-svg');

var _isSvg2 = _interopRequireDefault(_isSvg);

var _url = require('./lib/url');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dataURI = /data:image\/svg\+xml(;(charset=)?utf-8)?,/;

function minifyPromise(svgo, decl, opts) {
    var promises = [];

    decl.value = (0, _postcssValueParser2.default)(decl.value).walk(function (node) {
        if (node.type !== 'function' || node.value !== 'url' || !node.nodes.length) {
            return;
        }
        var value = node.nodes[0].value;

        var decodedUri = (0, _url.decode)(value);
        var isUriEncoded = decodedUri !== value;
        if (isUriEncoded) {
            value = decodedUri;
        }
        if (opts.encode !== undefined) {
            isUriEncoded = opts.encode;
        }

        if (!dataURI.test(value) || !(0, _isSvg2.default)(value)) {
            return;
        }
        promises.push(new Promise(function (resolve, reject) {
            svgo.optimize(value.replace(dataURI, ''), function (result) {
                if (result.error) {
                    return reject('Error parsing SVG: ' + result.error);
                }
                node.before = node.after = '';
                var data = isUriEncoded ? (0, _url.encode)(result.data) : result.data;
                node.nodes[0].value = 'data:image/svg+xml;charset=utf-8,' + data;
                node.nodes[0].quote = isUriEncoded ? '"' : '\'';
                node.nodes[0].type = 'string';
                resolve();
            });
        }));

        return false;
    });

    return Promise.all(promises).then(function () {
        return decl.value = decl.value.toString();
    });
}

exports.default = _postcss2.default.plugin('postcss-svgo', function () {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var svgo = new _svgo2.default(opts);
    return function (css) {
        return new Promise(function (resolve, reject) {
            var promises = [];
            css.walkDecls(function (decl) {
                if (dataURI.test(decl.value)) {
                    promises.push(minifyPromise(svgo, decl, opts));
                }
            });
            Promise.all(promises).then(resolve, reject);
        });
    };
});
module.exports = exports['default'];