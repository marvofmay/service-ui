import { defineStore } from 'pinia'
import api from "@/api/SelectOptionKinds/config";

export const selectOptionKindsStore = defineStore('selectOptionKindsStore', {
    state: () => ({ }),
    getters: { },
    actions: {
        async fetchSelectOptionKindsFromDB(queryParams) {
            return await api.get('select-option-kinds' + queryParams);
        },
        async updateSelectOptionKindInDB (payload) {
            return await api.put('select-option-kinds/'  + payload.uuid, payload)
        },
        async deleteSelectOptionKindInDB(selectOptionKindUUID){
            return await api.delete('select-option-kinds/' + selectOptionKindUUID);
        },
        async restoreDeletedSelectOptionKindInDB(selectOptionKindUUID) {
            return await api.patch(`select-option-kinds/${selectOptionKindUUID}/restore-deleted`, {'uuid': selectOptionKindUUID});
        },
    },
})