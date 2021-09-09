const httpProxy = require('http-proxy')
const redisClient = require('../../util/redis-client')

function requestKey(request) {
    return request.method + request.headers['accept-language'] + request.url
}

function initProxy(data = {
    proxyPort: 10086,
    target: 'https://wwwstage.klook.com',
    useCache: true,
}) {
    const {proxyPort = 10086, target = 'https://wwwstage.klook.com', useCache = true} = data
    console.log('-- initProxy: ', data)
    const selfHandleResponse = useCache
    const proxy = httpProxy.createServer({
        target,
        changeOrigin: true,
        selfHandleResponse,
        timeout: 6000,
        proxyTimeout: 6000
    }).listen(proxyPort, function () {
        console.log('--- Waiting for requests...')
    })
    return proxy
}

function proxyWatcher(proxy, useCache) {
    // request 发送
    proxy.on('proxyReq', async function (proxyReq, request, response) {
        if (useCache) {
            const key = requestKey(request)
            const cache = await redisClient.getKey(key)

            if (cache) {
                response.end(cache)
            }
        }
    })

    // response 返回
    proxy.on('proxyRes', function (proxyRes, request, response) {
        if (useCache) {
            let body = []

            proxyRes.on('data', (chunk) => {
                body.push(chunk)
            })

            proxyRes.on('end', async function () {

                const key = requestKey(request)
                const cache = await redisClient.getKey(key)
                if (!cache) {
                    body = Buffer.concat(body).toString()
                    response.end(body)
                    await redisClient.setKey(key, body)
                }
            })
        }
    })
}

function close(proxy) {
    redisClient.close()
    proxy.close()
}

module.exports = {
    initProxy,
    proxyWatcher,
    close,
}
