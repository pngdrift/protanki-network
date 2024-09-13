const BooleanCodec = require("./BooleanCodec");
const IntCodec = require("./IntCodec");

class StringCodec {

   static NULL_VALUE = "~~NULL_VALUE_STRING~~";

   /**
   * @param {Buffer[]} chunks 
   * @param {string} object 
   */
   static encode(chunks, object) {
      if (object === null || object == StringCodec.NULL_VALUE) {
         BooleanCodec.encode(chunks, true);
         return;
      }
      BooleanCodec.encode(chunks, false);
      const bytes = Buffer.from(object, "utf8");
      IntCodec.encode(chunks, bytes.length);
      chunks.push(bytes);
   }

   /**
    * @param {Buffer} buffer 
    * @returns {Number}
    */
   static decode(buffer) {
      if (BooleanCodec.decode(buffer)) {
         return null;
      }
      const length = IntCodec.decode(buffer);
      const result = buffer.toString('utf8', buffer.position, buffer.position + length);
      buffer.position += length;
      return result;
   }

}
module.exports = StringCodec;