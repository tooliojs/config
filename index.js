module.exports = function() {
    const fs = require('fs')
    const ext = require('./lib/_util/ext')
    const build = require('./lib/build')
    const handle = require('./lib/handle')
    const merge = require('./lib/_util/merge')
    const __join = require('path').join
    const __dirname = require('path').resolve()
    const __homedir = require('os').homedir()
    const __platform = require('os').platform()
    const settings = require('./lib/_util/settings')()

    let resolved
    let __paths = []
    let non_resolved = []
    let non_resolved_config = {}

    settings.ext.forEach(ext => {
        let check = settings.root
        let file = `${settings.filename}.${ext}`
        let home_path = __join(__homedir, check, file)
        let local_path = __join(__dirname, check, file)

        if(fs.existsSync(home_path)) { non_resolved.push(build(home_path)); __paths.push(home_path) }
        if(fs.existsSync(local_path)) { non_resolved.push(build(local_path)); __paths.push(local_path) }
    })

    if(!non_resolved.length) return undefined
    if(non_resolved.length === 1) non_resolved_config = non_resolved[0]
    else non_resolved_config = merge(non_resolved[0], non_resolved[1])

    if(!Object.keys(non_resolved_config).length) return undefined
    else resolved = handle(non_resolved_config)

    if(__paths.length === 1) {
        try{
            let mark
            __platform === 'win32' ? mark = '\\' : mark = '/' 
            if(ext(__paths[0]) !== 'js') { console.log('error: js-yaml is not installed'); process.exit() }

            let src_filename = __paths[0].split(mark)[__paths[0].split(mark).length -1]


            fs.copyFile(__paths[0], __join(__dirname, 'node_modules', '@toolio', 'config', 'tmp', src_filename), (err) => {
                if (err) throw err;
                console.log('source.txt was copied to destination.txt');
            })

        } catch(err) {}
    }
    if(__paths.length === 2) {
        let builds = {}
        __paths.forEach(_p => { merge(builds, build(_p)) })
        if(builds !== {}) resolved = builds
    }

    return resolved
}()