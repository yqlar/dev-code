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
        // 启动子进程
        const exec = await childProcess.startChildProcess(projectAbsolutPath, runNodeCommand, env)

        // 开始压测
        await stressRequest({
            url: testConfig.url,
            ...testConfig.autoCannon,
        })

        // 压测完毕后关闭子进程
        await childProcess.closeChildProcess(exec)

        // 执行下一个压测
        await stressTest(i + 1)
    } else {
        console.log('--- stressTest end ')
    }
}

async function __main() {
    // 启动代理
    const devProxy = await proxy.initProxy({
        useCache,
        proxyPort,
        target: proxyTargetHost,
    })

    // 代理监控请求，使用 redis 缓存每个请求
    proxy.proxyWatcher(devProxy, useCache)

    // 开始压测
    let i = 0
    await stressTest(i)

    // 关闭代理
    proxy.close(devProxy)
}

__main()
