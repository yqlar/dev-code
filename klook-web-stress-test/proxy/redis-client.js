const redis = require('redis')
const client = redis.createClient()

client.on('error', function (err) {
    console.log('--- Redis Client Error: ' + err)
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

module.exports = {
    setKey, getKey,
}
