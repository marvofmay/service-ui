<script setup>
  import { defineProps } from 'vue';

  const props = defineProps({
    isLoadingDataUsers: Boolean,
    users: Object,
    errorMessage: String,
  });
</script>

<template>
  <v-container v-if="! props.isLoadingDataUsers && props.users.length === 0 && ! props.errorMessage" class="mx-auto">
    <v-row>
      <v-alert type="info" >No users data</v-alert>
    </v-row>
  </v-container>
</template>