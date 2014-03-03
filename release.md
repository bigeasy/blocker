### Read Blocks

This did not turn out to be a terribly complicated library after all. Most of
the complexity is built into Node.js stream libraries now. Both chunking and
buffering are provided by `stream.Readable`.

### Issue by Issue

 * Upgrade Cadence to 0.0.36. #12.
 * Upgrade Proof to 0.0.44. #11.
 * Make `stream` a public property. #10.
 * Release version 0.0.1. #9.
 * Assert that block is properly sliced #8.
 * Implement basic block reading interface. #7.
