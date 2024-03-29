<script>
  import { mapActions, mapState } from "pinia";
  import { moviesStore } from "@/stores/movies";
  export default {
    props: {
      movie: Object,
      filterMovies: Function,
    },
    computed: {
      ...mapState(moviesStore, ['filterOption']),
    },
    data: () => ({
      dialog: false,
      isValid: false,
      isLoading: false,
      title: '',
      categories: [],
      categoriesItems: ['comedy', 'drama', 'action'],
      active: 'yes',
      rules: {
        length: len => v => (v || '').length >= len || `Invalid character length, required ${len}`,
        required: v => !!v || 'This field is required',
      },
    }),
    methods: {
      ...mapActions(moviesStore, ['setFilterOption']),
      ...mapActions(moviesStore, ['addMovieToDB']),
      reset () {
        this.$refs.form.reset()
        this.active = 'yes';
      },
      submitNewMovieFormData () {
        this.isLoading = true;
        this.setFilterOption(this.active === 'yes' ? 'active' : 'inactive');
        const payload = {movies: [{
            title: this.title,
            active: this.active === 'yes',
            categories: [...this.categories]
          }]
        };

        const responseAddMovieToDB = this.addMovieToDB(payload);
        responseAddMovieToDB.then(resolve => {
          this.dialog = false;
          this.isLoading = false;
          this.filterMovies();
          this.$emit('afterClickedSave', 'success', resolve.data.message, true);
        })
        .catch(error => {
          this.isLoading = false;
          const errors = error.response.data.errors.map(item => {
            return `${item.message} - ${item.context.field}`;
          });
          this.$emit('afterClickedSave', 'error', errors.join(', '), true, 10000);
        });
      },
    }
  }
</script>

<template>
    <v-dialog
        v-model="dialog"
        persistent
        width="1024"
    >
      <template v-slot:activator="{ props }">
        <v-btn
            color="success"
            v-bind="props"
            class="float-right"
        >
          add movie
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Add new movie</span>
        </v-card-title>
        <v-card-text>

          <v-form
              ref="form"
              v-model="isValid"
              class="pa-4 pt-6"
              @submit.prevent
          >
            <v-text-field
                v-model="title"
                :rules="[rules.required, rules.length(2)]"
                variant="filled"
                color="black"
                counter="6"
                label="Movie title"
                style="min-height: 96px"
                type="text"
            ></v-text-field>
            <v-select
                v-model="categories"
                :items="categoriesItems"
                chips
                label="Categories:"
                multiple
            ></v-select>
            <v-switch
                v-model="active"
                hide-details
                true-value="yes"
                false-value="no"
                :label="`Active: ${active}`"
            ></v-switch>
          </v-form>

        </v-card-text>
        <v-card-actions>
          <v-btn
              color="info"
              variant="elevated"
              @click="reset()"
          >
            Clear
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              color="error"
              variant="elevated"
              @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
              :disabled="!isValid"
              :loading="isLoading"
              color="success"
              variant="elevated"
              @click="submitNewMovieFormData()"
          >
            Save movie
            <v-icon icon="mdi-content-save" end></v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>