<script>
  import { RouterView } from 'vue-router';
  import NavigationSite from "@/components/Router/NavigationSite.vue";
  import { mapActions } from "pinia";
  import { usersStore } from "@/stores/users";
export default {
  components: {
    RouterView,
    NavigationSite,
  },
  created() {
    this.setLogged(localStorage.getItem("isUserLoggedToApplication") === 'true');
    this.setToken(localStorage.getItem("tokenApplication"));
    this.setLoggedUser(JSON.parse(localStorage.getItem("userLoggedInApplication")));
  },
  methods: {
    ...mapActions(usersStore, ['setToken']),
    ...mapActions(usersStore, ['setLogged']),
    ...mapActions(usersStore, ['setLoggedUser']),
  }
}
</script>

<template>
  <v-card>
    <v-layout>
        <NavigationSite />
        <v-main style="height: 900px">
          <RouterView />
        </v-main>
    </v-layout>
  </v-card>
</template>