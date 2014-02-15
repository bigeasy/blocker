### Read Blocks

This did not turn out to be a terribly complicated library after all. Most of
the complexity is built into Node.js stream libraries now. Both chunking and
buffering are provided by `stream.Readable`.

### Issue by Issue

 * Assert that block is properly sliced #8.
 * Implement basic block reading interface. #7.
