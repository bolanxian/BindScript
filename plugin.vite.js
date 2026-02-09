
import { fileURLToPath } from 'node:url'
import { $string, $array, test } from './src/utils.js'
const { startsWith, slice, replaceAll } = $string
const { includes, filter, map, join } = $array
const { hasOwn, getOwnPropertyNames: ownNames } = Object
const { stringify } = JSON

const isBuiltinReg = /^(?:core|utils)$/
const isVariableNameReg = /^(?!constructor$|default$).*$/s
const isVariableName = name => test(isVariableNameReg, name)

const $export = (name, from) => {
  const name1 = replaceAll(encodeURIComponent(name), '%', '$')
  const name2 = stringify(name)
  return `\
const $${name1} = ${from}[${name2}]
export { $${name1} as ${name2} }`
}

export const bindScript = () => {
  return {
    name: 'target',
    enforce: 'pre',
    resolveId(source) {
      if (startsWith(source, 'bind:')) { return source }
    },
    load(id) {
      if (!startsWith(id, 'bind:')) { return }
      id = slice(id, 5)
      if (test(isBuiltinReg, id)) {
        return `export * from ${stringify(fileURLToPath(import.meta.resolve(`./src/${id}.js`)))}`
      }
      if (!test(isVariableNameReg, id)) { return '' }
      const T = globalThis[id], $ = hasOwn(T, 'prototype') ? T.prototype : null
      const staticFields = filter(ownNames(T), name => typeof T[name] == 'function' && isVariableName(name))
      let instanceFields = filter(ownNames($ ?? {}), name => typeof $[name] == 'function' && isVariableName(name))
      instanceFields = filter(instanceFields, name => !includes(staticFields, name))
      return `\
import { createBinder } from 'bind:core'
const T = ${id}${$ != null ? ', $ = /*@__PURE__*/createBinder(T.prototype)' : ''}
${join(map(staticFields, name => $export(name, 'T')), '\n')}
${join(map(instanceFields, name => $export(name, '$')), '\n')}
export default $
`
    }
  }
}