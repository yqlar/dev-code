const cp = require('child_process')
const path = require('path')
const os = require('os')
const activity = require('../util/activity')


const host = 'http://localhost:3001'
let arr = Array.from(new Set(activity.split('\n')))
const url = host + arr[0]
function createdProcess(
    projectAbsolutPath,
    env = {
        NODE_ENV: 'testing',
    },
    command = 'node server/index.js',
) {
    const cwd = path.join(projectAbsolutPath)
    // const cwd = path.join(os.homedir(), 'Documents/klook/klook-nuxt-web')

    const exec = cp.exec(`clinic doctor --collect-only -- ${command}`, {
        cwd: cwd,
        env: {
            ...env,
            ...process.env,
        },
        stdio: 'inherit',
    })

    return exec
}


function childProcess(callback) {
    const path = '/Users/klook/Documents/klook/klook-nuxt-web'
    const command = 'node server/index.js'

    const exec = createdProcess(path, {
        NODE_ENV: 'testing',
    }, command)

    exec.stdout.on('data', async (data) => {
        if (data.includes('Server listening on')) {
            await callback()

            const rr = setTimeout(() => {
                exec.kill('SIGINT')
                clearTimeout(rr)
            }, 5000)
        }
    })

    exec.on('close', (code) => {
        console.log(`--- child process close: ${code}`)
    })

    exec.on('exit', (code) => {
        console.log(`--- child process exit: ${code}`)
    })
}

module.exports = childProcess
