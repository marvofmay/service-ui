<script setup>
    import SettingsComponent from "@/components/Settings/SettingsComponent.vue";
    import { usersStore } from '@/stores/users.js'

    const userStore = usersStore();
    const isLoggedIsAdmin = () => userStore.isAdmin() && userStore.getLogged();

</script>

<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="text-center">Settings</v-toolbar-title>
    </v-app-bar>
    <v-container class="mt-15" :fluid=true>
      <SettingsComponent v-if="isLoggedIsAdmin" />
    </v-container>
  </v-app>
</template>