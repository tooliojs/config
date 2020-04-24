module.exports = function(configs) {
    if(!configs.config) return configs
    else {
        if(!configs.config.mode) return configs
        else {
            if(configs.config.mode === 'relaxed') return require('./mode/relaxed')(configs)
            else if(configs.config.mode === 'strict') return require('./mode/strict')(configs)
            else return configs
        }
    }
}