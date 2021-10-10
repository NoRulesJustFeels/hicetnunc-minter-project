// Based on: https://github.com/ipfs-examples/js-ipfs-examples/blob/master/examples/http-client-bundle-webpack/webpack.config.js

const path = require('path')
const dotenv = require('dotenv')
const webpack = require('webpack')
const { merge } = require('webpack-merge')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')

const mediaInfoWasmFile = path.resolve(
    __dirname,
    'node_modules',
    'mediainfo.js',
    'dist',
    'MediaInfoModule.wasm'
)

const imageMagickWasmFile = path.resolve(
    __dirname,
    'node_modules',
    'wasm-imagemagick',
    'dist',
    'magick.wasm'
)

const imageMagickJsFile = path.resolve(
    __dirname,
    'node_modules',
    'wasm-imagemagick',
    'dist',
    'magick.js'
)

let env = {}
for (let key of Object.keys(dotenv.config().parsed)) {
    env[`process.env.${key}`] = JSON.stringify(dotenv.config().parsed[key])
}

let htmlPageNames = ['index'];
let multipleHtmlPlugins = htmlPageNames.map(name => {
    return new HtmlWebpackPlugin({
        template: `./src/${name}.html`, // relative path to the HTML files
        filename: `${name}.html`, // output HTML files
        chunks: [`${name}`] // respective JS files
    })
});

const paths = {
    // Source files
    src: path.resolve(__dirname, './src'),

    // Production build files
    build: path.resolve(__dirname, './dist'),

    // Static files that get copied to build folder
    public: path.resolve(__dirname, './public')
}

const prod = {
    mode: 'production',
    devtool: false,
    output: {
        path: paths.build,
        publicPath: '/',
        filename: '[name].[contenthash].bundle.js'
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    // fix: https://github.com/webpack/webpack-dev-server/issues/2758
    target: 'browserslist'
}

const dev = {
    // Set the mode to development or production
    mode: 'development',

    // Control how source maps are generated
    devtool: 'inline-source-map',

    // Where webpack outputs the assets and bundles
    output: {
        path: paths.build,
        filename: '[name].bundle.js',
        publicPath: '/'
    },

    // Spin up a server for quick development
    devServer: {
        historyApiFallback: true,
        static: paths.build,
        open: true,
        compress: true,
        hot: true,
        port: 3000
    },

    plugins: [
        // Only update what has changed on hot reload
        new webpack.HotModuleReplacementPlugin()
    ]
}

const common = {
    // Where webpack looks to start building the bundle
    //entry: [paths.src + '/index.js'],
    entry: {
        index: paths.src + '/index.js',
    },

    // Customize the webpack build process
    plugins: [
        // Copies files from target to destination folder
        new CopyWebpackPlugin({
            patterns: [{
                    from: `${paths.public}/assets`,
                    to: 'assets',
                    globOptions: {
                        ignore: ['*.DS_Store']
                    },
                    noErrorOnMissing: true
                },
                { from: mediaInfoWasmFile, to: '.' },
                { from: imageMagickWasmFile, to: '.' },
                { from: imageMagickJsFile, to: '.' },
            ]
        }),

        new webpack.DefinePlugin(env),

        // fixes Module not found: Error: Can't resolve 'stream' in '.../node_modules/nofilter/lib'
        new NodePolyfillPlugin(),
        // Note: stream-browserify has assumption about `Buffer` global in its
        // dependencies causing runtime errors. This is a workaround to provide
        // global `Buffer` until https://github.com/isaacs/core-util-is/issues/29
        // is fixed.
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser.js'
        }),

        // Generates an HTML file from a template
        // Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501
        new HtmlWebpackPlugin({
            title: 'The Hic Et Nunc Minter Project',
            favicon: paths.public + '/favicon.ico',
            template: paths.public + '/index.html', // template file
            chunks: ['index'],
            filename: 'index.html', // output file,
            minify: false
        }),

        // https://github.com/mattlewis92/webpack-filter-warnings-plugin
        // Workaround for a known issue
        new FilterWarningsPlugin({
            exclude: /stream\/web/
        })
    ],

    // Determine how modules within the project are treated
    module: {
        rules: [
            // JavaScript: Use Babel to transpile JavaScript files
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    targets: {
                                        esmodules: true
                                    }
                                }
                            ],
                            '@babel/preset-react'
                        ]
                    }
                }
            },

            // Images: Copy image files to build folder
            { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, use: { loader: 'url-loader' } },

            // Fonts and SVGs: Inline files
            { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, use: { loader: 'url-loader' } },

            { test: /\.(scss|css)$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
        ]
    },

    resolve: {
        modules: [paths.src, 'node_modules'],
        extensions: ['.js', '.jsx', '.json', '.scss'],
        alias: {
            '@': paths.src,
            'fs': false,
            'crypto': require.resolve('crypto-browserify'),
            'stream': require.resolve('stream-browserify'),
            'path': require.resolve('path-browserify'),
            'http': require.resolve('stream-http'),
            'https': require.resolve('https-browserify'),
            'os': require.resolve('os-browserify/browser'),
            'url': require.resolve('url')
        }
    },

    // fix: https://github.com/webpack/webpack-dev-server/issues/2758
    target: 'web',

}

module.exports = (cmd) => {
    const production = cmd.production
    const config = production ? prod : dev

    return merge(common, config)
}