import { defineStore } from "pinia";

export const useDocStore = defineStore("document", {
  state: () => ({
    doc_num: "doc-1",
    writer: "",
  }),

  actions: {
    setMember(doc_num) {
      this.doc_num = doc_num;
    },
    setInfo(info) {
      this.doc_num = info.doc_num;
      this.writer = info.writer;
    },
  },
  persist: true,
});
