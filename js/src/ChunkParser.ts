import { BrowserHeaders } from "browser-headers";
import { TextDecoder } from "text-encoding";

const HEADER_SIZE = 5;

export class TransportState {
  buffer: ArrayBuffer;
  position: number = 0;
}

function hasEnoughBytes(byteCount: number, state: TransportState) {
  return state.buffer.byteLength - state.position >= byteCount
}

function isTrailerHeader(headerView: DataView) {
  // This is encoded in the MSB of the grpc header's first byte.
  return (headerView.getUint8(0) & 0x80) === 0x80
}

function parseTrailerData(msgData: Uint8Array): BrowserHeaders {
  return new BrowserHeaders(new TextDecoder("utf-8").decode(msgData))
}

function readLengthFromHeader(headerView: DataView) {
  return headerView.getUint32(1, false /* bigEndian */)
}

function addBufferToState(readBuffer: ArrayBuffer, state: TransportState) {
  if (state.buffer == null) {
    state.buffer = readBuffer;
    state.position = 0;
  } else if (state.position === state.buffer.byteLength) {
    state.buffer = readBuffer;
    state.position = 0;
  } else {
    const remaining = state.buffer.byteLength - state.position;
    const newBuf = new Uint8Array(remaining + readBuffer.byteLength);
    newBuf.set(new Uint8Array(state.buffer, state.position), 0);
    newBuf.set(new Uint8Array(readBuffer), remaining);
    state.buffer = newBuf.buffer;
    state.position = 0;
  }
}

export enum ChunkType {
  MESSAGE = 1,
  TRAILERS = 2,
}

export type Chunk = {
  chunkType: ChunkType,
  trailers?: BrowserHeaders,
  data?: Uint8Array,
}

export function ChunkParser(bytes: Uint8Array, state: TransportState = new TransportState(), flush: boolean): [Chunk[], TransportState] {
  console.log("grpcChunkParser", bytes);
  const chunkData: Chunk[] = [];

  console.log("flush", bytes.length, state);

  if (bytes.length === 0 && flush) {
    return [chunkData, state];
  }

  addBufferToState(bytes.buffer, state);

  while (true) {
    if (!hasEnoughBytes(HEADER_SIZE, state)) {
      console.log("Not enough bytes");
      return [chunkData, state];
    }

    let headerBuffer = state.buffer.slice(state.position, state.position + HEADER_SIZE);
    const headerView = new DataView(headerBuffer);
    const msgLength = readLengthFromHeader(headerView);
    if (!hasEnoughBytes(HEADER_SIZE + msgLength, state)) {
      return [chunkData, state]
    }

    const messageData = new Uint8Array(state.buffer, state.position + HEADER_SIZE, msgLength);
    state.position += HEADER_SIZE + msgLength;

    if (isTrailerHeader(headerView)) {
      chunkData.push({chunkType: ChunkType.TRAILERS, trailers: parseTrailerData(messageData)});
      // This must be the end of the chunk
      return [chunkData, state]
    } else {
      chunkData.push({chunkType: ChunkType.MESSAGE, data: messageData})
    }
  }
}
