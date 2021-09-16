const httpProxy = require('http-proxy')
const redisClient = require('../../util/redis-client')
const zlib = require('zlib')

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
        proxyTimeout: 6000,
    }).listen(proxyPort, function () {
        console.log('--- Waiting for requests...')
    })
    return proxy
}

let i = 0

function proxyWatcher(proxy, useCache = true) {

    proxy.on('error', function (err, req, res) {
        res.writeHead(500, {
            'Content-Type': 'text/plain',
        })

        console.log('------------- error', )
        res.end('Something went wrong. And we are reporting a custom error message.')
    })

    // request 发送
    proxy.on('proxyReq', async function (proxyReq, request, response) {
        if (useCache) {
            const key = requestKey(request)
            if (key.includes('/v1/experiencesrv/activity/component_service/detail')) {
                i += 1
                console.log('-- i: ', i)
            }
            const cache = await redisClient.getKey(key)

            if (cache) {
                response.end(cache)
            }
        }
    })

    // response 返回
    proxy.on('proxyRes', function (proxyRes, request, response) {
        console.log('-- response: ', request.status)

        if (useCache) {
            let body = []

            proxyRes.on('data', (chunk) => {
                body.push(chunk)
            })

            proxyRes.on('end', async function () {
                body = Buffer.concat(body)

                const key = requestKey(request)
                const cache = await redisClient.getKey(key)
                if (!cache) {
                    const headers = request.headers || {}
                    const acceptEncoding = headers['accept-encoding'] || ''
                    if (acceptEncoding.includes('gzip')) {
                        try {
                            const deGzip = await zlib.gunzipSync(body)
                            body = deGzip.toString()
                        } catch (e) {
                            console.log('-- catch error: ', e)
                        }
                    } else {
                        body = body.toString()
                    }
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
    console.log('--- proxy close')
}

proxyWatcher(initProxy({
    proxyPort: 10086,
    target: 'https://t17.test.klook.io',
    useCache: false,
}), false)

module.exports = {
    initProxy,
    proxyWatcher,
    close,
}
