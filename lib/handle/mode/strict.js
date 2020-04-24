module.exports = function(configs) {
    console.log('handling in strict mode')
    console.log(configs)

    return (function() {
        return 1
    })()
}