<template>
  <v-container>
    <v-card :loading="loadingCard" :disabled="loadingCard" flat>
    <v-checkbox
      v-for="predict in predicts"
      :key="predict"
      :label="beautifyName(predict)"
      v-model="selectedPredict"
      :value="predict"
    >
    </v-checkbox>
    </v-card>
  </v-container>
</template>

<script>
import {mapActions, mapMutations} from 'vuex'
export default {
  data: () => ({
    predicts: [],
    selectedPredict: null,
    loadingCard: false
  }),
  methods: {
    ...mapMutations({setSelectedGeom:'SET_SELECTED_GEOM'}),
    ...mapActions({setActivePredict: 'LOAD_PREDICT'}),
    getPredictList() {
      fetch(`${process.env.VUE_APP_API_BASE}/predicts`)
        .then(resp => resp.json())
        .then(data => this.predicts = data.predicts)
        .catch(error => console.log(error));
    },
    beautifyName(name){
        /**
         * Transfrom name of geojson ("S2A_MSIL1C_20180901T073611_N0206_R092_T40VEL_
         * 20180901T091932.SAFE_S2B_MSIL1C_20190203T074129_N0207_R092_T40VEL_20190203T093456.SAFE.geojson")
         * to date before date after
         */
        let splitted = name.split("_")
        return `${splitted[2]}_${splitted[9]}`
    }
  },
  mounted() {
    this.predicts = this.getPredictList()
  },
  watch:{
    selectedPredict: async function(selectedPredict){
      this.loadingCard = true;
        await this.setActivePredict(selectedPredict);
        if (selectedPredict === null){
          this.setSelectedGeom(null);
        }
      this.loadingCard = false;
    }
  }
};
</script>