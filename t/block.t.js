require('proof/redux')(5, prove)

function prove (okay) {
    var Blocker = require('..')
    var stream = require('stream')
    var pipe = new stream.PassThrough
    var blocker = new Blocker(pipe)

    var buffer = new Buffer(16)
    buffer.writeUInt16BE(0xaaaa, 0)

    pipe.write(buffer.slice(0, 1))

    blocker.block(0, function (error, buffer) {
        okay(buffer.length, 0, 'zero')
    })

    blocker.block(2, function (error, buffer) {
        okay(buffer.length, 2, 'sliced')
        okay(buffer.readUInt16BE(0), 0xaaaa, 'block is ready')
    })
    pipe.write(buffer.slice(1))

    blocker.interrupt(new Error('interrupt'))

    blocker.block(16, function (error) {
        okay(error.message, 'interrupt', 'interrupt')
    })

    blocker.block(16, function (error) {
        okay(error.message, 'interrupt', 'interrupt')
    })
    blocker.interrupt(new Error('interrupt'))
}
