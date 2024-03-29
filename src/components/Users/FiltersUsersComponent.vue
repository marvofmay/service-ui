<script>
  export default {
    props: {
      filter: String,
      filterUsers: Function,
    },
  }
</script>

<template>
  <v-radio-group
      :value="filter"
      inline
      @change="filterUsers"
  >
    <v-radio label="Active" value="active"></v-radio>
    <v-radio label="Inactive" value="inactive"></v-radio>
    <v-radio label="Deleted" value="deleted"></v-radio>
    <v-radio label="Not deleted" value="notdeleted"></v-radio>
    <v-radio label="All" value="all"></v-radio>
  </v-radio-group>
</template>