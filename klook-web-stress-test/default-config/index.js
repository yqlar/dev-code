const config = {
    host: 'http://localhost:3000',
    proxyTargetHost: 'https://wwwstage.klook.com',
    stressTest: [
        {
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
