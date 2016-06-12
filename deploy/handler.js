'use strict';
var AWS = require('aws-sdk');
var qs = require('querystring');
var slack = require('./slack');

AWS.config.update({
  region:'us-east-1'
});

module.exports.handler = (event, context) => {
  const body = qs.parse(event['body-json']);
  const text = [
    body.theme + ' theme deployed',
    'by ' + body.deployer,
    'from r' + body.previous_revision,
    'to r' + body.deployed_revision
  ].join(' ');

  let sns = new AWS.SNS();
  let p1 = sns.publish({
    Message: text, 
    Subject: "Deploy Notification",
    TopicArn: process.env.SNS_TOPIC_ARN
  }).promise();

  let p2 = slack.notify({
    'url': process.env.SLACK_URL,
    'text': text
  });

  Promise.all([p1, p2]).then((values) => {
    context.done(null, {
      success: true
    });
  });
};
