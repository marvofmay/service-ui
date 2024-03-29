<script>
  import { mapActions } from "pinia";
  import { moviesStore } from "@/stores/movies";
  export default {
    props: {
      movie: Object,
      filterMovies: Function,
    },
    data: () => ({
      dialog: false,
    }),
    methods: {
      ...mapActions(moviesStore, ['deleteMovieInDB']),
      deleteMovie() {
        const responseDeleteMovie = this.deleteMovieInDB(this.movie.uuid);
        responseDeleteMovie.then(resolve => {
          this.dialog = false;
          this.filterMovies();
          this.$emit('afterClickedDelete', 'success', resolve.data.message, true);
        })
        .catch(error => {
          this.$emit('afterClickedDelete', 'error', error.response.data.errors, true);
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
        <span class="text-h5">Are you sure, that You want to delete movie:</span>
        <span class="pl-5">{{ movie.title }}</span>
      </v-card-title>
      <v-card-text />
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
            @click="this.deleteMovie()"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
