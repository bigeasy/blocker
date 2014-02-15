require('proof')(1, function (equal) {
    var Blocker = require('../..')
    var stream = require('stream')
    var pipe = new stream.PassThrough
    var blocker = new Blocker(pipe)

    var buffer = new Buffer(2)
    buffer.writeUInt16BE(0xaaaa, 0)

    pipe.write(buffer.slice(0, 1))

    blocker.block(2, function (buffer) {
        equal(buffer.readUInt16BE(0), 0xaaaa, 'wait on next')
    })

    pipe.write(buffer.slice(1))

    return
    function next() {
        blocker.read(8, header)
    }

    function header (block) {
        var type =  block.readUInt32(0)
        var length =  block.readUInt32(4)
        switch (type) {
        case 0:
            blocker.read(length, error)
            break
        case 1:
            blocker.read(length, success)
            break
        }
    }

    function error (block) {
        var code = block.getUInt32(0)
    }

    function success () {
        var length = block.getUInt32(0)
        var string = block.toString('utf8', 4, 4 + length)
    }
})
