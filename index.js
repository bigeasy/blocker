var util = require('util')
var Transform = require('stream').Transform
var ok = require('assert').ok
util.inherits(Blocker, Transform)

function Blocker (readable) {
    this._buffered = 0
    this._buffers = []
    this._readable = readable
}

Blocker.prototype.block = function (size, callback) {
    ok(!this._next, 'size already set')
    this._next = { size: size, callback: callback }
    if (!this._consume()) {
        this._readable.once('readable', this._readable.bind(this))
    }
}

Blocker.prototype._readable = function (size, callback) {
}

Blocker.prototype._consume = function () {
    var size = this._next.size, total = 0
    for (var i = 0, I = this._buffers.length; i < I; i++) {
        var buffer = this._buffers[i], length = buffer.length
        if (size <= total + length) {
            var remaining = size - total,
                slice = this._buffers.slice(0, i + 1),
                callback = this._next.callback,
                block
            delete this._next
            if (remaining != length) {
                slice.pop()
                slice.push(buffer.slice(0, remaining))
                this._buffers.unshift(buffer.slice(remaining))
            }
            if (slice.length == 1) {
                block = slice[0]
            } else {
                block = Buffer.concat(slice, size)
            }
            callback(block)
            return true
        } else {
            total += length
        }
    }
    return false
}

Blocker.prototype._transform = function () {
    this._buffers.push(chunk)
    if (this._size) {
        this._consume()
    }
}

module.exports = Blocker
