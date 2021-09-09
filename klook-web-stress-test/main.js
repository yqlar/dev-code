const childProcess = require('./child-process')
const stressRequest = require('./autocannon')
const proxy = require('./proxy')
const config = require('./default-config')

const {proxyTargetHost, proxyPort, useCache, testList} = config

async function stressTest(i) {
    const testConfig = testList[i]
    if (testConfig) {
        const exec = await childProcess.startChildProcess()

        await stressRequest({
            url: testConfig.url,
            ...testConfig.autoCannon,
        })

        await childProcess.closeChildProcess(exec)
        await stressTest(i + 1)
    }
}

async function __main() {
    const devProxy = await proxy.initProxy({
        useCache,
        proxyPort,
        target: proxyTargetHost,
    })

    proxy.proxyWatcher(devProxy, useCache)

    let i = 0
    const tt = setTimeout(async () => {
        await stressTest(i)
        proxy.close(devProxy)
        clearTimeout(tt)
    }, 2000)

}

await __main()

// const os = require('os')
// const activity = require('../util/activity')
//
//
// const host = 'http://localhost:3001'
// let arr = Array.from(new Set(activity.split('\n')))
// const url = host + arr[0]
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


