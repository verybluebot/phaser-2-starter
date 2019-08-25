var path = require('path');
var webpack = require('webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

// Phaser webpack config
var phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
var pixi = path.join(phaserModule, 'build/custom/pixi.js');
var p2 = path.join(phaserModule, 'build/custom/p2.js');

var defineVars = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false')),
    'GAME_ENV': JSON.stringify('production'),
    'AD_ANDROID_PROD_REWARD_ID': JSON.stringify('ca-app-pub-7431364171147168/6077121012'),
    'AD_ANDROID_PROD_INTERSTITIAL_ID': JSON.stringify('ca-app-pub-7431364171147168/2345759568'),
    'AD_IOS_PROD_REWARD_ID': JSON.stringify('ca-app-pub-7431364171147168/2511203108'),
    'AD_IOS_PROD_INTERSTITIAL_ID': JSON.stringify('ca-app-pub-7431364171147168/6617969070'),

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
    output: {
        path: path.resolve(__dirname, 'www/dist'),
        publicPath: './dist/',
        filename: 'bundle.js'
    },
    plugins: [
        defineVars,
        setMobileFiles,
        new CleanWebpackPlugin(['www']),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.optimize.UglifyJsPlugin({
            drop_console: true,
            minimize: true,
            output: {
                comments: false
            },
            comments: false,
            compress: {
                // remove warnings
                warnings: false,

                // Drop console statements
                drop_console: true
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor'/* chunkName= */, filename: 'vendor.bundle.js'/* filename= */}),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'assets/**/*'),
                to: path.resolve(__dirname, 'www')
            }
        ]),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'src/manifest.json'),
                to: path.resolve(__dirname, 'www/manifest.json')
            }
        ]),
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, 'www/index.html'),
            template: './src/index.html',
            chunks: [
                'vendor', 'app'
            ],
            chunksSortMode: 'manual',
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
                html5: true,
                minifyCSS: true,
                minifyJS: true,
                minifyURLs: true,
                removeComments: true,
                removeEmptyAttributes: true
            },
            hash: true
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
