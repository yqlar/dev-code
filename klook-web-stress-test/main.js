const childProcess = require('./lib/child-process')
const stressRequest = require('./lib/autocannon')
const proxy = require('./lib/proxy')
const config = require('./default-config')

const {
    proxyTargetHost,
    proxyPort,
    useCache,
    testList,
    projectAbsolutPath,
    runNodeCommand,
    env,
} = config

async function stressTest(i) {
    const testConfig = testList[i]
    if (testConfig) {
        const exec = await childProcess.startChildProcess(projectAbsolutPath, runNodeCommand, env)

        await stressRequest({
            url: testConfig.url,
            ...testConfig.autoCannon,
        })

        await childProcess.closeChildProcess(exec)
        await stressTest(i + 1)
    } else {
        console.log('--- stressTest end ')
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
    await stressTest(i)

    proxy.close(devProxy)
}

__main()
