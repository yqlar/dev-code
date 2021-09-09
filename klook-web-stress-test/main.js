const childProcess = require('./child-process')
const stressRequest = require('./autocannon')
const proxy = require('./proxy')
const config = require('./default-config')

const {proxyTargetHost, proxyPort, useCache} = config

proxy({
    useCache,
    proxyPort,
    target: proxyTargetHost
})


childProcess(async () => {
    await stressRequest()
})

console.log('-- childProcess: ', childProcess)

// const links = language.reduce((acc, la) => {
//     const a = route.map(item => {
//         return la ? '/' + la + item : item
//     })
//     return [...acc, ...a]
// }, [])
//
//
// arr = [...links, ...arr ].map((item) => {
//     return host + item
// })

// let i = 0

// i += 1
// if (i < 400) {
//     const random = Math.floor(Math.random()*2179+1)
//     await autoPin(url)
// }

// autoPin(0)


