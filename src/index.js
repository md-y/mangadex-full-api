'use strict';

const Util = require('./util.js');

exports = module.exports = {
    testConnection: async () => {
        try {
            let res = await Util.apiRequest('/ping');
            return res === "pong";
        } catch (err) {
            return false;
        }
    }
};