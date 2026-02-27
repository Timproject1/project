import { defineStore } from "pinia";

export const useDocStore = defineStore("document", {
  state: () => ({
    doc_num: "doc-1",
  }),

  actions: {
    setMember(doc_num) {
      this.doc_num = doc_num;
    },
  },
  persist: true,
});
