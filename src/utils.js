
import { bindCall, bind, createBinder } from './core.js'

export const $number = /*@__PURE__*/createBinder(Number.prototype)
export const $string = /*@__PURE__*/createBinder(String.prototype)
export const $array = /*@__PURE__*/createBinder(Array.prototype)

export const assert = null
export const unreachable = null

const ObjectProto = Object.prototype
export const hasOwn = Object.hasOwn ?? /*@__PURE__*/bindCall(ObjectProto.hasOwnProperty)
export const getOwn = (o, k) => hasOwn(o, k) ? o[k] : void 0
export const getAsync = async ($, key) => (await $)[key]
export const getTypeString = /*@__PURE__*/bindCall(ObjectProto.toString)
export const isPlainObject = (o) => {
  o = getTypeString(o)
  return o === '[object Object]' || o === '[object Array]'
}

export const now = /*@__PURE__*/bind(Performance.prototype.now, performance)
export const $then = /*@__PURE__*/bindCall(Promise.prototype.then)
export const encodeText = /*@__PURE__*/bind(TextEncoder.prototype.encode, new TextEncoder())
export const decodeText = /*@__PURE__*/bind(TextDecoder.prototype.decode, new TextDecoder())
export const pipeTo = /*@__PURE__*/bindCall(ReadableStream.prototype.pipeTo)

const RegProto = RegExp.prototype
export const test = /*@__PURE__*/bindCall(RegProto.test)
export const match = /*@__PURE__*/bindCall(RegProto[Symbol.match])
export const matchAll = /*@__PURE__*/bindCall(RegProto[Symbol.matchAll])
export const replace = /*@__PURE__*/bindCall(RegProto[Symbol.replace])
export const search = /*@__PURE__*/bindCall(RegProto[Symbol.search])
export const split = /*@__PURE__*/bindCall(RegProto[Symbol.split])

const EventTargetProto = EventTarget.prototype
export const on = /*@__PURE__*/bindCall(EventTargetProto.addEventListener)
export const off = /*@__PURE__*/bindCall(EventTargetProto.removeEventListener)

