var util = require('util')
var Transform = require('stream').Transform
var ok = require('assert').ok
util.inherits(Blocker, Transform)

function Blocker (stream) {
    this._stream = stream
    this._stream.on('readable', this._read.bind(this))
}

Blocker.prototype.block = function (size, callback) {
    ok(!this._next, 'size already set')
    this._next = { size: size, callback: callback }
    this._consume()
}

Blocker.prototype._read = function () {
    this._readable = true
    this._consume()
}

Blocker.prototype._consume = function () {
    if (this._next && this._readable) {
        var chunk = this._stream.read(this._next.size)
        if (chunk != null) {
            var callback = this._next.callback
            delete this._next
            callback(chunk)
        } else {
            this._readable = false
        }
    }
}

module.exports = Blocker
