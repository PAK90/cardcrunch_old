var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  proxy: {
    '/py/comparecards': {
      target: 'https://www.google.ie',
      secure: false,
      bypass: function(req, res, proxyOptions) {
        var spawn = require('child_process').spawnSync;
        var process = spawn('cmd.exe', ['/c', 'py\\comparecards.bat']);
        return '/py/results.txt';
      }
    }
  }
}).listen(3000, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:3000');
});
