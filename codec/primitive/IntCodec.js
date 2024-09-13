class IntCodec {

   /**
    * @param {Buffer[]} chunks 
    * @param {number} object 
    */
   static encode(chunks, object) {
      const buffer = Buffer.allocUnsafe(4);
      buffer.writeInt32BE(object);
      chunks.push(buffer);
   }

   /**
    * @param {Buffer} buffer 
    * @returns {Number}
    */
   static decode(buffer) {
      const result = buffer.readInt32BE(buffer.position);
      buffer.position += 4;
      return result;
   }
   
}
module.exports = IntCodec;