const cp = require('child_process')
const path = require('path')
const os = require('os')

const stressRequest = require('./autocannon')
const language = require('./util/language')
const route = require('./util/route')
const activity = require('./util/activity')


const host = 'http://localhost:3001'
// const host = 'https://wwwstage.klook.com'

const cwd = path.join(os.homedir(), 'Documents/klook/klook-nuxt-web')
const exec = cp.exec('clinic doctor --collect-only -- node server/index.js', {
    cwd: cwd,
    env: {
        NODE_ENV: 'testing',
        ...process.env
    },
    stdio: 'inherit'
})

exec.stdout.on('data', async (data) => {
    console.log(`stdout: ${data}`)
    if (data.includes('Server listening on')) {
        let arr = Array.from(new Set(activity.split('\n')))
        const url = host + arr[0]

        await autoPin(url, 5, 0.2)

        const rr = setTimeout(() => {
            exec.kill('SIGINT')
            clearTimeout(rr)
        }, 5000)
    }
})

exec.on('close', (code) => {
    console.log(`CLOSE: ${code}`)
})

exec.on('exit', (code) => {
    console.log(`EXIT: ${code}`)
})



async function autoPin(data) {
const {url = '', connections = 3, durationMinute = 2, amount = 100} = data
    await autocannon({
        connections,
        amount,
        url,
        progress: true,
        duration: durationMinute * 60,
    })
}


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


