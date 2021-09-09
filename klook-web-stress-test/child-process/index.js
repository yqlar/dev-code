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


function childProcess(callback) {
    const path = '/Users/klook/Documents/klook/klook-nuxt-web'
    const command = 'node server/index.js'

    const exec = createdProcess(path, {
        NODE_ENV: 'testing',
    }, command)

    exec.stdout.on('data', async (data) => {
        if (data.includes('Server listening on')) {
            await callback()

            return new Promise((resolve) => {
                const rr = setTimeout(() => {
                    exec.kill('SIGINT')
                    clearTimeout(rr)
                    resolve()
                }, 5000)
            })
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
