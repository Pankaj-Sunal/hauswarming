"use strict";

const config = require("../config/config"),
  AWS = require("aws-sdk"),
  uuid = require("uuid"),
  mailer = require("nodemailer"),
  s3bucket = new AWS.S3({
    accessKeyId: global.gConfig.i_am_userkey,
    secretAccessKey: global.gConfig.i_am_Secret,
    Bucket: global.gConfig.bucket_name,
    region: global.gConfig.region
  });

function imageUpload(base64Data) {
  return new Promise((resolve, reject) => {
    var params = {
      Bucket: global.gConfig.bucket_name,
      Key: uuid.v4(),
      Body: base64Data
    };
    s3bucket.upload(params, function(err, data) {
      if (err) {
        reject(false);
      }
      var innerParams = {
        Bucket: global.gConfig.bucket_name,
        Key: data.key,
        Expires: 60 * 60 * 60
      };

      s3bucket.getSignedUrl("getObject", innerParams, function(err, _url) {
        if (!err) {
          resolve({
            url: _url,
            file_alias: data.key,
            file_url: _url.substring(0, _url.indexOf("?"))
          });
        } else {
          reject(false);
        }
      });
    });
  });
}

function sendMail(email, subject, html, callback) {
  const mailBody = {
    from: "<do_not_reply@gmail.com>",
    to: email,
    subject: subject,
    html: html
  };

  mailer
    .createTransport({
      service: "GMAIL",
      auth: {
        user: `${global.gConfig.nodemailer.user}`,
        pass: `${global.gConfig.nodemailer.password}`
      },
      port: 587,
      host: "smtp.gmail.com"
    })
    .sendMail(mailBody, callback);
}

module.exports = {
  imageUpload: imageUpload,
  sendMail: sendMail
};
