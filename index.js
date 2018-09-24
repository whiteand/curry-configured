const OBJ_PROP = Symbol('OBJ_PROP')
const NOT_SET_PROPS = Symbol('NOT_SET_PROPS')
function curryObject(propertyNames) {
  const toBeAddedSet = new Set([...propertyNames])
  const partialApply = (settings, obj) => {
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
    const resObj = Object.assign(newObj, objToBeMerged)
    if (presentKeys.length + addedKeys.length === propertyNames.length) {
      return resObj
    }
    const resFunc = settings => partialApply(settings, resObj)
    resFunc[OBJ_PROP] = resObj
    resFunc[NOT_SET_PROPS] = propertyNames
      .filter(prop => !presentSet.has(prop) && !addedKeys.includes(prop))
    return resFunc
  }
  return settings => partialApply(settings, {})
}

module.exports = curryObject