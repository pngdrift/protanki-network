const { EventEmitter } = require("stream");
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
class Network extends EventEmitter {

	static PACKET_HEADER_SIZE = 8;

	/**
	 * @param {net.Socket} socket
	 */
	constructor(socket) {
		super();
		this.socket = socket;
		this.context = null;
		this.protocol = new Protocol();
		this.debug = false;
		this.dataBuffer = Buffer.alloc(0);
		this.socket.on("data", (data) => {
			this.dataBuffer = Buffer.concat([this.dataBuffer, data]);
			this.processBuffer();
		});
	}

	/**
	 * @returns 
	 */
	processBuffer() {
		while (this.dataBuffer.byteLength >= Network.PACKET_HEADER_SIZE) {
			const packetLength = this.dataBuffer.readInt32BE();
			if (this.dataBuffer.byteLength < packetLength) {
				return;
			}
			const payloadLength = packetLength - Network.PACKET_HEADER_SIZE;
			if (payloadLength >= 0) {
				if (this.context)
					this.context.decrypt(this.dataBuffer, packetLength);

				this.dataBuffer.position = 4;
				this.emit("packetData", this.dataBuffer, packetLength);

				this.dataBuffer = this.dataBuffer.subarray(
					packetLength,
					this.dataBuffer.length,
				);
			}
		}
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
				console.log("sendCommand", packetId, args);

			const buffer = Buffer.concat(chunks);

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
			if (object.length > 0) {
				const elementCodec = this.protocol.getCodec(object[0].constructor.name);
				VectorCodec.encode(chunks, elementCodec, object, object[0].constructor.name === "String");
			}
			else {
				VectorCodec.encode(chunks, null, object, false);
			}
		}
		else {
			const codec = this.protocol.getCodec(object.constructor.name);
			codec.encode(chunks, object);
		}
	}

}
module.exports = Network;