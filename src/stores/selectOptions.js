import { defineStore } from 'pinia'
import api from "@/api/SelectOptions/config";

export const selectOptionsStore = defineStore('selectOptionsStore', {
    state: () => ({
        filter: 'role', //skills, interests
    }),
    getters: {
    },
    actions: {
        async fetchSelectOptionsFromDB(queryParams) {
            return await api.get('select-options' + queryParams);
        },
        async addSelectOptionToDB(payload) {
            return await api.post('select-options', payload)
        },
        async updateSelectOptionInDB (payload) {
            return await api.put('select-options/'  + payload.uuid, payload)
        },
        async deleteSelectOptionInDB(selectOptionUUID){
            return await api.delete('select-options/' + selectOptionUUID);
        },
        async restoreDeletedSelectOptionInDB(selectOptionUUID) {
            return await api.patch(`select-options/${selectOptionUUID}/restore-deleted`, {'uuid': selectOptionUUID});
        },
        async fetchSelectOptionsKindsFromDB() {
            return await api.get('select-options/kinds');
        },
    },
})