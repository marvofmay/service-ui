<script>

export default {
  props: {
      user: Object,
      restoreDeletedUser: Function,
  },
}
</script>

<template>
  <v-btn
      @click="restoreDeletedUser(user)"
      icon="mdi-delete-restore"
      class="ml-1 btn-restore-deleted"
      color="success"
  />
</template>

<style>
.btn-restore-deleted {
  width: calc(var(--v-btn-height) + -6px) !important;
  height: calc(var(--v-btn-height) + -6px) !important;
}
</style>