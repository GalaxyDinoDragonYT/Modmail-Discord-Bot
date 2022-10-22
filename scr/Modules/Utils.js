module.exports = {
    SecondsToHuman(Seconds) {
        return new Date(Seconds * 1000).toISOString().slice(11, 19)
    }
}