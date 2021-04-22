import Vue from 'vue'
import Vuex from 'vuex'
import 'leaflet/dist/leaflet.css';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedGeom: null,
    cloudMaskGeoJSON: null,
    predictedGeoJSON: null,
    predictID: null,
    activeTabIndex: null,
    selectedChannel: "TCI"
  },
  mutations: {
    SET_SELECTED_GEOM (state, payload)  {
      state.selectedGeom = payload
    },
    SET_CLOUD_MASK (state, payload)  {
      state.cloudMaskGeoJSON = payload
    },
    SET_PREDICT (state, payload)  {
      state.predictedGeoJSON = payload
    },
    SET_PREDICT_ID (state, payload)  {
      state.predictID = payload
    },
    SET_ACTIVE_TAB_INDEX (state, payload)  {
      state.activeTabIndex = payload
    },
    SET_SELECTED_CHANNEL (state, payload)  {
      state.selectedChannel = payload
    }
  },
  actions: {
    LOAD_CLOUD_MASK: async ({ commit }, cloudmaskID) => {
      if (cloudmaskID){
        await fetch(`${process.env.VUE_APP_API_BASE}/cloudmask/${cloudmaskID}`)
        .then(response => { return response.json()})
        .then(data => {
          commit('SET_CLOUD_MASK', data)
        })
        return
      }
      commit('SET_CLOUD_MASK', null)
    },
    LOAD_PREDICT: async ({ commit }, predictID) => {
      if (predictID){
        await fetch(`${process.env.VUE_APP_API_BASE}/predict/${predictID}`)
        .then(response => { return response.json()})
        .then(data => {
          commit('SET_PREDICT', data)
          commit('SET_PREDICT_ID', predictID)
        })
        return
      }
      commit('SET_PREDICT', null)
      commit('SET_PREDICT_ID', null)
    },
    RUN_PREDICT: async ({ commit }, data) => {
      await fetch(`${process.env.VUE_APP_API_BASE}/makepredict?oldImg=${data.oldImg}&newImg=${data.newImg}`)
        .then(response => { return response.json()})
        .then(data => {
          commit('PREDICT_END', data)
        })
        return
    },
    RUN_MAKE_CLOUD_MASK: async ({ commit }, imgID) => {
      await fetch(`${process.env.VUE_APP_API_BASE}/makecloudmask/${imgID}`)
        .then(response => { return response.json()})
        .then(data => {
          commit('PREDICT_END', data)
        })
        return
    }
  }
})
