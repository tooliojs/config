module.exports = function(__path) {
    let build
    let yaml_builder = 'js-yaml'
    const ext = require('../_util/ext')

    if(ext(__path) !== 'yaml') { // build javascript or json
        try { build = require(__path) }
        catch(err) { console.log(new Error(err)); process.exit() }
    }
    else { // build yaml 
        const pkg_exists = require('../_util/package_exists')(yaml_builder)
        if(!pkg_exists) { console.log('error: js-yaml is not installed'); process.exit() }
        else {
            try { 
                const fs = require('fs')
                const path = require('path')
                const yaml = require(path.resolve('node_modules', yaml_builder))
                build = yaml.safeLoad(fs.readFileSync(__path,'utf8')) 
            } catch(err) { console.log(new Error(err)); process.exit() }
        }
    } return build
}