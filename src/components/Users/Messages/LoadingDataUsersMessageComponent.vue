<script setup>
  import { defineProps } from 'vue';

  const props = defineProps({
    isLoadingDataUsers: Boolean,
  });
</script>

<template>
  <v-container v-if="props.isLoadingDataUsers" class="mx-auto">
    <v-row>
      <v-alert type="info" >Users data loading ...</v-alert>
    </v-row>
  </v-container>
</template>