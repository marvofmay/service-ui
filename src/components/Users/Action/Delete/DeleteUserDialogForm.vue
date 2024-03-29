<script>
  import {mapActions, mapState} from "pinia";
  import {usersStore} from "@/stores/users";
  export default {
    props: {
      user: Object,
      filterUsers: Function,
    },
    computed: {
      ...mapState(usersStore, ['allUsers']),
    },
    data: () => ({
      dialog: false,
    }),
    methods: {
      ...mapActions(usersStore, ['updateUser']),
      ...mapActions(usersStore, ['deleteUserInDB']),
      ...mapActions(usersStore, ['getUserFromDB']),
      deleteUser() {
        const responseDeleteUser = this.deleteUserInDB(this.user.uuid);

        responseDeleteUser.then(resolve => {
          this.users = this.allUsers;
          this.filterUsers();
          this.$emit('clickedDelete', 'success', resolve.data.message);
          const responseGetUser = this.getUserFromDB(this.user.uuid);

          responseGetUser.then(resolve => {
            this.users = this.allUsers;
            this.updateUser(resolve.data.data).then(() => {
              this.filterUsers();
            }).catch(error => {
                this.$emit('clickedDelete', 'error', error);
            });
          })
          .catch(error => {
            this.$emit('clickedDelete', 'error', error.response.data.errors);
          })
        })
        .catch(error => {
          this.$emit('clickedDelete', 'error', error.response.data.errors);
        })
      },
    },
  }
</script>

<template>
  <v-dialog
      v-model="dialog"
      persistent
      width="1024"
  >
    <template v-slot:activator="{ props }">
      <v-btn density="compact" icon="mdi-delete" v-bind="props" color="error" class="ml-3"></v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Are you sure, that You want to delete user:</span>
        <span class="pl-5">{{ user.firstName }} {{ user.lastName }}</span>
      </v-card-title>
      <v-card-text>

      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="error"
            variant="elevated"
            @click="dialog = false"
        >
          Close
        </v-btn>
        <v-btn
            color="success"
            variant="elevated"
            @click="this.deleteUser()"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
