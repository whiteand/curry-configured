const OBJ_PROP = Symbol('OBJ_PROP')
const NOT_SET_PROPS = Symbol('NOT_SET_PROPS')

function curryConfigured(configPropNames = [], configuredFunction = x => x, initialObject = {}) {
  const toBeAddedSet = new Set([...configPropNames])
  const getDefault = obj => {
    const resFunc = settings => partialApply(settings, obj)
    resFunc[OBJ_PROP] = obj
    resFunc[NOT_SET_PROPS] = configPropNames
      .filter(prop => !(prop in obj))
    return resFunc
  }
  const partialApply = (settings, obj) => {
    if (!settings) {
      const resFunc = settings => partialApply(settings, obj)
      resFunc[OBJ_PROP] = obj
      resFunc[NOT_SET_PROPS] = configPropNames
        .filter(prop => !(prop in obj))
      return resFunc
    }
    const presentKeys = Object.keys(obj)
    const presentSet = new Set([...presentKeys])
    const addedKeys = Object.keys(settings)
      .filter(prop => toBeAddedSet.has(prop))
    const newObj = Object.assign({}, obj)
    const objToBeMerged = {}
    for (const prop of addedKeys) {
      if (presentSet.has(prop)) {
        throw new TypeError(`${prop} already added`)
      }
      objToBeMerged[prop] = settings[prop]
    }
    const resConfig = Object.assign(newObj, objToBeMerged)
    const isEndOfPartialApplication = [...toBeAddedSet].every(prop => (prop in resConfig))
    if (isEndOfPartialApplication) {
      return configuredFunction(resConfig)
    }
    return getDefault(resConfig)
  }
  return getDefault(initialObject)
}
module.exports = curryConfigured