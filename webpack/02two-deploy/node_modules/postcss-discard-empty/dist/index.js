'use strict';

exports.__esModule = true;

var _postcss = require('postcss');

function discardEmpty(node) {
    var type = node.type;
    var sub = node.nodes;

    if (sub) {
        node.each(discardEmpty);
    }

    if (type === 'decl' && !node.value || type === 'rule' && !node.selector || sub && !sub.length || type === 'atrule' && (!sub && !node.params || !node.params && !sub.length)) {
        node.remove();
    }
}

exports.default = (0, _postcss.plugin)('postcss-discard-empty', function () {
    return function (css) {
        return css.each(discardEmpty);
    };
});
module.exports = exports['default'];