<script setup>
    import UsersMainComponent from '../components/Users/UsersMainComponent.vue'
</script>
<script>
  import { mapState } from 'pinia'
  import { usersStore } from '@/stores/users.js'

  export default {
    computed: {
      ...mapState(usersStore, ['getToken']),
      ...mapState(usersStore, ['getLogged']),
      ...mapState(usersStore, ['getLoggedUser']),
    },
  }
</script>

<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="text-center">Users</v-toolbar-title>
    </v-app-bar>
    <v-container class="mt-15" :fluid=true>
      <UsersMainComponent v-if="getLogged" />
      <v-alert v-else type="warning">Only for logged users.</v-alert>
    </v-container>
  </v-app>
</template>