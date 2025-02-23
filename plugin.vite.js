
import { fileURLToPath } from 'node:url'
import { $string, $array, test } from './src/utils.js'
const { startsWith, slice } = $string
const { includes, filter, map, join } = $array
const { getOwnPropertyNames: ownNames } = Object

const isUpperCaseReg = /^[A-Z]/
const isLowerCaseReg = /^[a-z]/
const isVariableNameReg = /^(?=[A-Za-z])[\w]+$/
const isVariableName = name => test(isVariableNameReg, name)

const $export = (name, from) => {
  if (name === 'with') {
    return `export const { '${name}' : $${name} } = ${from}`
  }
  return `export const { ${name} } = ${from}`
}

export const bindScript = () => {
  return {
    name: 'target',
    enforce: 'pre',
    apply: 'build',
    resolveId(source) {
      if (startsWith(source, 'bind:')) { return source }
    },
    load(id) {
      if (startsWith(id, 'bind:')) {
        id = slice(id, 5)
        if (test(isUpperCaseReg, id)) {
          if (!test(isVariableNameReg, id)) { return '' }
          const T = globalThis[id]
          const staticFields = filter(ownNames(T), isVariableName)
          let instanceFields = filter(ownNames(T.prototype), isVariableName)
          instanceFields = filter(instanceFields, name => !includes(staticFields, name))
          return `\
import { createBinder } from 'bind:core'
const T = ${id}, $ = /*@__PURE__*/createBinder(T.prototype)
${join(map(staticFields, name => $export(name, 'T')), '\n')}
${join(map(instanceFields, name => $export(name, '$')), '\n')}
export default $
`
        }
        if (test(isLowerCaseReg, id)) {
          return `export * from ${JSON.stringify(fileURLToPath(import.meta.resolve(`./src/${id}.js`)))}`
        }
        return ''
      }
    }
  }
}