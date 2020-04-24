function run_check(deps, package) {
    if(Object.keys(deps).length) {
        for(dep in deps) { if(dep === package) return true }
    } return false
}

module.exports = function(package) {
    let found
    let deps
    let dev_deps
    let __package

    try { __package = require(require('path').resolve('package.json')) } 
    catch(err) { console.log(err); process.exit() }

    if(__package.dependencies) deps = __package.dependencies
    if(__package.devDependencies) dev_deps = __package.devDependencies

    if(deps === undefined && dev_deps === undefined) return false 
    else {
        if(deps !== undefined && run_check(deps, package)) found = true
        if(dev_deps !== undefined && run_check(dev_deps, package)) found = true
    }

    if(found) return found
    else return false
}