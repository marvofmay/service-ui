import { defineStore } from 'pinia'
import api from "@/api/Movies/config";

export const moviesStore = defineStore('moviesStore', {
    state: () => ({
        movies: [],
        filter: 'all', //active, inactive, all
    }),
    getters: {
        allMovies (state) {
            return state.movies;
        },
        filterOption(state) {
            return state.filter;
        },
    },
    actions: {
        setMovies(movies) {
            this.movies = movies;
        },
        setFilterOption(newFilterOption) {
            this.filter = newFilterOption;
        },
        async fetchMoviesFromDB(queryParams) {
            return await api.get('movies' + queryParams);
        },
        async addMovieToDB(payload) {
            return await api.post('movies', payload)
        },
        async updateMovieInDB (payload) {
            return await api.put('movies/'  + payload.uuid, payload)
        },
        async toggleMovieActiveInDB(movieUUID) {
            return await api.patch(`movies/${movieUUID}/toggle-active` , {'uuid': movieUUID});
        },
        async deleteMovieInDB(movieUUID){
            return await api.delete('movies/' + movieUUID);
        },
        async restoreDeletedMovieInDB(movieUUID) {
            return await api.patch(`movies/${movieUUID}/restore-deleted`, {'uuid': movieUUID});
        },
    },
})