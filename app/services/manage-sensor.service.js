const { formatDateTime } = require('../utils/time')
const { twilioSendSMS } = require('./twilio.service')

let timeoutId; // Store the timeout ID
const MINUTES = process.env.MISSING_SIGNAL_MINUTES || 30
const TIMEOUT = MINUTES * 60 * 1000; // 30 minutes in milliseconds
const LIMIT_EXCEEDED = process.env.LIMIT_EXCEEDED || 70

function onMissingSignal() {
    if(timeoutId) {
        console.log(`Manage: onMissingSignal clear - ${timeoutId}`)
        clearTimeout(timeoutId); // Clear the previous timeout
    }
    timeoutId = setTimeout(() => {
        twilioSendSMS(`The Noise sensor not sending the data for last ${MINUTES} min.`)
        onMissingSignal()
    }, TIMEOUT);
    console.log(`Manage: onMissingSignal set - ${timeoutId}`)
}

function detectSignal(leq5min) {
    if(Number(leq5min) >= LIMIT_EXCEEDED) {
        const exceedingTime = formatDateTime(new Date())  
        twilioSendSMS(`The Noise sensor has exceeded the limit of ${LIMIT_EXCEEDED}, reaching ${leq5min} at ${exceedingTime}.`)
    }
    onMissingSignal()
}


module.exports = {
    onMissingSignal,
    detectSignal
};