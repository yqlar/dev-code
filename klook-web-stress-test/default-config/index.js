const config = {
    host: 'http://localhost:3000',
    proxyTargetHost: 'https://wwwstage.klook.com',
    proxyPort: 10086,
    useCache: true,
    stressTest: [
        {
            url: '',
            autoCannon: {
                title: 'ActivityPage',
                connections: 3,
                duration: 3,
                amount: 100,
            }
        }
    ]
}

module.exports = config
