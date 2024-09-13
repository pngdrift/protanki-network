const Protocol = require("./Protocol");
const VectorCodec = require("./codec/VectorCodec");
const net = require("net");

/**
 * Packet structure:
 * length|id|data
 * 
 * length - (int32) full length of packet
 * id - (int32)
 * data - (*) args
 */
class Network {

	static PACKET_HEADER_SIZE = 8;

	/**
	 * @param {net.Socket} socket
	 */
	constructor(socket) {
		this.socket = socket;
		this.context = null;
		this.protocol = new Protocol();
		this.debug = false;
	}

	/**
	 * @param {number} packetId int
	 * @param {...any} args
	 * @returns {Boolean}
	 */
	sendCommand(packetId, ...args) {
		if (this.socket) {
			const chunks = [Buffer.allocUnsafe(Network.PACKET_HEADER_SIZE)];

			for (let i = 0; i < args.length; i++) {
				this.addArgumentData(chunks, args[i]);
			}

			if (this.debug)
				console.log("sendCommand" , packetId, args);

			const buffer = Buffer.concat(chunks);
			if (buffer.byteLength > 65536 + Network.PACKET_HEADER_SIZE) {
				console.log(`Very large packet! (ID ${packetId}) Sending canceled`, packetId);
				return false;
			}

			if (this.context)
				this.context.encrypt(buffer);

			buffer.writeInt32BE(buffer.byteLength);
			buffer.writeInt32BE(packetId, 4);
			return this.socket.write(buffer);
		}
		return false;
	}

	/**
	 * @param {Buffer[]} chunks
	 * @param {any} object
	 */
	addArgumentData(chunks, object) {
		if (object.constructor.name === "Array") {
			const elementCodec = this.protocol.getCodec(object[0].constructor.name);
			VectorCodec.encode(chunks, elementCodec, object, object[0].constructor.name === "String");
		}
		else {
			const codec = this.protocol.getCodec(object.constructor.name);
			codec.encode(chunks, object);
		}
	}

}
module.exports = Network;