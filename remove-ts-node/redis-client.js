let redis = require('redis'),
    client = redis.createClient()

client.on('error', function (err) {
    console.log('Error ' + err)
})

async function setKey(key, value) {
    return await new Promise((resolve, reject) => {
        client.set(key, value, (err, replay) => {
            if (err) {
                reject(err)
            } else {
                resolve(replay)
            }
        })
    })
}

async function getKey(key) {
    return await new Promise((resolve, reject) => {
        client.get(key, (err, replay) => {
            if (err) {
                reject(err)
            } else {
                resolve(replay)
            }
        })
    })
}
//
// (async function () {
//     await setKey('test', JSON.stringify({a: 1}))
//     const a = await getKey('test')
//     console.log('-- a: ', a)
// }())

module.exports = {
    setKey, getKey,
}
