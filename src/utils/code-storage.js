'use strict'

const StorageKeyPrefix = 'CodeHere_'
const KeyList = ['htmlStr', 'cssStr', 'jsStr', 'htmlHeight', 'cssHeight', 'leftWidth', 'autoRender']

const CodeStorage = Object.freeze({
  fetchAll: function() {
    const allItems = {}
    for (let key of KeyList) {
      allItems[key] = this.fetch(key)
    }
    return allItems
  },

  fetch: function(key) {
    return localStorage.getItem(StorageKeyPrefix + key)
  },

  save: function(obj) {
    if (!obj) return
    for (let key in obj) {
      localStorage.setItem(StorageKeyPrefix + key, obj[key])
    }
  }
})

export default CodeStorage