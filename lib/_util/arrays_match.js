module.exports = function (_arr1, _arr2) {
    if (!Array.isArray(_arr1) || ! Array.isArray(_arr2) || _arr1.length !== _arr2.length) return false
    let arr1 = _arr1.concat().sort()
    let arr2 = _arr2.concat().sort()
    for (var i = 0; i < arr1.length; i++) { if (arr1[i] !== arr2[i]) return false }
    return true
}