import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

// socket io
//import * as io from "socket.io-client";
//import VueSocketIO from "vue-socket.io";
// Vue.use(
//   new VueSocketIO({
//     debug: true,
//     connection: io('http://127.0.0.1:5000'), // options object is Optional
//   })
// );

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
