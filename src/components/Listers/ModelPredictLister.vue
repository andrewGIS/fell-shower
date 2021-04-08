<template>
  <v-container>
    <v-checkbox
      v-for="predict in predicts"
      :key="predict"
      :label="beautifyName(predict)"
      v-model="selectedPredict"
      :value="predict"
    >
    </v-checkbox>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    predicts: [],
    selectedPredict: null
  }),
  methods: {
    getPredictList() {
      console.log(process.env.API_BASE);
      fetch("http://127.0.0.1:5000/predicts")
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
  }
};
</script>