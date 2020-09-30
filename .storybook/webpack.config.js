const webpack = require('webpack')

const options = {
    target: 'electron-renderer', // https://github.com/webpack/webpack/pull/1467

    externals: {
        'fs': 'top.require(\'fs\')',
        'os': 'top.require(\'os\')',
        'stream': 'top.require(\'stream\')',
        'assert': 'top.require(\'assert\')',
        'constants': 'top.require(\'constants\')',
        'process': 'top.require(\'process\')',
        'crypto': 'top.require(\'crypto\')',
        'path': 'top.require(\'path\')',
        'events': 'top.require(\'events\')',
        'electron': 'top.require(\'electron\')',
        'util': 'top.require(\'util\')',
        'querystring': 'top.require(\'querystring\')',

        'worker_threads': {}, // shut up annoying warning triggered by node_modules/write-file-atomic/index.js
    },

    resolve: { // http://webpack.github.io/docs/configuration.html#resolve
        alias: {
        },
        extensions: ['.mjs', ".ts", ".tsx", ".js"]
    },
    plugins: [

        new webpack.DefinePlugin({
            // Workaround for has-symbol failing to find global in iframe.
            global: '(typeof(global) == "undefined" ? top.global : global)',
            process: '(typeof(process) == "undefined" ? top.process : process)',
            'window.require': 'top.window.require',
        }),
    ]
}

module.exports = async ({ config, mode }) => {
    // console.log(config)
    const c = {
        ...config,
        plugins: [...config.plugins, ...options.plugins],
        externals: options.externals,
        resolve: options.resolve,
        module: { ...config.module, ...options.module }
    }
    return c
}
