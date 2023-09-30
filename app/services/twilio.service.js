const accountSid =  process.env.TWILIO_ACCOUNT_SID || 'AC24c05d313cd01fd1de7b2d2bf9251d76';
const authToken = process.env.TWILIO_ACCOUNT_SID ||'dae317a858018e918ec16000d8fc69e7';
const phoneNumberSender = process.env.TWILIO_PHONE_NUMBER_SENDER || '+18149147459'
const serviceIdSender = process.env.TWILIO_SERVICE_ID_SENDER  || 'MG11bb7989ba2bba71c8035d35f3022d43'
const phoneNumberReceiver = process.env.TWILIO_PHONE_NUMBER_RECEIVER || '+6596181170'

const client = require('twilio')(accountSid, authToken);

function twilioSendSMS(message) {
    client.messages
    .create({
        body: message,
        messagingServiceSid: serviceIdSender,
        to: phoneNumberReceiver
    })
    .then(message => console.log(message.sid)).catch((err) => {
        console.log(err)
    })
}

module.exports = {
    twilioSendSMS
}
      