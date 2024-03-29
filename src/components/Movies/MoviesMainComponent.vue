<script>
  import { mapActions, mapState } from 'pinia'
  import { moviesStore } from '@/stores/movies.js'
  import { usersStore } from '@/stores/users.js'
  import AddMovieDialogForm from "@/components/Movies/Add/AddMovieDialogForm.vue";
  import DeleteMovieDialogForm from "@/components/Movies/Delete/DeleteMovieDialogForm.vue";
  import RestoreMovieDialogForm from "@/components/Movies/Restore/RestoreMovieDialogForm.vue";
  import EditMovieDialogForm from "@/components/Movies/Edit/EditMovieDialogForm.vue";

  export default {
    components: {
      AddMovieDialogForm,
      EditMovieDialogForm,
      DeleteMovieDialogForm,
      RestoreMovieDialogForm,
    },
    computed: {
      ...mapState(usersStore, ['loggedUser']),
      ...mapState(usersStore, ['isAdmin']),
      ...mapState(moviesStore, ['allMovies']),
      ...mapState(moviesStore, ['filterOption']),
    },
    data: () => ({
      currentPage: 1,
      numberOfPages: 0,
      limit: 10,
      filter: null,
      phraseToSearch: null,
      queryParams: '',
      movies: [],
      totalMovies: 0,
      isLoadingDataMovies: true,
      errorMessage: null,
      snackbar: {
        typeMessage: null,
        textMessage: null,
        showMessage: null,
        timeOut: null,
      },
      loadingSearchbar: false,
    }),
    watch: {
      filter(newOption) {
        this.setFilterOption(newOption);
        this.currentPage = 1;
        console.log('watch: ', this.filter);
      },
      totalMovies() {
        if (this.totalMovies > 0) {
          this.numberOfPages = parseInt(Math.ceil(this.totalMovies / this.limit));
        }
      },
    },
    mounted() {
      this.fetchMovies();
      this.filter = this.filterOption;
    },
    methods: {
      ...mapActions(moviesStore, ['fetchMoviesFromDB']),
      ...mapActions(moviesStore, ['toggleMovieActiveInDB']),
      ...mapActions(moviesStore, ['setMovies']),
      ...mapActions(moviesStore, ['setFilterOption']),
      async filterMovies() {
        this.filter = this.filterOption;
        await this.prepareQueryParams();
        await this.fetchMovies();
      },
      async pagePaginationClick () {
        await this.prepareQueryParams();
        await this.fetchMovies();
      },
      async fetchMovies() {
        await this.prepareQueryParams();
        const responseFetchMoviesFromDB = this.fetchMoviesFromDB(this.queryParams);

        responseFetchMoviesFromDB.then((response) => {
          this.errorMessage = null;
          this.totalMovies = response.data.data.totalMovies;
          this.limit = response.data.data.limit;
          this.movies = response.data.data.movies;
          this.setMovies(this.movies);
          this.filter = this.filterOption;
          this.isLoadingDataMovies = false;
        })
        .catch((error) => {
          this.isLoadingDataMovies = false;
          this.errorMessage = error.message;
        });
      },
      async searchByPhrase () {
        this.currentPage = 1;
        this.loadingSearchbar = true;
        await this.fetchMovies();
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
      toggleMovieActive (movie) {
        const responseToggleMovieActiveInDB = this.toggleMovieActiveInDB(movie.uuid);

        responseToggleMovieActiveInDB.then((resolve) => {
          this.dialog = false;
          movie.active = ! movie.active;
          this.filterMovies();
          this.showSnackbar('success', resolve.data.message, true);
        })
        .catch(error => {
          this.showSnackbar('error', error.response.data.errors, true);
        });
      },
      showSnackbar (type, text, show, timeOut = 2000) {
        this.snackbar.typeMessage = type;
        this.snackbar.textMessage = text;
        this.snackbar.showMessage = show;
        this.snackbar.timeOut = timeOut;
      }
    },
  }
</script>

<template>
  <v-container v-if="isLoadingDataMovies" class="mx-auto">
    <v-row>
      <v-alert type="info" >Movies data loading ...</v-alert>
    </v-row>
  </v-container>

  <v-container v-if="errorMessage" class="mx-auto" >
    <v-row>
      <v-alert type="error" >{{ errorMessage }}</v-alert>
    </v-row>
  </v-container>

  <v-snackbar
      location="top right"
      v-model="snackbar.showMessage"
      :timeout="snackbar.timeOut"
      :color="snackbar.typeMessage"
  >
    <p><strong> {{ snackbar.typeMessage === 'success' ? 'Success :)' : 'Uppss... :(' }}</strong></p>
    <p class="pt-1">{{ snackbar.textMessage }}</p>
    <v-btn dark class="float-right" variant="tonal" @click="snackbar.showMessage = false">Close</v-btn>
  </v-snackbar>

  <v-container v-if="! isLoadingDataMovies && movies" class="mx-auto" fluid >
    <v-row>
      <v-col cols="9">
        <v-radio-group
            v-model="filter"
            inline
            @change="filterMovies()"
        >
          <v-radio
              label="Active"
              value="active"
          ></v-radio>
          <v-radio
              label="Inactive"
              value="inactive"
          ></v-radio>
          <v-radio
              label="Deleted"
              value="deleted"
          ></v-radio>
          <v-radio
              label="Not deleted"
              value="notdeleted"
          ></v-radio>
          <v-radio
              label="All"
              value="all"
          ></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="3" >
        <AddMovieDialogForm
            v-if="isAdmin"
            :filterMovies="filterMovies"
            @afterClickedSave="showSnackbar"
        />
      </v-col>
    </v-row>
  </v-container>

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

  <v-row>
    <v-col cols="12">
      <v-table density="compact">
        <thead>
        <tr>
          <th class="text-left">#</th>
          <th class="text-left">Title</th>
          <th class="text-left">Categories</th>
          <th class="text-left">Active</th>
          <th class="text-left">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(movie, index) in movies" :key="index" >
          <td>{{ (this.currentPage - 1) * this.limit + index + 1 }}</td>
          <td>{{ movie.title }}</td>
          <td>{{ movie.categories ? movie.categories.join(', ') : '---' }}</td>
          <td v-if="filterOption !== 'deleted'" @click="isAdmin ? toggleMovieActive(movie): null">
            <v-btn v-if="isAdmin && movie.active" density="compact" icon="mdi-check-circle-outline" color="success"></v-btn>
            <v-btn v-if="isAdmin && ! movie.active" density="compact" icon="mdi-radiobox-blank"></v-btn>
            <v-icon v-if="! isAdmin && movie.active" icon="mdi-check-circle-outline" color="success"/>
            <v-icon v-if="! isAdmin && ! movie.active" icon="mdi-radiobox-blank" />
          </td>
          <td>
            <EditMovieDialogForm
                v-if="isAdmin"
                :movie="movie"
                :filterMovies="filterMovies"
                @afterClickedUpdate="showSnackbar"
            />
            <DeleteMovieDialogForm
                v-if="isAdmin && ! movie.deletedAt"
                :movie="movie"
                :filterMovies="filterMovies"
                @afterClickedDelete="showSnackbar"
            />
            <RestoreMovieDialogForm
                v-if="isAdmin && movie.deletedAt"
                :movie="movie"
                :filterMovies="filterMovies"
                @afterClickedRestore="showSnackbar"
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

</template>
<style>
  table {
    font-size: 12px;
  }
</style>