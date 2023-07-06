const moment = require("moment");

function formatMessage(userName, message) {
    return {
        userName,
        message,
        time: moment().format("h:mm a")
    }
}

module.exports = formatMessage;