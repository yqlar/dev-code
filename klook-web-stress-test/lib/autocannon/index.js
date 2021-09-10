const autocannon = require('autocannon')

async function stressRequest(data) {
    console.log('--- autocannon start: ', data)
    await autocannon({
        ...data,
        // warmup: '[ -c 1 -d 3 ]',
    })
    console.log('--- autocannon end', )
}

// stressRequest({
//     url:'http://0.0.0.0:3001/en-US/activity/39-hong-kong-disneyland-resort-hong-kong/',
//     connections: 3,
//     amount: 100,
//     warmup: '[ -c 1 -d 3 ]'
// })

module.exports = stressRequest
