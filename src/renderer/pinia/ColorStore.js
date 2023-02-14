import {defineStore} from "pinia";

export const useColorStore = defineStore('color', {
  state: () => ({
    PRIMARY: "#000",
    BASE1: "#000",
    BASE2: "#000",
    BASE3: "#000",
    BASE4: "#000",
    BASE5: "#000",
    BASE6: "#000",
    BASE7: "#000",
    BASE8: "#000",
    BASE9: "#000",
    BASE10: "#000",
  }),
  actions: {},
  getters: {
    cssVariable: (state) => {
      let result = {}
      for (let item in state) {
        if (/^[P,B]/.test(item)) {
          result['--' + item] = state[item]
        }
      }
      return result
    }
  }
})