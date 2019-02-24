import Vue from 'vue'
import Vuex from 'vuex'

import CodeStorage from '../utils/util'

Vue.use(Vuex)

function loadOptions() {
  let autoRender = CodeStorage.fetch('autoRender')
  if (autoRender === null || autoRender === undefined) {
    autoRender = true
    CodeStorage.save({ autoRender })
  } else {
    autoRender = (autoRender == 'true')
  }
  return { autoRender }
}

const state = {
  options: {
    autoRender: loadOptions().autoRender,
  }
}

const getters = {
  autoRender({ options }) {
    return options.autoRender
  }
}

const mutations = {
  setAutoRender({ options }, autoRender) {
    options.autoRender = autoRender
    CodeStorage.save({ autoRender })
  }
}

const actions = {
  setAutoRender({ commit }, autoRender) {
    commit('setAutoRender', autoRender)
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
})