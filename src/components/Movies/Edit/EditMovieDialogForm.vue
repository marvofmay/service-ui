<script>
  import {mapActions, mapState} from 'pinia'
  import { moviesStore } from '@/stores/movies.js'

  export default {
    components: {

    },
    props: {
      movie: Object,
      filterMovies: Function,
    },
    data: () => ({
      updateMovieErrorMessage: null,
      dialog: false,
    }),
    methods: {
      ...mapActions(moviesStore, ['updateMovieInDB']),
      updateMovieData () {
        const payload = {};
        const responseMovieToUpdate = this.updateUserInDB(payload);

        responseMovieToUpdate.then(resolve => {
              this.dialog = false;
              this.$emit('afterClickedUpdate', 'success', resolve.data.message, true);
            })
            .catch(error => {
              const errors = error.response.data.errors.map(item => {
                return `${item.message} - ${item.context.field}`;
              });
              this.$emit('afterClickedUpdate', 'error', errors, true);
            });
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
      <template v-slot:activator="{ props }" >
        <v-btn density="compact" icon="mdi-pencil" v-bind="props" color="warning" class="ml-3"></v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit user profile</span>
          <span v-if="updateMovieErrorMessage">
            <v-alert v-for="(error, index) in updateMovieErrorMessage" :key="index" type="error">{{ error.message }}</v-alert>
          </span>
        </v-card-title>
        <v-card-text>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="error"
              variant=elevated
              @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
              color="success"
              variant="elevated"
              @click="updateMovieData()"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
