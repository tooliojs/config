let entry = 'toolioConfig'
let root = 'root'
let filename = 'filename'
const merge = require('./merge')

module.exports = function() {
    let user_pkg
    let config_pkg
    let combo_pkg
    try {
        user_pkg = require(require('path').resolve('package.json'))[entry]
        config_pkg = require('../../package.json')[entry]
    } catch(err) { console.log(new Error(err)); process.exit() }
    if(!user_pkg) combo_pkg = config_pkg 
    else {
        let combo_root = config_pkg[root]
        let combo_filename = config_pkg[filename]
        if(typeof user_pkg[root] === 'string') combo_root = user_pkg[root]
        if(typeof user_pkg[filename] === 'string') combo_filename = user_pkg[filename]
        combo_pkg = {}
        combo_pkg[root] = combo_root
        combo_pkg[filename] = combo_filename
        combo_pkg = merge(config_pkg, combo_pkg)
    } return combo_pkg
}