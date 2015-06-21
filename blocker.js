var ok = require('assert').ok
var Transform = require('stream').Transform
var util = require('util')

function Blocker (stream) {
    this.stream = stream
    this.stream.on('readable', this._read.bind(this))
}
util.inherits(Blocker, Transform)

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
        var chunk = this.stream.read(this._next.size)
        if (chunk != null) {
            var callback = this._next.callback
            delete this._next
            callback(null, chunk)
        } else {
            this._readable = false
        }
    }
}

Blocker.prototype.interrupt = function (error) {
    if (this._next) {
        var callback = this._next.callback
        delete this._next
        callback(error)
    }
}

module.exports = Blocker
