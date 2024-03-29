<script setup>
  import { ref } from 'vue'
  import SelectOptionsKindsComponent from "@/components/Settings/SelectOptionsKinds/SelectOptionsKindsComponent.vue";
  import SelectOptionsComponent from "@/components/Settings/SelectOptions/SelectOptionsComponent.vue";

  const panel = ref(1);
</script>

<template>
    <v-container class="mt-15 mx-auto" fluid  >
      <v-row class="d-flex justify-center">
        <v-col class="d-flex child-flex" cols="12">
          <v-expansion-panels v-model="panel" multiple >
            <v-expansion-panel>
              <SelectOptionsComponent />
            </v-expansion-panel>
            <v-expansion-panel>
              <SelectOptionsKindsComponent />
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>
</template>