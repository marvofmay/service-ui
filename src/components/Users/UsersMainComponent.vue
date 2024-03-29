<script setup>
    import AddUserDialogForm from "@/components/Users/Action/Add/AddUserDialogForm.vue";
    import EditUserDialogForm from "@/components/Users/Action/Edit/EditUserDialogForm.vue";
    import InfoUserDialog from "@/components/Users/Action/Info/InfoUserDialog.vue";
    import DeleteUserDialogForm from "@/components/Users/Action/Delete/DeleteUserDialogForm.vue"
    import RestoreDeletedUser from "@/components/Users/Action/Restore/RestoreDeletedUser.vue"
    import FiltersUsersComponent from "@/components/Users/FiltersUsersComponent.vue";
    import LoadingDataUsersMessageComponent from "@/components/Users/Messages/LoadingDataUsersMessageComponent.vue";
    import NoUsersDataMessageComponent from "@/components/Users/Messages/NoUsersDataMessageComponent.vue";
    import ErrorMessageComponent from "@/components/Users/Messages/ErrorMessageComponent.vue";
    import SnackbarMessageComponent from "@/components/Users/Messages/SnackbarMessageComponent.vue";
    import moment from "moment";
</script>
<script>
  import { mapState, mapActions } from 'pinia'
  import { usersStore } from '@/stores/users.js'

  export default {
    computed: {
      ...mapState(usersStore, ['filterOption']),
      ...mapState(usersStore, ['allUsers']),
      ...mapState(usersStore, ['loggedUser']),
      ...mapState(usersStore, ['isAdmin']),
    },
    data: () => ({
      currentPage: 1,
      numberOfPages: 0,
      limit: 10,
      filter: null,
      phraseToSearch: null,
      queryParams: '',
      users: [],
      totalUsers: 0,
      isLoadingDataUsers: true,
      errorMessage: null,
      snackbar: {
        typeMessage: null,
        textMessage: null,
        showMessage: null,
        timeOut: null,
      },
      loadingSearchbar: false,
    }),
    mounted() {
      this.fetchUsers();
    },
    watch: {
      filter(newOption) {
        this.setFilterOption(newOption);
        this.currentPage = 1;
      },
      totalUsers(newValue) {
        if (this.totalUsers >= 0) {
          this.numberOfPages = parseInt(Math.ceil(newValue / this.limit));
        }
      },
    },
    methods: {
      //...mapActions(usersStore, ['setUsers']),
      ...mapActions(usersStore, ['setFilterOption']),
      ...mapActions(usersStore, ['updateUser']),
      ...mapActions(usersStore, ['toggleUserActiveInDB']),
      ...mapActions(usersStore, ['fetchUsersFromDB']),
      ...mapActions(usersStore, ['deleteUserInDB']),
      ...mapActions(usersStore, ['restoreDeletedUserInDB']),
      async filterUsers() {
        this.filter = this.filterOption;
        await this.prepareQueryParams();
        await this.fetchUsers();
      },
      async fetchUsers() {
        await this.prepareQueryParams();
        const responseFetchUsersFromDB = this.fetchUsersFromDB(this.queryParams);

        responseFetchUsersFromDB.then((response) => {
          this.errorMessage = null;
          this.totalUsers = response.data.data.totalUsers;
          this.limit = response.data.data.limit;
          this.users = response.data.data.users;
          //this.setUsers(this.users);
          this.filter = this.filterOption;
          this.isLoadingDataUsers = false;
        })
        .catch((error) => {
          this.isLoadingDataUsers = false;
          this.errorMessage = error.message;
        });
      },
      toggleUserActive (user) {
        const responseToggleUserActiveInDB = this.toggleUserActiveInDB(user.uuid);

        responseToggleUserActiveInDB.then((resolve) => {
              this.dialog = false;
              user.active = ! user.active;
              this.showSnackbar('success', resolve.data.message);

              this.updateUser(user)
                  .then(() => {
                    this.users = this.allUsers;
                    this.filterUsers();
                  })
                  .catch(error => {
                    this.showSnackbar('error', error);
                  })
            })
            .catch(error => {
              this.showSnackbar('error', error.response.data.errors);
            });
      },
      restoreDeletedUser (user) {
        const responseRestoreDeletedUserInDB = this.restoreDeletedUserInDB(user.uuid);

        responseRestoreDeletedUserInDB.then(resolve => {
              this.dialog = false;
              user.deletedAt = null;
              this.showSnackbar('success', resolve.data.message);

              this.updateUser(user)
                  .then(() => {
                    this.users = this.allUsers;
                    this.filterUsers();
                  })
                  .catch(error => {
                    this.showSnackbar('error', error);
                  })
            })
            .catch(error => {
              this.showSnackbar('error', error.response.data.errors);
            });
      },
      async pagePaginationClick () {
        await this.prepareQueryParams();
        await this.fetchUsers();
      },
      async searchByPhrase () {
        this.currentPage = 1;
        this.loadingSearchbar = true;
        await this.fetchUsers();
        this.loadingSearchbar = false;
      },
      prepareQueryParams() {
        return new Promise((resolve) => {

          let phraseToSearch = this.phraseToSearch;

          if (phraseToSearch) {
            phraseToSearch = encodeURIComponent(phraseToSearch);
          }

          this.queryParams = `?page=${this.currentPage}&limit=${this.limit}`;
          this.queryParams = this.queryParams + (phraseToSearch ? `&phrase=${phraseToSearch}` : '');

          switch (this.filter) {
            case 'active':
              this.queryParams += `&active=1`;
              break;
            case 'inactive':
              this.queryParams += `&active=0`;
              break;
            case 'deleted':
              this.queryParams += `&deleted=1`;
              break;
            case 'notdeleted':
              this.queryParams += `&deleted=0`;
              break;
            }
            resolve();
        });
      },
      showSnackbar (type, text, timeOut = 2000) {
        this.snackbar.typeMessage = type;
        this.snackbar.textMessage = text;
        this.snackbar.showMessage = true;
        this.snackbar.timeOut = timeOut;
      },
      hideSnackbar() {
        this.snackbar.showMessage = false;
      }
    },
  }
</script>

<template>
  <LoadingDataUsersMessageComponent :isLoadingDataUsers="isLoadingDataUsers" />
  <NoUsersDataMessageComponent :isLoadingDataUsers="isLoadingDataUsers" :users="users" :errorMessage="errorMessage" />
  <ErrorMessageComponent :errorMessage="errorMessage" />
  <SnackbarMessageComponent :snackbar="snackbar" v-model="snackbar.showMessage" @hideSnackbar="hideSnackbar" />

  <v-container class="mx-auto" fluid >
    <v-row>
      <v-col cols="9">
        <FiltersUsersComponent v-model="filter" :filterUsers="filterUsers" />
      </v-col>
      <v-col cols="3" >
        <AddUserDialogForm v-if="isAdmin" :filterUsers="filterUsers" @clickedSave="showSnackbar" />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="5">
        <v-text-field
            :loading="loadingSearchbar"
            density="compact"
            variant="solo"
            label="search in table"
            append-inner-icon="mdi-magnify"
            single-line
            hide-details
            v-model="phraseToSearch"
            @click:append-inner="searchByPhrase"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row v-if="! isLoadingDataUsers && users.length > 0" >
      <v-col cols="12">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-left">#</th>
              <th class="text-left">FirstName</th>
              <th class="text-left">LastName</th>
              <th class="text-left">Phone</th>
              <th class="text-left">Email</th>
              <th class="text-left">Born on</th>
              <th class="text-left">Roles</th>
              <th class="text-left">Skills</th>
              <th class="text-left">Interests</th>
              <th v-if="filterOption !== 'deleted'" class="text-left">Active</th>
              <th class="text-left">Actions</th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="user.uuid" >
              <td>{{ (this.currentPage - 1) * this.limit + index + 1 }}</td>
              <td>{{ user.firstName }}</td>
              <td>{{ user.lastName }}</td>
              <td>{{ user.phone }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.bornOn ? moment(user.bornOn).format('YYYY-MM-DD') : '---' }}</td>
              <td>{{ user.roles.length > 0 ? user.roles.join(', ') : '---'}} </td>
              <td>{{ user.skills.length > 0 ? user.skills.join(', ') : '---'}} </td>
              <td>{{ user.interests.length > 0 ? user.interests.join(', ') : '---'}}</td>
              <td v-if="filterOption !== 'deleted'" @click="isAdmin ? toggleUserActive(user): null">
                <v-btn v-if="isAdmin && user.active && loggedUser.uuid !== user.uuid" density="compact" icon="mdi-check-circle-outline" color="success"></v-btn>
                <v-btn v-if="isAdmin && ! user.active && loggedUser.uuid !== user.uuid" density="compact" icon="mdi-radiobox-blank"></v-btn>
                <v-icon v-if="user.active && (! isAdmin || loggedUser.uuid === user.uuid)" icon="mdi-check-circle-outline" color="success"/>
                <v-icon v-if="! user.active && (! isAdmin || loggedUser.uuid === user.uuid)" icon="mdi-radiobox-blank" />
              </td>
              <td>
                    <InfoUserDialog :user="user"/>
                    <EditUserDialogForm
                        v-if="isAdmin"
                        :user="user"
                        :filterUsers="filterUsers"
                        action="editUser"
                        @clickedUpdate="showSnackbar"
                    />
                    <DeleteUserDialogForm
                        v-if="isAdmin && ! user.deletedAt && loggedUser.uuid !== user.uuid"
                        :user="user"
                        :filterUsers="filterUsers"
                        @clickedDelete="showSnackbar"
                    />
                    <RestoreDeletedUser
                        v-if="isAdmin && user.deletedAt"
                        :user="user"
                        :restoreDeletedUser="restoreDeletedUser"
                    />
             </td>
           </tr>
         </tbody>
        </v-table>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="8">
        <v-container class="max-width">
          <v-pagination
              v-model="currentPage"
              class="my-4"
              :length="numberOfPages"
              @update:model-value="pagePaginationClick"
          ></v-pagination>
        </v-container>
      </v-col>
    </v-row>
 </v-container>
</template>
<style>
  table {
    font-size: 12px;
  }
</style>