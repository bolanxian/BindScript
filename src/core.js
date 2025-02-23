


export const { apply } = Reflect
const { bind: _bind, call: _call } = Function.prototype
const _bindCall = apply(_bind, _bind, [_call])

const bindMap = new WeakMap()
const { get: _get, set: _set } = WeakMap.prototype
const get = _bindCall(_get)
const set = _bindCall(_set)
set(bindMap, _get, get)
set(bindMap, _set, set)
export const bindCall = ((fn) => {
  let bound = get(bindMap, fn)
  if (bound == null) {
    bound = _bindCall(fn)
    set(bindMap, fn, bound)
  }
  return bound
})
export const call = bindCall(_call)
export const bind = bindCall(_bind)

export const $Proxy = Proxy, handler = {
  __proto__: null,
  get(target, key, receiver) {
    const value = target[key]
    if (typeof value === 'function') {
      return bindCall(value)
    }
  }
}
export const createBinder = (o) => new $Proxy(o, handler)
