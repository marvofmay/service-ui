<script setup>
  import { ref, defineProps, defineEmits } from "vue";
  import { selectOptionKindsStore } from "@/stores/selectOptionKinds";

  const emits = defineEmits(['afterClickedRestoreDeletedSelectOptionKind']);
  const props = defineProps({
    selectOptionKind: Object,
  });

  let selectOptionKind = ref(props.selectOptionKind);

  const restoreDeletedSelectOptionKind = () => {
    const selectOptionKindStore = selectOptionKindsStore();
    const responseRestoreDeletedSelectOptionKindInDB = selectOptionKindStore.restoreDeletedSelectOptionKindInDB(props.selectOptionKind.uuid);
    responseRestoreDeletedSelectOptionKindInDB.then((resolve) => {
      selectOptionKind.value.deletedAt = false;
      emits('afterClickedRestoreDeletedSelectOptionKind', 'success', resolve.data.message);
    }).catch(error => {
        const errors = error.response.data.errors.map(item => {
          return `${item.message} - ${item.context.field}`;
        });
        emits('afterClickedRestoreSelectOptionKind', 'error', errors.join(', '), 10000);
    });
  }

</script>

<template>
  <v-btn
      @click="restoreDeletedSelectOptionKind(selectOptionKind)"
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