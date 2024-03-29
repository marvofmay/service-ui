import { defineStore } from 'pinia'
import api from "@/api/Users/config";

export const usersStore = defineStore('usersStore', {
    state: () => ({
        token: null,
        logged: false,
        loggedUser: null,
        users: [],
        filter: 'all', //deleted, active, inactive, all, notdeleted
    }),
    getters: {
        getToken (state) {
            return state.token;
        },
        getLogged (state) {
             return state.logged;
        },
        getLoggedUser (state) {
            return state.loggedUser;
        },
        allUsers (state) {
            return state.users;
        },
        filterOption(state) {
            return state.filter;
        },
        isAdmin(state) {
            return state.loggedUser.roles.includes('ROLE_ADMIN');
        },
    },
    actions: {
        addUser(newUser) {
            return new Promise(() => {
                this.users.push(newUser);
            })
        },
        updateUser(userToUpdate) {
            return new Promise((resolve, reject) => {
                let userIndex = this.users.findIndex((user) => user.uuid === userToUpdate.uuid);
                if (userIndex !== -1) {
                    this.users[userIndex] = userToUpdate;
                    resolve('User has been updated in store.');
                } else {
                    reject('User not found in store :(');
                }
            })
        },
        setFilterOption(newFilterOption) {
            this.filter = newFilterOption;
        },
        setUsers(users) {
            this.users = users;
        },
        setToken(token) {
            this.token = token;
        },
        setLogged(logged) {
            this.logged = logged;
        },
        setLoggedUser(loggedUser) {
            this.loggedUser = loggedUser;
        },
        setLoggedUserAvatar(avatar) {
            this.loggedUser.avatar = avatar;
        },
        async fetchUsersFromDB(queryParams) {
            return await api.get('users' + queryParams);
        },
        async addUserToDB(newUser) {
            return await api.post('users', newUser)
        },
        async deleteUserInDB(userUUID){
            return await api.delete('users/' + userUUID);
        },
        async getUserFromDB(userUUID) {
            return await api.get('users/' + userUUID)
        },
        async updateUserInDB (userToUpdate) {
            return await api.put('users/'  + userToUpdate.uuid, userToUpdate)
        },
        async updateUserAvatarInDB (userUUID, payload) {
            return await api.patch('users/' + userUUID + '/avatar/upload', payload)
        },
        async getUserAddressFromDB (userUUID) {
            return await api.get('addresses/users/' + userUUID)
        },
        async toggleUserActiveInDB(userUUID) {
            return await api.patch(`users/${userUUID}/toggle-active` , {'uuid': userUUID});
        },
        async restoreDeletedUserInDB(userUUID) {
            return await api.patch(`users/${userUUID}/restore-deleted`, {'uuid': userUUID});
        },
        async changeUserPasswordInDB(userUUID, payload) {
            return await api.patch(`users/${userUUID}/change-password`, payload);
        },
        async loginUserByDB (payload) {
            return api.post('login_check', payload)
        }
    },
})