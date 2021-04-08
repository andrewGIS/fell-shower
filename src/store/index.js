import Vue from 'vue'
import Vuex from 'vuex'
import 'leaflet/dist/leaflet.css';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedGeom: {type:"Null"},
    cloudMaskGeoJSON: null
  },
  mutations: {
    SET_SELECTED_GEOM (state, payload)  {
      state.selectedGeom = payload
    },
    SET_CLOUD_MASK (state, payload)  {
      state.cloudMaskGeoJSON = payload
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
  }
})
