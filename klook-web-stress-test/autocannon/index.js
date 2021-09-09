const autocannon = require('autocannon')

// url,
//     amount,
//     duration,
//     connections,
// const {url = '', connections = 3, duration = 600, amount = 100} = data

async function stressRequest(data) {
    await autocannon({
        ...data
    })
}

stressRequest({
    url:'http://0.0.0.0:3001/en-US/activity/39-hong-kong-disneyland-resort-hong-kong/',
    connections: 3,
    amount: 5,
    warmup: '[ -c 1 -d 3 ]',
})

module.exports = stressRequest
