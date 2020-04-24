module.exports = function(path) { 
    if(path.endsWith('.yml') || path.endsWith('.yaml')) return 'yaml'
    else if(path.endsWith('.js') || path.endsWith('.json')) return 'js'
    else return undefined
}