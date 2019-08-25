var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

// Phaser webpack config
var phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
var pixi = path.join(phaserModule, 'build/custom/pixi.js');
var p2 = path.join(phaserModule, 'build/custom/p2.js');

var definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
});

var defineVars = new webpack.DefinePlugin({
    'GAME_ENV': JSON.stringify('development-mobile'),
    'FB_AD_STAGING_PLACEMENT_ID': JSON.stringify('259121287971074_259130071303529'),
    'FB_AD_STAGING_PLACEMENT_INTENTIONS_ID': JSON.stringify('259121287971074_259129384636931'),
    'IAP_ANDROID_REMOVE_ADS': JSON.stringify('android.iap.remove.ads1'),
    'IAP_ANDROID_SKULLS_SMALL': JSON.stringify('android.iap.skulls.small'),
    'IAP_ANDROID_SKULLS_MEDIUM': JSON.stringify('android.iap.skulls.medium'),
    'IAP_ANDROID_SKULLS_HUGE': JSON.stringify('android.iap.skulls.huge'),

    'IAP_IOS_REMOVE_ADS': JSON.stringify('ios.iap.remove.ads1'),
    'IAP_IOS_SKULLS_SMALL': JSON.stringify('ios.iap.skulls.small'),
    'IAP_IOS_SKULLS_MEDIUM': JSON.stringify('ios.iap.skulls.medium'),
    'IAP_IOS_SKULLS_HUGE': JSON.stringify('ios.iap.skulls.huge')
});

// this will replace all facebook pages with mobile versions - to make bundles only use what is needed for each build
var setMobileFiles = new webpack.NormalModuleReplacementPlugin(/(.*)\.facebook(\.*)/, function(resource) {
    resource.request = resource.request.replace(/\.facebook/, `.mobile`);
});

module.exports = {
    entry: {
        app: [
            'babel-polyfill',
            path.resolve(__dirname, 'src/main.js')
        ],
        vendor: ['pixi', 'p2', 'phaser', 'webfontloader']
    },
    devtool: 'cheap-source-map',
    output: {
        pathinfo: true,
        path: path.resolve(__dirname, 'dist'),
        publicPath: './dist/',
        filename: 'bundle.js'
    },
    watch: true,
    plugins: [
        definePlugin,
        defineVars,
        setMobileFiles,
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor'/* chunkName= */, filename: 'vendor.bundle.js'/* filename= */}),
        new HtmlWebpackPlugin({
            filename: '../index.html',
            template: './src/index.html',
            chunks: ['vendor', 'app'],
            chunksSortMode: 'manual',
            minify: {
                removeAttributeQuotes: false,
                collapseWhitespace: false,
                html5: false,
                minifyCSS: false,
                minifyJS: false,
                minifyURLs: false,
                removeComments: false,
                removeEmptyAttributes: false
            },
            hash: false
        }),
        new BrowserSyncPlugin({
            host: process.env.IP || 'localhost',
            port: process.env.PORT || 3000,
            server: {
                baseDir: ['./', './build']
            }
        })
    ],
    module: {
        rules: [
            { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') },
            { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
            { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
            { test: /p2\.js/, use: ['expose-loader?p2'] }
        ]
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    resolve: {
        alias: {
            'phaser': phaser,
            'pixi': pixi,
            'p2': p2
        }
    }
};
