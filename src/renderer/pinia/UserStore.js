import {defineStore} from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    "behavior": {"closeAsHidden": true, "startWithPC": false, "stayTopLevel": 1},
    "appearance": {
      "theme": {"darkMode": false, "primaryColor": "#d64541", "backgroundImage": null},
      "language": "zhCN",
      "windowSize": "small",
      "font": {"size": "14px", "family": ""}
    },
    "plugins": {},
    "storage": {db: ['db0']}
  }),
  actions: {},
  getters: {
    theme: (state) => state.appearance.theme,
    getPlugins: (state) => state.plugins
  }
})

