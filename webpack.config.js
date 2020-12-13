const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ProgressPlugin } = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = function(env, argv) {
    const isProduction = argv.mode === 'production';
    
    return {
        mode: argv.mode,
        entry: path.resolve(__dirname, 'src/index.tsx'),
        output: {
            chunkFilename: isProduction ? '[name].[chunkhash:4].chunk.js' : '[name].js',
            filename: isProduction ? '[name].[contenthash:4].js' : '[name].js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/'
        },
        target: 'web',
        devtool: !isProduction && 'source-map',
        module: {
            rules: [
                {
                    test: /\.(js|ts)x?$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                },
                {
                    exclude: [/\.(js|ts)x?$/, /\.html$/, /\.json$/],
                    loader: 'file-loader',
                    options: {
                        name: isProduction ? '[name].[contenthash:4].[ext]' : '[name].[ext]'
                    }
                }
            ]
        },
        optimization: {
            chunkIds: 'natural',
            minimize: isProduction,
            minimizer: [new TerserPlugin()],
            splitChunks: {
                chunks: 'all',
            },
            runtimeChunk: true
        },
        resolve: {
            alias: {
                '@root': path.resolve(__dirname, 'src'),
                'react': path.resolve(__dirname, 'node_modules/react'),
            },
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        },
        plugins: [
            new ProgressPlugin(),
            new ESLintPlugin({
                extensions: ['.js', '.jsx', '.ts', '.tsx']
            }),
            new CleanWebpackPlugin(),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: './public/assets',
                        to: 'assets'
                    },
                    {
                        from: './public/manifest.json',
                        to: 'manifest.json'
                    },
                    {
                        from: './public/robots.txt',
                        to: 'robots.txt'
                    }
                ]
            }),
            new HtmlWebpackPlugin({
                template: './public/index.html'
            })
        ],
        devServer: {
            compress: true,
            contentBase: path.join(__dirname, 'public'),
            historyApiFallback: true,
            host: 'localhost',
            hot: true,
            open: true,
            port: 3000,
            progress: true
        }
    };
}