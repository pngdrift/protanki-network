class ByteCodec {

   /**
    * @param {Buffer[]} chunks 
    * @param {number} object 
    */
   static encode(chunks, object) {
      const buffer = Buffer.allocUnsafe(1);
      buffer.writeInt8(object);
      chunks.push(buffer);
   }

   /**
    * @param {Buffer} buffer 
    * @returns {Number}
    */
   static decode(buffer) {
      const result = buffer.readInt8(buffer.position);
      buffer.position += 1;
      return result;
   }

}
module.exports = ByteCodec;