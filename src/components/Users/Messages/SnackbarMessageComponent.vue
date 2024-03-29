<script>
export default {
  props: {
    snackbar: Object,
  }
}
</script>

<template>
  <v-snackbar
      location="top right"
      :value="snackbar.showMessage"
      :timeout="snackbar.timeOut"
      :color="snackbar.typeMessage"
  >
    <p><strong> {{ snackbar.typeMessage === 'success' ? 'Success :)' : 'Uppss... :(' }}</strong></p>
    <p class="pt-1">{{ snackbar.textMessage }}</p>
    <v-btn
        dark
        class="float-right"
        variant="tonal"
        @click="$emit('hideSnackbar')"
    >
      Close
    </v-btn>
  </v-snackbar>
</template>