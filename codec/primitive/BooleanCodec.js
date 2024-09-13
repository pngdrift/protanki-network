const ByteCodec = require("./ByteCodec");

class BooleanCodec {

   /**
    * @param {Buffer[]} chunks 
    * @param {Boolean} object 
    */
   static encode(chunks, object) {
      ByteCodec.encode(chunks, object ? 1 : 0)
   }

   /**
    * @param {Buffer} buffer 
    * @returns {Boolean}
    */
   static decode(buffer) {
      return ByteCodec.decode(buffer) !== 0;
   }

}
module.exports = BooleanCodec;