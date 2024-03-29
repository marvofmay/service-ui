<script setup>
  import { ref, onMounted, reactive, watch } from 'vue'
  import { selectOptionsStore } from "@/stores/selectOptions";
  import SnackbarMessageComponent from "@/components/Users/Messages/SnackbarMessageComponent.vue";
  import AddOptionSelectDialogForm from "@/components/Settings/SelectOptions/Action/Add/AddOptionSelectDialogForm.vue";
  import EditSelectOptionDialogForm from "@/components/Settings/SelectOptions/Action/Edit/EditSelectOptionDialogForm.vue";
  import DeleteSelectOptionDialogForm from "@/components/Settings/SelectOptions/Action/Delete/DeleteSelectOptionDialogForm.vue";
  import RestoreDeletedSelectOption from "@/components/Settings/SelectOptions/Action/Restore/RestoreDeletedSelectOption.vue";

  const selectOptionStore = selectOptionsStore();
  const selectedOptionKind = ref('role');

  let selectOptionsKinds = ref([]);
  let selectOptions = ref([]);
  let currentPage = ref(1);
  let limit = ref(10);
  let numberOfPages = ref(0);
  let totalSelectOptions = ref(0);
  let filter = ref(null);
  let phraseToSearch = ref(null);
  let queryParams = ref('');
  let snackbar = reactive({
    typeMessage: null,
    textMessage: null,
    showMessage: false,
    timeOut: null,
  });
  let loadingSearchbar = ref(false);

  watch(selectOptions, () => {
    numberOfPages.value = Math.ceil(totalSelectOptions.value / limit.value);
  });

  const pagePaginationClick = async () => {
    await prepareQueryParams();
    await fetchSelectOptions();
  }

  const prepareQueryParams = () => {
    return new Promise((resolve) => {
      if (phraseToSearch.value) {
        phraseToSearch.value = encodeURIComponent(phraseToSearch.value);
      }

      queryParams.value = `?page=${currentPage.value}&limit=${limit.value}`;
      queryParams.value += (phraseToSearch.value ? `&phrase=${phraseToSearch.value}` : '');

      if (selectedOptionKind.value !== 'all') {
        queryParams.value += `&kind=${selectedOptionKind.value}`;
      }

      switch (filter.value) {
        case 'deleted':
          queryParams.value += `&deleted=1`;
          break;
        case 'notdeleted':
          queryParams.value += `&deleted=0`;
          break;
      }
      resolve();
    });
  }

  onMounted(async () => {
     await prepareQueryParams();
     await fetchSelectOptions();
     await fetchSelectOptionsKinds();
  });

  const fetchSelectOptions = async () => {
    await prepareQueryParams();
    const getSelectOptions = selectOptionStore.fetchSelectOptionsFromDB(queryParams.value);

    getSelectOptions.then((resolve) => {
      selectOptions.value = resolve.data.data.selectOptions;
      totalSelectOptions.value = resolve.data.data.totalSelectOptions;
      limit.value = resolve.data.data.limit;
      currentPage.value = resolve.data.data.page;
    }).catch((error) => {
      console.log(error.message);
    });
  }

  const fetchSelectOptionsKinds = () => {
    const getSelectOptionsKinds = selectOptionStore.fetchSelectOptionsKindsFromDB();

    getSelectOptionsKinds.then((resolve) => {
      selectOptionsKinds.value = resolve.data.data.map(item => item.kind);
    }).catch((error) => {
      console.log(error.message);
    });
  }

  const searchByPhrase = async () => {
    currentPage.value = 1;
    loadingSearchbar = true;
    await fetchSelectOptions();
    loadingSearchbar = false;
  }

  const showSnackbar = (type, text, timeOut = 2000) => {
    snackbar.typeMessage = type;
    snackbar.textMessage = text;
    snackbar.showMessage = true;
    snackbar.timeOut = timeOut;
  }

  const hideSnackbar = () => {
    snackbar.showMessage = false;
  }

  const changeSelectedOptionKind = () => {
    currentPage.value = 1;
    fetchSelectOptions();
  }

  const changeSelectedOptionKindFromChildComponent = (newValue) => {
    selectedOptionKind.value = newValue;
    currentPage.value = 1;
    fetchSelectOptions();
  }
</script>

<template>
  <SnackbarMessageComponent :snackbar="snackbar" v-model="snackbar.showMessage" @hideSnackbar="hideSnackbar" />
  <v-expansion-panel-title>Select options</v-expansion-panel-title>
  <v-expansion-panel-text>
    <v-row>
      <v-col cols="8">
        <v-radio-group v-model="selectedOptionKind" :inline=true>
          <v-radio label="Role" value="role" @change="changeSelectedOptionKind"></v-radio>
          <v-radio label="Skill" value="skill" @change="changeSelectedOptionKind"></v-radio>
          <v-radio label="Interest" value="interest" @change="changeSelectedOptionKind"></v-radio>
          <v-radio label="All" value="all" @change="changeSelectedOptionKind"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="4">
        <AddOptionSelectDialogForm
            :selectedOptionKind="selectedOptionKind"
            :selectOptionsKinds="selectOptionsKinds"
            :fetchSelectOptions="fetchSelectOptions"
            @messageAfterClickedSaveSelectOption="showSnackbar"
            @changeSelectedOptionKindFromChildComponent="changeSelectedOptionKind"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="5">
        <v-text-field
            :loading="loadingSearchbar"
            density="compact"
            variant="solo"
            label="search in table"
            append-inner-icon="mdi-magnify"
            single-line
            hide-details
            v-model="phraseToSearch"
            @click:append-inner="searchByPhrase"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-table v-if="selectOptions.length > 0" density="compact">
          <thead>
          <tr>
            <th>value</th>
            <th>name</th>
            <th v-if="selectedOptionKind === 'all'">kind</th>
            <th>actions</th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="(selectOption, index) in selectOptions" :key="index">
              <td>{{ selectOption.value }}</td>
              <td>{{ selectOption.name }}</td>
              <td v-if="selectedOptionKind === 'all'">{{ selectOption.kind }}</td>
              <td>
                <EditSelectOptionDialogForm
                    :selectOptionsKinds="selectOptionsKinds"
                    :selectOption="selectOption"
                    @afterClickedUpdateSelectOption="showSnackbar"
                    @changeSelectedOptionKindFromChildComponent="changeSelectedOptionKind"
                />
                <DeleteSelectOptionDialogForm
                    v-if="! selectOption.deletedAt"
                    :selectOption="selectOption"
                    @afterClickedDeleteSelectOption="showSnackbar"
                />
                <RestoreDeletedSelectOption
                    v-if="selectOption.deletedAt"
                    :selectOption="selectOption"
                    @afterClickedRestoreDeletedSelectOption="showSnackbar"
                />
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12">
        <v-pagination
            v-model="currentPage"
            :length="numberOfPages"
            @update:model-value="pagePaginationClick"
        ></v-pagination>
      </v-col>
    </v-row>

  </v-expansion-panel-text>
</template>