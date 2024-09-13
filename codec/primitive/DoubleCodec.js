class DoubleCodec {

   /**
    * @param {Buffer[]} chunks 
    * @param {number} object 
    */
   static encode(chunks, object) {
      const buffer = Buffer.allocUnsafe(8);
      buffer.writeDoubleBE(object);
      chunks.push(buffer);
   }

   /**
    * @param {Buffer} buffer 
    * @returns {Number}
    */
   static decode(buffer) {
      const result = buffer.readDoubleBE(buffer.position);
      buffer.position += 8;
      return result;
   }

}
module.exports = DoubleCodec;