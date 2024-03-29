<script setup>
  import { ref, defineProps, defineEmits } from "vue";
  import { selectOptionsStore } from "@/stores/selectOptions";

  const emits = defineEmits(['afterClickedDeleteSelectOption']);
  const props = defineProps({
    selectOption: Object,
  });

  let dialog = ref(false);
  let selectOption = ref(props.selectOption);

  const deleteSelectOption = () => {
    const selectOptionStore = selectOptionsStore();
    const responseDeleteSelectOptionInDB = selectOptionStore.deleteSelectOptionInDB(props.selectOption.uuid);
    responseDeleteSelectOptionInDB.then((resolve) => {
      dialog.value = false;
      selectOption.value.deletedAt = true;
      emits('afterClickedDeleteSelectOption', 'success', resolve.data.message);
    })
    .catch(error => {
      console.log(error);
      const errors = error.response.data.errors.map(item => {
        return `${item.message} - ${item.context.field}`;
      });
      emits('afterClickedDeleteSelectOption', 'error', errors.join(', '), 10000);
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
        <span class="text-h5">Are you sure, that You want to delete select option:</span>
        <span class="pl-5">{{ selectOption.value }} - {{ selectOption.kind }}</span>
      </v-card-title>
      <v-card-text></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="elevated" @click="dialog = false">
          Close
        </v-btn>
        <v-btn color="success" variant="elevated" @click="deleteSelectOption">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
