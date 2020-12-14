import API from 'lib-app/api-call';
import sessionStore from 'lib-app/session-store';

export default {
    checkInstallation(installed = null) {
        if (installed !== null)
            return {
                type: 'CHECK_INSTALLATION_FULFILLED',
                payload: {data: installed ? 1 : 0}
            };
        else
            return {
                type: 'CHECK_INSTALLATION',
                payload: API.call({
                    path: '/system/installation-done',
                    data: {}
                })
            };
    },

    init() {
        if (sessionStore.isLoggedIn()) {
            return {
                type: 'INIT_CONFIGS_FULFILLED',
                payload: {
                    data: sessionStore.getConfigs()
                }
            };
        } else {
            return {
                type: 'INIT_CONFIGS',
                payload: API.call({
                    path: '/system/get-settings',
                    data: {}
                })
            };
        }
    },

    changeLanguage(newLanguage) {
        return {
            type: 'CHANGE_LANGUAGE',
            payload: newLanguage
        };
    },

    updateData(data = null) {
        if (data)
            return {
                type: 'UPDATE_DATA',
                payload: {data: data}
            };
        else
            return {
                type: 'UPDATE_DATA',
                payload: API.call({
                    path: '/system/get-settings',
                    data: {}
                })
            };
    },

    updateUserSystemSettings(payload) {
        return {
            type: 'UPDATE_USER_SYSTEM_SETTINGS',
            payload: payload
        };
    }
};
