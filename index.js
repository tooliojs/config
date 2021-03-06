module.exports = function() {
    let def_script = '.js'
    let def_content = ''
    let def_filemode = { mode: 0o755 }
    const fs = require('fs')
    const build = require('./lib/build')
    const handle = require('./lib/handle')
    const merge = require('./lib/_util/merge')
    const __join = require('path').join
    const __dirname = require('path').resolve()
    const __homedir = require('os').homedir()
    const settings = require('./lib/_util/settings')()
    const module_exists = require('./lib/_util/module_exists')
    const package_exists = require('./lib/_util/package_exists')

    let resolved
    let __paths = []
    let non_resolved = []
    let non_resolved_config = {}

    if(!fs.existsSync(__join(__homedir, settings.root))) {
        fs.mkdirSync(__join(__homedir, settings.root))
        fs.writeFileSync(__join(__homedir, settings.root, settings.filename+def_script), def_content, def_filemode)
    } 
    else if(fs.existsSync(__join(__homedir, settings.root))) {
        let user_configs_exists
        settings.ext.forEach(ex => {
            if(fs.existsSync(__join(__homedir, settings.root, settings.filename+'.'+ex))) user_configs_exists = true
        })
        if(!user_configs_exists) fs.writeFileSync(__join(__homedir, settings.root, settings.filename+def_script), def_content, def_filemode)
    }

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

    let builds = {}
    __paths.forEach(_p => { merge(builds, build(_p)) })
    resolved = builds

    if(builds && builds.config && builds.config.mode && builds.config.mode === 'strict') {
        for(key in builds) {
            if(key === 'config') continue
            let val_object
            if(package_exists(builds.config.schemas[key])) val_object = require(__join(__dirname, 'node_modules', builds.config.schemas[key]))
            else if(module_exists(builds.config.schemas[key])) val_object = module_exists(builds.config.schemas[key]).plugin

            let pre_val_obj = {}
            pre_val_obj[key] = builds[key]

            let { error } = val_object.validate(pre_val_obj)
            if(error) { console.log(error); process.exit() }
        }
    }

    if(builds && builds.config && builds.config.exclude && builds.config.exclude.length && typeof builds.config.exclude !== 'string') {
        builds.config.exclude.forEach(co_key => {
            delete resolved[co_key]
        })
    }

    return resolved
}()