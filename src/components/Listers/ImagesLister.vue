<template>
  <v-container>
    <v-checkbox
      v-for="img in images"
      :key="img"
      :label="img"
      v-model="selectedImages"
      :value="img"
    >
    </v-checkbox>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    images: [],
    selectedImages: []
  }),
  methods: {
    getImageList() {
      console.log(process.env.API_BASE);
      fetch("http://127.0.0.1:5000/images")
        .then(resp => resp.json())
        .then(data => (this.images = data.images))
        .catch(error => console.log(error));
    }
  },
  mounted() {
    this.images = this.getImageList();
  }
};
</script>

<style>
</style>