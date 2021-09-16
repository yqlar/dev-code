const cp = require('child_process')
const path = require('path')

function createdProcess(
    projectAbsolutPath,
    command = 'node server/index.js',
    env = {
        NODE_ENV: 'testing',
    },
) {
    const cwd = path.join(projectAbsolutPath)
    // const cwd = path.join(os.homedir(), 'Documents/klook/klook-nuxt-web')

    const exec = cp.exec(`clinic doctor --collect-only -- ${command}`, {
        cwd: cwd,

        env: {
            ...process.env,
            ...env,
            NODE_OPTIONS: '--max-old-space-size=4096'
        },
        stdio: 'inherit',
    })

    return exec
}

async function startChildProcess(path, command, env) {

    const exec = createdProcess(path, command, env)

    exec.on('exit', (code) => {
        console.log(`--- child process exit: ${code}`)
    })

    return new Promise((resolve) => {
        exec.stdout.on('data', async (data) => {
            // console.log('-- data: ', data)
            if (data.includes('Server listening on')) {
                const tt = setTimeout(() => {
                    resolve(exec)
                    clearTimeout(tt)
                }, 10000)
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
