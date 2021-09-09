const autocannon = require('autocannon')

async function stressRequest(data) {
    const {url = '', connections = 3, durationMinute = 2, amount = 100} = data
    await autocannon({
        connections,
        amount,
        url,
        progress: true,
        duration: durationMinute * 60,
    })
}

module.exports = stressRequest
