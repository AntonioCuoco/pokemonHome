function isNil(text) {
    return text == null && text == undefined && text.trim() == '';
}

function isNilOnly(text) {
    return text == null && text == undefined;
}

function isNilAndLenghtIs0(value) {
    return value === null || value === undefined || value.length === 0;
}

module.exports = {
    isNil,
    isNilOnly,
    isNilAndLenghtIs0
}