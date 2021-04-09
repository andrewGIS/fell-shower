import Vue from 'vue'
import Vuex from 'vuex'
import 'leaflet/dist/leaflet.css';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedGeom: {type:"Null"},
    cloudMaskGeoJSON: null,
    predictedGeoJSON: null
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
        })
        return
      }
      commit('SET_PREDICT', null)
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
