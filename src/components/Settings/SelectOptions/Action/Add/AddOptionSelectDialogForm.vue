<script setup>
  import {ref, defineProps, reactive, defineEmits, watch} from 'vue'
  import { selectOptionsStore } from "@/stores/selectOptions";

  const props = defineProps({
    selectOptionsKinds: Array,
    selectedOptionKind: String,
  });
  const emits = defineEmits(['messageAfterClickedSaveSelectOption', 'changeSelectedOptionKindFromChildComponent']);

  let formSubmit = ref(false);
  let dialog = ref(false);
  let selectOption = reactive({
    value: "",
    name: "",
    kind: props.selectedOptionKind
  });

  watch(() => props.selectedOptionKind, (newValue) => {
    newValue !== 'all' ? selectOption.kind = newValue : "";
  });

  const valueRules = [
    v => !!v || 'Field is required',
  ];
  const nameRules = [
    v => !!v || 'Field is required',
  ];
  const kindRules = [
    v => !!v || 'Field is required',
  ];

  const clearForm = () => {
    selectOption.value = '';
    selectOption.name = '';
    selectOption.kind = props.selectedOptionKind;
  }

  const onSubmit = () => {
    if (! formSubmit) {
      return false;
    }

    const selectOptionStore = selectOptionsStore();
    const responseAddSelectOptionToDB = selectOptionStore.addSelectOptionToDB(selectOption);

    responseAddSelectOptionToDB.then(resolve => {
      dialog.value = false;
      emits('messageAfterClickedSaveSelectOption', 'success', resolve.data.message);
      emits('changeSelectedOptionKindFromChildComponent', selectOption.kind);
      clearForm();
    })
    .catch(error => {
        const errors = error.response.data.errors.map(item => {
          return `${item.message} - ${item.context.field}`;
        });
        emits('messageAfterClickedSaveSelectOption', 'error', errors.join(', '), 10000);
    });
  }
</script>

<template>
  <v-dialog v-model="dialog" persistent width="1024">
    <template v-slot:activator="{ props }">
      <v-btn
          color="success"
          v-bind="props"
          class="float-right"
      >
        add option select
      </v-btn>
    </template>
    <v-form v-model="formSubmit" @submit.prevent="onSubmit">
      <v-card>
        <v-card-title>
          <span class="text-h5">Add new select option</span>
        </v-card-title>
        <v-card-text>
             <v-row>
               <v-col cols="12" sm="4">
                 <v-text-field v-model="selectOption.value" :rules="valueRules" label="value*" ></v-text-field>
               </v-col>
               <v-col cols="12" sm="4">
                 <v-text-field v-model="selectOption.name" :rules="nameRules" label="name*" ></v-text-field>
               </v-col>
               <v-col cols="12" sm="4">
                 <v-autocomplete
                     :rules="kindRules"
                     v-model="selectOption.kind"
                     :items="selectOptionsKinds"
                     label="kind*"
                 >
                 </v-autocomplete>
               </v-col>
             </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="error"
              variant="elevated"
              @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn color="success" type="submit" variant="elevated" :disabled="! formSubmit">
            Save new select option
            <v-icon icon="mdi-content-save" end></v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
