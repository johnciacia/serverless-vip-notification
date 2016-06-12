var AWS = require('aws-sdk');
var https = require('https');
var url = require('url');

module.exports.notify = function(args) {

  if (false == args.url) {
    return false;
  }

  var opts = url.parse(args.url);
  opts.method = 'POST';
  opts.headers = {
    'Content-Type': 'application/json'
  };

  var message = {
    "channel": args.channel || "#random",
    "username": "WordPress.com VIP",
    "icon_url": "https://s.w.org/about/images/logos/wordpress-logo-32-blue.png",
    "attachments": [
      {
        "fallback": args.text,
        "pretext": args.text,
        "color": "#A00000",
        "fields": [
          {
            "title": "Revision Log",
            "value": "",
            "short": false
          }
        ]
      }
    ]
  };

  return new Promise((resolve, reject) => {
    var req = https.request(opts, (res) => {
      if (res.statusCode === 200) {
        resolve();
      } else {
        reject();
      }
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(JSON.stringify(message));
    req.end();
  });
}