
declare module 'bind:core' {
  export const apply: typeof Reflect.apply
  export const bindCall: <F>(func: F) => <
    T extends F extends (this: infer T, ...args: any[]) => any ? T : never,
    A extends F extends (...args: infer A) => any ? [...A] : never
  >(thisArg: T, ...args: A) => F extends (this: T, ...args: A) => infer R ? R : never
  export const call: <T, A extends unknown[], R>(
    func: (this: T, ...args: A) => R, thisArg: T, ...args: A
  ) => R
  export const bind: <T, A extends unknown[], R>(
    func: (this: T, ...args: A) => R, thisArg: T
  ) => (...args: A) => R
  export type Binder<T extends {}, This extends {} = T> = {
    [K in Exclude<keyof T, T extends any[] ? number : never>]:
    T[K] extends (...args: infer A) => infer R
    ? (thisArg: This, ...args: A) => R
    : never
  }
  export const Binder: {
    new <T extends {}>(): Binder<T>
    prototype: Binder<{}>
  }
  export const createBinder: <T extends {}>(o: T) => Binder<T>
}
declare module 'bind:utils' {
  import type { Binder } from 'bind:core'
  export type Override<T, U> = U & Omit<T, keyof U>

  export const $number: Binder<number>
  export const $string: Binder<string>
  export const $array: Binder<any[]>

  export const { hasOwn } = Object
  export type Get<T extends {}, K extends PropertyKey> = K extends keyof T ? T[K] : never
  export const getOwn: <T extends {}, K extends PropertyKey>(o: T, k: K) => Get<T, K> | undefined
  export const getAsync: <
    T extends { [_ in K]: any }, K extends PropertyKey
  >($: Promise<T>, key: K) => Promise<Awaited<T[K]>>
  export const getTypeString: (o: any) => string
  export const isPlainObject: (o: any) => boolean

  export const { now }: Performance
  export const $then: <T, R1 = T, R2 = never>(
    thisArg: Promise<T>,
    onFulfilled?: ((value: T) => R1 | PromiseLike<R1>) | null,
    onRejected?: ((reason: any) => R2 | PromiseLike<R2>) | null
  ) => Promise<R1 | R2>
  export const encodeText: TextEncoder['encode']
  export const decodeText: TextDecoder['decode']
  export const { pipeTo }: Binder<ReadableStream>

  export const {
    test,
    [Symbol.match]: match,
    [Symbol.matchAll]: matchAll,
    [Symbol.replace]: replace,
    [Symbol.search]: search,
    [Symbol.split]: split,
  }: Binder<Override<RegExp, {
    [Symbol.replace](string: string, replacer: string | ((sub: string, ...args: any[]) => string)): string
  }>, RegExp>

  type EventListenerThis<T extends EventTarget | null> = T extends null ? typeof globalThis : T
  type EventListenerEvent<T extends EventTarget | null, Type extends string>
    = NonNullable<EventListenerThis<T>[`on${Type}`]> extends (e: infer E) => any ? E : Event
  type EventListener<T extends EventTarget | null, Type extends string>
    = (this: EventListenerThis<T>, e: EventListenerEvent<T, Type>) => any

  export const on: <T extends EventTarget | null, Type extends string>(
    thisArg: T, type: Type, callback: EventListener<T, Type>,
    options?: AddEventListenerOptions | boolean
  ) => void
  export const off: <T extends EventTarget | null, Type extends string>(
    thisArg: T, type: Type, callback: EventListener<T, Type>,
    options?: EventListenerOptions | boolean
  ) => void
}
declare module 'bind:Number' {
  const T: typeof Number & import('bind:core').Binder<number>
  export = T
}
declare module 'bind:String' {
  type Replacer = (sub: string, ...args: any[]) => string
  const T: typeof String & import('bind:core').Binder<import('bind:utils').Override<string, {
    replace(searcher: string, replacer: string | Replacer): string
    replaceAll(searcher: string, replacer: string | Replacer): string
    search(searcher: string): number
    split(separator: string, limit?: number): string[]
  }>, string>
  export = T
}
declare module 'bind:Array' {
  const T: typeof Array & import('bind:core').Binder<Omit<any[], 'with'>, any[]> & {
    $with<T>(thisArg: T[], index: number, value: T): T[]
  }
  export = T
}
declare module 'bind:Object' {
  const T: typeof Object & import('bind:core').Binder<Object>
  export = T
}
