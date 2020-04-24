module.exports = function(__path) {
    let found
    const __join = require('path').join
    const __dirname = require('path').resolve()
    const __homedir = require('os').homedir()

    try {
        found = require(__join(__dirname, __path))
    } catch(err) {}
    if(!found) {
        try {
            found = require(__join(__dirname, 'node_modules', __path))
        } catch(err) {}
        if(!found) {
            try {
                found = require(__join(__homedir, __path))
            } catch(err) {}
            if(!found) {
                try {
                    found = require(__join(__homedir, 'node_modules', __path))
                } catch(err) {}
                if(found) return { type: 'module', plugin: found } 
                else return false
            } return { type: 'module', plugin: found }
        } return { type: 'module', plugin: found }
    } return { type: 'module', plugin: found }
}