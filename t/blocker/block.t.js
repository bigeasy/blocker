require('proof')(2, function (equal) {
    var Blocker = require('../..')
    var stream = require('stream')
    var pipe = new stream.PassThrough
    var blocker = new Blocker(pipe)

    var buffer = new Buffer(16)
    buffer.writeUInt16BE(0xaaaa, 0)

    pipe.write(buffer.slice(0, 1))

    blocker.block(2, function (buffer) {
        equal(buffer.length, 2, 'sliced')
        equal(buffer.readUInt16BE(0), 0xaaaa, 'block is ready')
    })

    pipe.write(buffer.slice(1))
})
