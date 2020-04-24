module.exports = function(configs) {
    let plugins
    let schemas
    let resolved
    let validated
    let non_resolved = []
    let non_validated = []
    let config_keys = []
    let validated_keys = []
    const merge = require('../../_util/merge')
    const package_exists = require('../../_util/package_exists')
    const module_exists = require('../../_util/module_exists')
    const arrays_match = require('../../_util/arrays_match')
    function isObject(obj) { return obj === Object(obj) && Object.prototype.toString.call(obj) !== '[object Array]' }

    if(configs.config.plugins && configs.config.plugins.length && typeof configs.config.plugins !== 'string') plugins = configs.config.plugins
    if(configs.config.schemas && isObject(configs.config.schemas)) schemas = configs.config.schemas
    
    if(!schemas) { console.log('error: in strict mode, you need to define schemas for your configs'); process.exit() }
    if(plugins) {
        plugins.forEach(plugin => {
            if(package_exists(plugin)) non_resolved.push({ type: 'package', plugin: plugin })
            else if(module_exists(plugin)) non_resolved.push(module_exists(plugin))
        })
        if(!non_resolved.length) resolved = configs
        else {
            let resolved_tmp = [configs]
            non_resolved.forEach(plugin => {
                if(plugin.type === 'package') resolved_tmp.push(require(plugin.plugin))
                else if(plugin.type === 'module') resolved_tmp.push(plugin.plugin)
            }); resolved = merge(...resolved_tmp)
        }
    }

    if(resolved) {
        for(schema in schemas) {
            if(schema === 'config') continue
            for(key in resolved) {
                if(key === 'config') continue
                if(schema === key) {
                    let tmp_obj = {}
                    tmp_obj[key] = resolved[key]
                    non_validated.push(tmp_obj)
                } 
            }
        }

        if(non_validated.length) {
            let validated_tmp = [{config: resolved.config}]
            non_validated.forEach(conf => {
                for(schema in schemas) {
                    if(schema === Object.keys(conf)[0]) {
                        let tmp_obj = {}
                        if(package_exists(schemas[schema])) {
                            try {
                                let { error, value } = require(schemas[schema]).plugin.validate(conf)
                                if(error) {
                                    console.log(error)
                                    process.exit()
                                }
                                else validated_tmp.push(value)
                            }
                            catch (err) {
                                console.log(new Error(err))
                                process.exit()
                            }
                        }
                        else if(module_exists(schemas[schema])) {
                            try {
                                let { error, value } = module_exists(schemas[schema]).plugin.validate(conf)
                                if(error) {
                                    console.log(error)
                                    process.exit()
                                }
                                else validated_tmp.push(value)
                            }
                            catch (err) {
                                console.log(new Error(err))
                                process.exit()
                            }
                        }
                        else {
                            console.log(`error: "${schemas[schema]} was not found"`)
                            process.exit()
                        }
                    }
                }
            })
            validated = merge(...validated_tmp)
            
            for(conf in configs) { if(conf === 'config') continue; config_keys.push(conf) }
            for(val in validated) { if(val === 'config') continue; validated_keys.push(val) }

            if(arrays_match(config_keys, validated_keys)) return validated
            else { console.log('error: "configs" don\'t match "schemas"'); process.exit() }
        }
    }
}
