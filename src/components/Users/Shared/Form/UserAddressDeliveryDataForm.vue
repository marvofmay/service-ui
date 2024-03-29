<script>
  export default {
    props: {
      user: Object,
    },
  }
</script>

<template>
  <v-card-text>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field v-model="user.addresses.delivery.street" label="Street*" ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="user.addresses.delivery.postcode" label="Postcode*" persistent-hint ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-autocomplete
              v-model="user.addresses.delivery.city"
              :items="['Warszawa', 'Gdańsk', 'Sopot']"
              label="City*"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6">
          <v-autocomplete
              v-model="user.addresses.delivery.country"
              :items="['Poland', 'USA', 'Germany', 'Belgium']"
              label="Country*"
          >
          </v-autocomplete>
        </v-col>
      </v-row>
    </v-container>
    <small>*indicates required field</small>
  </v-card-text>
</template>