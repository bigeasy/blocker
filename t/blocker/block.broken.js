require('proof')(1, function (ok) {
    var Blocker = require('../..')
    var blocker = new Blocker()

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
