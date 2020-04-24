module.exports = function(configs) {
    let plugins
    let resolved
    let non_resolved = []
    const merge = require('../../_util/merge')
    const package_exists = require('../../_util/package_exists')
    const module_exists = require('../../_util/module_exists')

    if(configs.config.plugins && configs.config.plugins.length && typeof configs.config.plugins !== 'string') plugins = configs.config.plugins 
    if(!plugins) resolved = configs
    else {
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
    } return resolved
}