<script>
  export default {
    props: {
      residence: Object,
    },
  }
</script>

<template>
  <v-card-text>
    <v-container>
      <v-row>
        <v-col v-if="residence" cols="12" sm="6">
          {{ residence.street }}
          <br />
          {{ residence.postcode }} {{ residence.city }}
          <br />
          {{ residence.country }}
        </v-col>
        <v-col v-else cols="12" sm="6">
         no residence address data
        </v-col>
      </v-row>
    </v-container>
  </v-card-text>
</template>