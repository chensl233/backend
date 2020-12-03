const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const pp = '/admin/';

module.exports = {
    port: 9012,
    root: 'dist',
    stat: false,
    webpack: {
        console: true,
        publicPath: pp,
        output: {
            './index.html': {
                entry: './src/app'
            }
        },
        alias: {
            model: './src/js/model/',
            js: './src/js/',
            components: './src/components/'
        },
        global: {
            Utils: [path.resolve(__dirname, 'src/js/common/utils'), 'default'],
            Manba: 'manba',
            HeyUI: 'heyui',
            Model: 'js-model',
            G: 'hey-global',
            log: 'hey-log',
            R: [path.resolve(__dirname, 'src/js/common/request'), 'default']
        },
        devServer: {
            proxy: {
                // 此处应该配置为开发服务器的后台地址
                '/backend': {
                    target: 'http://work3.com'
                }
            },
            historyApiFallback: true
        },
        globalVars: './src/css/var.less',
        externals: {},
        plugins: [
            new CopyPlugin([
                { from: './aliyun-upload-sdk-1.4.0/', to: './dist/aliyun-upload-sdk-1.4.0/' },
            ])
        ],
        performance: {
            maxEntrypointSize: 10240000,
            maxAssetSize: 10240000
        }
    },
    copy: ['static/images/*', 'call/*']
};