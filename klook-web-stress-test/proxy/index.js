const httpProxy = require('http-proxy')
const redisClient = require('./redis-client')

function requestKey(request) {
    return request.method + request.headers['accept-language'] + request.url
}

function proxy(data = {
    proxyPort: 10086,
    target: 'https://wwwstage.klook.com',
    useCache: true
}) {
    const {proxyPort = 10086, target, useCache = true} = data
    const selfHandleResponse = useCache
    const devProxy = httpProxy.createServer({
        target,
        changeOrigin: true,
        selfHandleResponse,
    }).listen(proxyPort, function () {
        console.log('Waiting for requests...')
    })

    devProxy.on('proxyReq', async function (proxyReq, request, response) {
        if (!useCache) {
            return null
        }

        const key = requestKey(request)
        const cache = await redisClient.getKey(key)
        cache && response.end(cache)
    })

    devProxy.on('proxyRes', function (proxyRes, request, response) {
        if (!useCache) {
            return null
        }

        let body = []
        proxyRes.on('data', (chunk) => {
            body.push(chunk)
        })

        proxyRes.on('end', async function () {
            const key = requestKey(request)
            if (await redisClient.getKey(key)) {
                body = Buffer.concat(body).toString()
                await redisClient.setKey(key, body)
            }
        })
    })
}

module.exports = proxy
