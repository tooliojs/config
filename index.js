module.exports = function() {
    const fs = require('fs')
    const build = require('./lib/build')
    const handle = require('./lib/handle')
    const merge = require('./lib/_util/merge')
    const __join = require('path').join
    const __dirname = require('path').resolve()
    const __homedir = require('os').homedir()
    const settings = require('./lib/_util/settings')()

    let resolved
    let non_resolved = []
    let non_resolved_config = {}

    settings.ext.forEach(ext => {
        let check = settings.root
        let file = `${settings.filename}.${ext}`
        let home_path = __join(__homedir, check, file)
        let local_path = __join(__dirname, check, file)

        if(fs.existsSync(home_path)) non_resolved.push(build(home_path))
        if(fs.existsSync(local_path)) non_resolved.push(build(local_path))
    })

    if(!non_resolved.length) return undefined

    if(non_resolved.length === 1) non_resolved_config = non_resolved[0]
    else non_resolved_config = merge(non_resolved[0], non_resolved[1])

    if(!Object.keys(non_resolved_config).length) { console.log('error: no configs detected'); process.exit() }
    else resolved = handle(non_resolved_config)

    console.log(resolved)
    return 0
}()