const VectorCodec = require("./codec/VectorCodec");
const BooleanCodec = require("./codec/primitive/BooleanCodec");
const ByteCodec = require("./codec/primitive/ByteCodec");
const FloatCodec = require("./codec/primitive/FloatCodec");
const IntCodec = require("./codec/primitive/IntCodec");
const ShortCodec = require("./codec/primitive/ShortCodec");
const StringCodec = require("./codec/primitive/StringCodec");

class Protocol {

	constructor() {
		this.info2codec = {}
		this.registerCodec("String", StringCodec);
		this.registerCodec("Number", IntCodec);
		this.registerCodec("Boolean", BooleanCodec);
		this.registerCodec("Short", ShortCodec);
		this.registerCodec("Byte", ByteCodec);
		this.registerCodec("Float", FloatCodec);
		this.registerCodec("Buffer", BufferCodec);
		this.registerCodec("Array", VectorCodec);
	}

	registerCodec(typecodecinfo, codec) {
		this.info2codec[typecodecinfo] = codec;
	}

	getCodec(typecodecinfo) {
		const codec = this.info2codec[typecodecinfo];
		if (codec) {
			return codec;
		}
		throw new Error("Codec not found: " + typecodecinfo)
	}

}
module.exports = Protocol;



class BufferCodec {

	/**
    * @param {Buffer[]} chunks 
    * @param {Buffer} object 
    */
	static encode(chunks, object) {
		chunks.push(object);
	}

	static decode(buffer) {
		throw new Error("Not supported");
	}

}