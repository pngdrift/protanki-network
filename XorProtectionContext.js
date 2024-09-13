const Network = require("./Network");

class XorProtectionContext {

   /**
    * @param {Array} data 
    * @param {Boolean} serverSide
    */
   constructor(data, serverSide = false) {
      this.serverSequence = [];
      this.serverSelector = 0;
      this.clientSequence = [];
      this.clientSelector = 0;
      this.initialSeed = 0;

      let i = 0;
      while (i < data.length) {
         this.initialSeed ^= data[i];
         i++;
      }

      let j = 0;
      while (j < 8)//SEQUENCE_LENGTH
      {
         if (serverSide) {
            this.clientSequence[j] = this.initialSeed ^ j << 3 ^ 87;
            this.serverSequence[j] = this.initialSeed ^ j << 3;
         }
         else {
            this.clientSequence[j] = this.initialSeed ^ j << 3;
            this.serverSequence[j] = this.initialSeed ^ j << 3 ^ 87;
         }
         j++;
      }
   }

   /**
    * @param {Buffer} data
    */
   encrypt(data) {
      data.position = 0;
      for (let i = Network.PACKET_HEADER_SIZE; i < data.length; i++) {
         const value = data[i];
         data[i] = value ^ this.serverSequence[this.serverSelector];
         this.serverSequence[this.serverSelector] = value;
         this.serverSelector ^= value & 7;
      }
   }

   /**
    * @param {Buffer} data
    * @param {number} length
    */
   decrypt(data, length) {
      for (let i = Network.PACKET_HEADER_SIZE; i < length; i++) {
         const value = data[i];
         this.clientSequence[this.clientSelector] = value ^ this.clientSequence[this.clientSelector];
         data[i] = this.clientSequence[this.clientSelector];
         this.clientSelector ^= this.clientSequence[this.clientSelector] & 7;
      }
   }

}
module.exports = XorProtectionContext;