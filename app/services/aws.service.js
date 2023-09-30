const AWS = require('aws-sdk');

const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID || 'AKIA5UFH6NJG75BED7EL'
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY || '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'
const REGION = process.env.REGION || 'ap-southeast-1'

const NOISE_SENSOR_TOPIC = process.env.NOISE_SENSOR_TOPIC || 'arn:aws:sns:ap-southeast-1:936655088205:noise-sensor'

const SENDER_EMAIL = process.env.SENDER_EMAIL || 'dianarose@cambrian.com.sg'
const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL || 'mohanraj@cambrian.com.sg'

AWS.config.update({
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
    region: REGION,
  });
const sns = new AWS.SNS();
const ses = new AWS.SES({ apiVersion: '2010-12-01' });
console.log("AWS: init")

function snsPublishNoiseSensor(message) {
    sns.publish({
        Message: message,
        TopicArn: NOISE_SENSOR_TOPIC
  }, (err, data) => {
    if (err) {
      console.error('Error sending SMS:', err);
    } else {
      console.log('SMS sent successfully:', data);
    }
  });
}
function sesSendEmailNoiseSensor(message) {
  try {
    const emails = RECEIVER_EMAIL.split(';')
    sesSendEmail('Danli-noiserts-alert', message, emails)
  } catch (error) {
    console.log("sesSendEmailNoiseSensor error:", error)
  }
}
function sesSendEmail(subject, message, emails) {
  const params = {
    Destination: {
      ToAddresses: emails // Replace with recipient email address
    },
    Message: {
      Body: {
        Text: {
          Data: message
        }
      },
      Subject: {
        Data: subject
      }
    },
    Source: `Danli-noiserts-alert <${SENDER_EMAIL}>`
  };
  
  ses.sendEmail(params, (err, data) => {
    if (err) {
      console.error('Error sending email:', err);
    } else {
      console.log('Email sent:', data.MessageId);
    }
  });
}

module.exports = {
    snsPublishNoiseSensor,
    sesSendEmailNoiseSensor,
}
  
  