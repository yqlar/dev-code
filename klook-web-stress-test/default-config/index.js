const config = {
    host: 'http://localhost:3000',
    proxyTargetHost: 'https://wwwstage.klook.com',
    proxyPort: 10086,
    useCache: true,
    testList: [
        {
            url: 'http://0.0.0.0:3001/en-US/activity/39-hong-kong-disneyland-resort-hong-kong/',
            autoCannon: {
                title: 'ActivityPage',
                connections: 3,
                // duration: 10,
                amount: 100,
            },
        },
        {
            url: 'http://0.0.0.0:3001/en-US/activity/43-hong-kong-disneyland-resort-hong-kong/',
            autoCannon: {
                title: 'ActivityPage',
                connections: 3,
                // duration: 10,
                amount: 200,
            },
        },
        {
            url: 'http://0.0.0.0:3001/en-US/activity/523-hong-kong-disneyland-resort-hong-kong/',
            autoCannon: {
                title: 'ActivityPage',
                connections: 5,
                // duration: 10,
                amount: 300,
            },
        },
    ],
}

module.exports = config
