import { defineStore } from "pinia";

export const useMemberStore = defineStore("member", {
  state: () => ({
    id: "test",
    center: "1018112345",
    grade: "a1",
  }),

  getters: {
    doubleCount: (state) => state.count * 2,
  },

  actions: {
    setMember(data) {
      this.id = data.id;
      this.center = data.center;
      this.grade = data.grade;
    },

    logout() {
      this.$reset();
    },
  },
  persist: true,
});
