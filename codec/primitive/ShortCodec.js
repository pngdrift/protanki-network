class ShortCodec {

   /**
   * @param {Buffer[]} chunks 
   * @param {number} object 
   */
   static encode(chunks, object) {
      const buffer = Buffer.allocUnsafe(2);
      buffer.writeInt16BE(object);
      chunks.push(buffer);
   }

   /**
    * @param {Buffer} buffer 
    * @returns {Number}
    */
   static decode(buffer) {
      const result = buffer.readInt16BE(buffer.position);
      buffer.position += 2;
      return result;
   }

}
module.exports = ShortCodec;