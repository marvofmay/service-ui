<script setup>
  import { ref, defineProps, defineEmits, watch } from 'vue'
  import { selectOptionKindsStore } from "@/stores/selectOptionKinds";

  const props = defineProps({
    selectOptionKind: Object,
  });

  const emits = defineEmits(['afterClickedUpdateSelectOption', 'updateSelectOptionKind']);

  let selectOptionKind = ref(props.selectOptionKind);
  let formSubmit = ref(false);
  let dialog = ref(false);

  const nameRules = [
    v => !!v || 'Field is required',
  ];

  const onSubmit = () => {
    if (! formSubmit) {
      return false;
    }

    const selectOptionKindStore = selectOptionKindsStore();
    const responseUpdateSelectOptionKindInDB = selectOptionKindStore.updateSelectOptionKindInDB(selectOptionKind.value);

    responseUpdateSelectOptionKindInDB.then(resolve => {
       dialog.value = false;
       emits('afterClickedUpdateSelectOptionKind', 'success', resolve.data.message);
     })
     .catch(error => {
       const errors = error.response.data.errors.map(item => {
         return `${item.message} - ${item.context.field}`;
       });
       emits('afterClickedUpdateSelectOptionKind', 'error', errors.join(', '), 10000);
     });
  }
</script>

<template>
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }" >
        <v-btn density="compact" icon="mdi-pencil" v-bind="props" color="warning" class="ml-3"></v-btn>
      </template>
      <v-form v-model="formSubmit" @submit.prevent="onSubmit">
        <v-card>
          <v-card-title>
            <span class="text-h5">Update select option kind</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="4">
                <v-text-field v-model="selectOptionKind.name" :rules="nameRules" label="name*" ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" variant="elevated" @click="dialog = false">
              Close
            </v-btn>
            <v-btn color="success" type="submit" variant="elevated" :disabled="! formSubmit">
              Update select option kind
              <v-icon icon="mdi-content-save" end></v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
</template>