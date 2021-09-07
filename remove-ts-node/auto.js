const cp = require('child_process')
const path = require('path')
const os = require('os')
const autocannon = require('autocannon')
const language = require('./language')
const route = require('./route')
const activity = require('./activity')


const host = 'http://localhost:3001'
// const host = 'https://wwwstage.klook.com'

const cwd = path.join(os.homedir(), 'Documents/klook/klook-nuxt-web')
const exec = cp.exec('clinic doctor -- node server/index.js', {
    cwd: cwd,
    env: {
        NODE_ENV: 'testing',
        ...process.env
    },
    stdio: 'inherit',
    // shell: '/bin/zsh'
})

exec.stdout.on('data', async (data) => {
    console.log(`stdout: ${data}`)
    if (data.includes('Server listening on')) {
        let arr = Array.from(new Set(activity.split('\n')))
        const url = host + arr[0]

        console.log('-- start' )
        await autoPin(url, 5, 0.2)

        console.log('-- end')
        // exec.kill()
    }
})

exec.on('close', (code) => {
    console.log(`CLOSE: ${code}`)
})

exec.on('exit', (code) => {
    console.log(`EXIT: ${code}`)
})

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
//

async function autoPin(url = '', connections = 3, durationMinute = 2) {
    const result = await autocannon({
        url,
        connections, // default
        duration: durationMinute * 60, // default
    })
    console.log('-- result: ', result)
}

// let i = 0

// i += 1
// if (i < 400) {
//     const random = Math.floor(Math.random()*2179+1)
//     await autoPin(url)
// }

// autoPin(0)


