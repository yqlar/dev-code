const autocannon = require('autocannon')

async function stressRequest(data) {
    const {url = '', connections = 3, duration = 600, amount = 100} = data
    await autocannon({
        url,
        amount,
        duration,
        connections,
        progress: true,
    })
}

module.exports = stressRequest
