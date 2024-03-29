<script setup>
  import { usersStore } from '@/stores/users.js'

  const emit = defineEmits(["changeLoggedValueAfterSuccessLogged"]);
  const userStore = usersStore();

  userStore.setToken(null);
  userStore.setLogged(false);
  userStore.setLoggedUser('');

  localStorage.removeItem("isUserLoggedToApplication");
  localStorage.removeItem("tokenApplication");
  localStorage.removeItem("userLoggedInApplication");

  emit('changeLoggedValueAfterSuccessLogged');

</script>

<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="text-center">Logout</v-toolbar-title>
    </v-app-bar>
    <v-container class="mt-15">
        <v-card class="mx-auto px-10 py-10" max-width="544">
          <v-alert type="info">You have just been logged out.</v-alert>
        </v-card>
    </v-container>
  </v-app>
</template>
