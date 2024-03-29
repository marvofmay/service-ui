<script>
import { mapState } from 'pinia'
import { usersStore } from '@/stores/users.js'

export default {
  props: {
    openLoggedUserDialog: Boolean,
  },
  computed: {
    ...mapState(usersStore, ['getLoggedUser']),
  },
  data: () => ({
    dialog: false,
  }),
  watch: {
    openLoggedUserDialog(newValue) {
      this.dialog = newValue;
    },
  },
  methods: {
    closeLoggedUserDialog() {
      this.$emit('closeLoggedUserDialog');
    },
  }
}
</script>
<template>
  <v-row>
    <v-col cols="12" sm="12">
      <p>{{ getLoggedUser.firstName }} {{ getLoggedUser.lastName }}</p>
      <p>{{ getLoggedUser.email }}</p>
      <p>{{ getLoggedUser.phone }}</p>
    </v-col>
  </v-row>
</template>

<style scoped>

</style>