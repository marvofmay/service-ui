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
          <v-text-field v-model="user.addresses.residence.street" :rules="user.streetRules" label="Street*" ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="user.addresses.residence.postcode" :rules="user.postcodeRules" label="Postcode*" persistent-hint ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-autocomplete
              v-model="user.addresses.residence.city"
              :items="['Warszawa', 'Gdańsk', 'Sopot']"
              label="City*"
              :rules="user.cityRules"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6">
          <v-autocomplete
              v-model="user.addresses.residence.country"
              :items="['Poland', 'USA', 'Germany', 'Belgium']"
              label="Country*"
              :rules="user.countryRules"
          >
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-checkbox
            v-model="user.deliveryAddressSameAsResidence"
            label="Deliver address is the same as residence address."
        ></v-checkbox>
      </v-row>
    </v-container>
    <small>*indicates required field</small>
  </v-card-text>
</template>