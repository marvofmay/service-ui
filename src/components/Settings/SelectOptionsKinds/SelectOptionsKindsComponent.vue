<script setup>
  import { ref, onMounted, reactive, watch } from 'vue'
  import { selectOptionKindsStore } from "@/stores/selectOptionKinds";
  import SnackbarMessageComponent from "@/components/Users/Messages/SnackbarMessageComponent.vue";
  import EditSelectOptionKindDialogForm
    from "@/components/Settings/SelectOptionsKinds/Action/Edit/EditSelectOptionKindDialogForm.vue";
  import DeleteSelectOptionKindDialogForm
    from "@/components/Settings/SelectOptionsKinds/Action/Delete/DeleteSelectOptionKindDialogForm.vue";
  import RestoreDeletedSelectOptionKind
    from "@/components/Settings/SelectOptionsKinds/Action/Restore/RestoreDeletedSelectOptionKind.vue";

  const selectOptionKindStore = selectOptionKindsStore();

  let selectOptionKinds = ref([]);
  let currentPage = ref(1);
  let limit = ref(10);
  let numberOfPages = ref(0);
  let totalSelectOptionKinds = ref(0);
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

  watch(selectOptionKinds, () => {
    numberOfPages.value = Math.ceil(totalSelectOptionKinds.value / limit.value);
  });

  const pagePaginationClick = async () => {
    await prepareQueryParams();
    await fetchSelectOptionKinds();
  }

  const prepareQueryParams = () => {
    return new Promise((resolve) => {
      if (phraseToSearch.value) {
        phraseToSearch.value = encodeURIComponent(phraseToSearch.value);
      }

      queryParams.value = `?page=${currentPage.value}&limit=${limit.value}`;
      queryParams.value += (phraseToSearch.value ? `&phrase=${phraseToSearch.value}` : '');

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
    await fetchSelectOptionKinds();
  });

  const fetchSelectOptionKinds = async () => {
    await prepareQueryParams();
    const getSelectOptionKinds = selectOptionKindStore.fetchSelectOptionKindsFromDB(queryParams.value);

    getSelectOptionKinds.then((resolve) => {
      selectOptionKinds.value = resolve.data.data.selectOptionKinds;
      totalSelectOptionKinds.value = resolve.data.data.totalSelectOptionKinds;
      limit.value = resolve.data.data.limit;
      currentPage.value = resolve.data.data.page;
    }).catch((error) => {
      console.log(error.message);
    });
  }

  const searchByPhrase = async () => {
    currentPage.value = 1;
    loadingSearchbar = true;
    await fetchSelectOptionKinds();
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
</script>

<template>
  <SnackbarMessageComponent :snackbar="snackbar" v-model="snackbar.showMessage" @hideSnackbar="hideSnackbar" />
  <v-expansion-panel-title>Select option kinds</v-expansion-panel-title>
  <v-expansion-panel-text>
    <v-row>
      <v-col cols="8">
      </v-col>
      <v-col cols="4">

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
        <v-table v-if="selectOptionKinds.length > 0" density="compact">
          <thead>
          <tr>
            <th>name</th>
            <th>actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(selectOptionKind, index) in selectOptionKinds" :key="index">
            <td>{{ selectOptionKind.name }}</td>
            <td>
              <EditSelectOptionKindDialogForm
                  :selectOptionKind="selectOptionKind"
                  @afterClickedUpdateSelectOptionKind="showSnackbar"
              />
              <DeleteSelectOptionKindDialogForm
                  v-if="! selectOptionKind.deletedAt"
                  :selectOptionKind="selectOptionKind"
                  @afterClickedDeleteSelectOptionKind="showSnackbar"
              />
              <RestoreDeletedSelectOptionKind
                  v-if="selectOptionKind.deletedAt"
                  :selectOptionKind="selectOptionKind"
                  @afterClickedRestoreDeletedSelectOptionKind="showSnackbar"
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