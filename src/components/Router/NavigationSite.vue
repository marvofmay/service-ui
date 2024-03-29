<script>
  import LoggedUserDialog from "@/components/LoggedUser/LoggedUserDialog.vue";
  import {mapState} from "pinia";
  import {usersStore} from "@/stores/users";

  export default {
    components: {
      LoggedUserDialog
    },
    data: () => ({
      openLoggedUserDialog: false,
    }),
    computed: {
      ...mapState(usersStore, ['getLoggedUser']),
      ...mapState(usersStore, ['getLogged']),
      ...mapState(usersStore, ['isAdmin']),
    },
    methods: {
      changeStatusDialog () {
        this.openLoggedUserDialog = ! this.openLoggedUserDialog;
      }
    }
  }
</script>

<template>
  <LoggedUserDialog
      @closeDialog="changeStatusDialog"
      :openLoggedUserDialog="openLoggedUserDialog"
  />
  <v-navigation-drawer expand-on-hover rail>
    <v-list v-if="getLogged">
      <v-list-item
          :prepend-avatar="getLoggedUser?.avatar ?? 'https://randomuser.me/api/portraits/men/85.jpg'"
          :title= "`${getLoggedUser?.firstName} ${getLoggedUser?.lastName}`"
          :subtitle="getLoggedUser?.email"
          @click.prevent="changeStatusDialog"
      >
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-home" title="Home" value="home" to="/" ></v-list-item>
      <v-list-item prepend-icon="mdi-information" title="About" value="about" to="/about" ></v-list-item>
      <v-list-item v-if="getLogged" prepend-icon="mdi-account-multiple" title="Users" value="users" to="/users"></v-list-item>
      <v-list-item v-if="getLogged" prepend-icon="mdi-movie" title="Movies" value="movies" to="/movies"></v-list-item>
      <v-list-item v-if="getLogged && isAdmin" prepend-icon="mdi-cogs" title="Settings" value="settings" to="/settings"></v-list-item>
      <v-list-item
          v-if="! getLogged"
          prepend-icon="mdi-login"
          title="Login"
          value="login"
          to="/login"
      >
      </v-list-item>
      <v-list-item v-else prepend-icon="mdi-logout" title="Logout" value="logout" to="/logout"></v-list-item>
      <v-list-item v-if="! getLogged" prepend-icon="mdi-account-plus" title="Register" value="register" to="/register"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>