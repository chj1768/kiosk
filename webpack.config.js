module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    devServer: {
        inline: true,
        host: '0.0.0.0',
        port: 3000,
        contentBase: __dirname
    },
    module: {
        rules: [
        {
          test: /\.js?$/,
          loader: 'babel-loader',
          exclude: ['/node_modules'],
        }
        ,{
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
        }]
    }
};



