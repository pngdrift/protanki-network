const BooleanCodec = require("./primitive/BooleanCodec");
const IntCodec = require("./primitive/IntCodec");

/**
 * Universal codec for arrays
 */
class VectorCodec {

    /**
     * @param {Buffer} buffer 
     * @param {Class} codec 
     * @param {Boolean} optional 
     * @returns {Array}
     */
    static decode(buffer, codec, optional) {
        if (optional && BooleanCodec.decode(buffer)) {
            return null;
        }
        const length = IntCodec.decode(buffer);
        const data = [];
        for (let i = 0; i < length; i++) {
            data[i] = codec.decode(buffer)
        }
        return data;
    }


    /**
   * @param {Buffer[]} chunks 
   * @param {Class} codec 
   * @param {Array} object 
   * @param {Boolean} optional 
   */
    static encode(chunks, codec, object, optional) {
        if (optional) {
            BooleanCodec.encode(chunks, object === null);
        }
        const result = object;
        const length = result.length;
        IntCodec.encode(chunks, length)
        for (let i = 0; i < length; i++) {
            codec.encode(chunks, result[i]);
        }
    }

}
module.exports = VectorCodec;