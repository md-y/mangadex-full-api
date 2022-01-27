// This is needed since dts-bundle-generator needs import(...) syntax for
// external references, but jsdoc does not support it

exports.handlers = {
    jsdocCommentFound: function(e) {
        e.comment = e.comment.replace(/import\(\'.\.\/index\'\)\.([\w\d]+)/gmi, `$1`);
    }
}