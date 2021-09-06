const { exec } = require('child_process');

// 输出当前目录（不一定是代码所在的目录）下的文件和文件夹
console.log('-- 1: ', 1)
exec('node /Users/L/Documents/klook/klook-nuxt-web/server/index.js', (err, stdout, stderr) => {
// execSync('clinic doctor -- node /Users/L/Documents/klook/klook-nuxt-web/server/index.js', (err, stdout, stderr) => {
    if(err) {
        console.log(err);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
})


process.on('SIGINT', async function onSigint() {
    console.log('clinic doctor closed')
    process.exit()
})


