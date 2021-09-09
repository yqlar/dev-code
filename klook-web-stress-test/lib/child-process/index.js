const cp = require('child_process')
const path = require('path')

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

async function startChildProcess() {
    const path = '/Users/klook/Documents/klook/klook-nuxt-web'
    const command = 'node server/index.js'

    const exec = createdProcess(path, {
        NODE_ENV: 'testing',
    }, command)

    exec.on('exit', (code) => {
        console.log(`--- child process exit: ${code}`)
    })

    return new Promise((resolve) => {
        exec.stdout.on('data', async (data) => {
            if (data.includes('Server listening on')) {
                resolve(exec)
            }
        })
    })
}

function closeChildProcess(exec) {
    const beforeCloseWait = 60000

    return new Promise((resolve) => {
        const tt = setTimeout(() => {
            exec.kill('SIGINT')
            clearTimeout(tt)
            resolve()
        }, beforeCloseWait)
    })
}

module.exports = {
    startChildProcess,
    closeChildProcess,
}
