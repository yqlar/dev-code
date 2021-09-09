const redis = require('redis')
const client = redis.createClient()

client.on('ready', function () {
    console.log('--- Redis ready')
})

client.on('error', function (err) {
    console.log('--- Redis Client ' + err)
    console.log('--- Please check if your redis is running.')
    process.kill(process.pid, 'SIGHUP')
})

async function setKey(key, value) {
    return await new Promise((resolve, reject) => {
        client.set(key, value, (err, replay) => {
            console.log('--- Redis set key: ', key)
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
        console.log('--- Redis get key: ', key)
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
