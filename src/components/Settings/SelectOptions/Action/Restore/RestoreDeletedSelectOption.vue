<script setup>
  import {ref, defineProps, defineEmits} from "vue";
  import { selectOptionsStore } from "@/stores/selectOptions";

  const emits = defineEmits(['afterClickedRestoreDeletedSelectOption', 'updateSelectOption']);
  const props = defineProps({
    selectOption: Object,
  });

  let selectOption = ref(props.selectOption);

  const restoreDeletedSelectOption = () => {
    const selectOptionStore = selectOptionsStore();
    const responseRestoreDeletedSelectOptionInDB = selectOptionStore.restoreDeletedSelectOptionInDB(props.selectOption.uuid);
    responseRestoreDeletedSelectOptionInDB.then((resolve) => {
      selectOption.value.deletedAt = false;
      emits('afterClickedRestoreDeletedSelectOption', 'success', resolve.data.message);
    }).catch(error => {
        const errors = error.response.data.errors.map(item => {
          return `${item.message} - ${item.context.field}`;
        });
        emits('afterClickedRestoreSelectOption', 'error', errors.join(', '), 10000);
    });
  }

</script>

<template>
  <v-btn
      @click="restoreDeletedSelectOption(selectOption)"
      icon="mdi-delete-restore"
      class="ml-1 btn-restore-deleted"
      color="success"
  />
</template>

<style>
  .btn-restore-deleted {
    width: calc(var(--v-btn-height) + -6px) !important;
    height: calc(var(--v-btn-height) + -6px) !important;
    margin-left: 10px !important;
  }
</style>