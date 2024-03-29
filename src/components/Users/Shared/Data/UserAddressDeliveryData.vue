<script>
  export default {
    props: {
      delivery: Object,
    },
  }
</script>

<template>
  <v-card-text>
    <v-container>
      <v-row>
        <v-col v-if="delivery" cols="12" sm="6">
          {{ delivery?.street }}
          <br />
          {{ delivery?.postcode }} {{ delivery?.city }}
          <br />
          {{ delivery?.country }}
        </v-col>
        <v-col v-else cols="12" sm="6">
          no delivery address data
        </v-col>
      </v-row>
    </v-container>
  </v-card-text>
</template>