<script setup>
  import { ref, defineProps, defineEmits } from "vue";
  import { selectOptionKindsStore } from "@/stores/selectOptionKinds";

  const emits = defineEmits(['afterClickedDeleteSelectOptionKind', 'updateSelectOptionKind']);
  const props = defineProps({
    selectOptionKind: Object,
  });

  let dialog = ref(false);
  let selectOptionKind = ref(props.selectOptionKind);

  const deleteSelectOptionKind = () => {
    const selectOptionKindStore = selectOptionKindsStore();
    const responseDeleteSelectOptionKindInDB = selectOptionKindStore.deleteSelectOptionKindInDB(props.selectOptionKind.uuid);
    responseDeleteSelectOptionKindInDB.then((resolve) => {
      dialog.value = false;
      selectOptionKind.value.deletedAt = true;
      emits('afterClickedDeleteSelectOptionKind', 'success', resolve.data.message);
    })
    .catch(error => {
      console.log(error);
      const errors = error.response.data.errors.map(item => {
        return `${item.message} - ${item.context.field}`;
      });
      emits('afterClickedDeleteSelectOptionKind', 'error', errors.join(', '), 10000);
    });
  }
</script>

<template>
  <v-dialog v-model="dialog" persistent width="1024">
    <template v-slot:activator="{ props }">
      <v-btn density="compact" icon="mdi-delete" v-bind="props" color="error" class="ml-3"></v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Are you sure, that You want to delete select option kind:</span>
        <span class="pl-5">{{ selectOptionKind.name }}</span>
      </v-card-title>
      <v-card-text></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="elevated" @click="dialog = false">
          Close
        </v-btn>
        <v-btn color="success" variant="elevated" @click="deleteSelectOptionKind">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
