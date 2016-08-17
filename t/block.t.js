require('proof/redux')(4, prove)

function prove (assert) {
    var Blocker = require('..')
    var stream = require('stream')
    var pipe = new stream.PassThrough
    var blocker = new Blocker(pipe)

    var buffer = new Buffer(16)
    buffer.writeUInt16BE(0xaaaa, 0)

    pipe.write(buffer.slice(0, 1))

    blocker.block(2, function (error, buffer) {
        assert(buffer.length, 2, 'sliced')
        assert(buffer.readUInt16BE(0), 0xaaaa, 'block is ready')
    })
    pipe.write(buffer.slice(1))

    blocker.interrupt(new Error('interrupt'))

    blocker.block(16, function (error) {
        assert(error.message, 'interrupt', 'interrupt')
    })

    blocker.block(16, function (error) {
        assert(error.message, 'interrupt', 'interrupt')
    })
    blocker.interrupt(new Error('interrupt'))
}
