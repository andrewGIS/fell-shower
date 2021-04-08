import Vue from 'vue'
import Vuex from 'vuex'
import 'leaflet/dist/leaflet.css';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedGeom: {type:"Null"}
  },
  mutations: {
    SET_SELECTED_GEOM (state, payload)  {
      state.selectedGeom = payload
    }
  },
  actions: {
  }
})
