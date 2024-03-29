<script setup>
import MoviesMainComponent from "@/components/Movies/MoviesMainComponent.vue";
</script>

<script>
  import { mapState } from 'pinia'
  import { usersStore } from '@/stores/users.js'

  export default {
    computed: {
      ...mapState(usersStore, ['getLogged']),
    },
  }
</script>

<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="text-center">Movies</v-toolbar-title>
    </v-app-bar>
    <v-container class="mt-15" :fluid=true>
      <MoviesMainComponent v-if="getLogged" />
      <v-alert v-else type="warning">Only for logged users.</v-alert>
    </v-container>
  </v-app>
</template>