// Independent implementation of the documented FitPro framing.
// Research references and compatibility limits are in README.md.
export const hex = b => Array.from(b, x => x.toString(16).padStart(2, '0')).join(' ');
export function frame(group, command, payload = new Uint8Array()) {
  if (!(payload instanceof Uint8Array) || payload.length > 65530) throw Error('Invalid payload');
  const out = new Uint8Array(payload.length + 8), v = new DataView(out.buffer);
  out.set([0xcd, 0, 0, group, 1, command]);
  v.setUint16(1, out.length - 3); v.setUint16(6, payload.length); out.set(payload, 8);
  return out;
}
export class Decoder {
  constructor() { this.buffer = new Uint8Array(); }
  push(bytes) {
    this.buffer = Uint8Array.from([...this.buffer, ...bytes]);
    const packets = [];
    while (this.buffer.length) {
      const start = this.buffer.findIndex(x => x === 0xcd || x === 0xdc);
      if (start < 0) { this.buffer = new Uint8Array(); break; }
      this.buffer = this.buffer.slice(start);
      if (this.buffer.length < 3) break;
      const size = ((this.buffer[1] << 8) | this.buffer[2]) + 3;
      if (size < 8 || size > 16384) { this.buffer = this.buffer.slice(1); continue; }
      if (this.buffer.length < size) break;
      const raw = this.buffer.slice(0, size); this.buffer = this.buffer.slice(size);
      if (raw[0] === 0xdc) { packets.push({ack:true, raw}); continue; }
      if (raw[4] !== 1 || ((raw[6] << 8) | raw[7]) !== size - 8) continue;
      packets.push({group:raw[3], command:raw[5], payload:raw.slice(8), raw});
    }
    return packets;
  }
}
export function dialInfo(bytes) {
  if (bytes.length < 10) throw Error('Incomplete dial information');
  const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let i = 6;
  const str = () => {
    if (i >= bytes.length) throw Error('Missing model length');
    const n = bytes[i++];
    if (i + n > bytes.length) throw Error('Truncated model');
    const s = new TextDecoder().decode(bytes.slice(i,i+n)); i += n; return s;
  };
  const model = str(), hardware = str();
  if (i + 2 > bytes.length) throw Error('Missing image encoding');
  const width = v.getUint16(2), height = v.getUint16(4);
  if (width < 32 || height < 32 || width > 1024 || height > 1024) throw Error('Unrecognized screen dimensions');
  const info = {screenType:bytes[0], grade:bytes[1], width, height, model, hardware, config:bytes[i], algorithm:bytes[i+1], raw:hex(bytes)};
  const customerOffset = i + 5;
  if (customerOffset < bytes.length) {
    const end = customerOffset + bytes[customerOffset];
    if (end+6 <= bytes.length) {
      info.pictureCount = bytes[end+1]; info.themeVersion = v.getUint16(end+2); info.chunkHint = v.getUint16(end+4);
    }
  }
  return info;
}
export function acknowledge(packet) {
  const n = packet.raw.length;
  return Uint8Array.of(0xdc, 0, 5, packet.group, 1, n >> 8, n & 255, 1);
}
export function rgb565(rgba) {
  if (rgba.length % 4) throw Error('Invalid RGBA image');
  const out = new Uint8Array(rgba.length/2), view = new DataView(out.buffer);
  for(let i=0,j=0;i<rgba.length;i+=4,j+=2) {
    view.setUint16(j, ((rgba[i]>>3)<<11)|((rgba[i+1]>>2)<<5)|(rgba[i+2]>>3), true);
  }
  return out;
}
