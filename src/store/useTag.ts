import { create } from "zustand";

export type TTag = {
  title: string;
  value: number;
  category: string;
};

type Props = {
  tags: TTag[];
  addTag: (tag: TTag) => void;
  updateTag: (index: number, newTag: TTag) => void;
  removeTag: (index: number) => void;
};

export const useTagStore = create<Props>((set) => ({
  tags: [],
  addTag: (tag: TTag) => set((state) => ({ tags: [...state.tags, tag] })),
  updateTag: (index: number, newTag: TTag) =>
    set((state) => ({
      tags: state.tags.map((tag, i) => (i === index ? newTag : tag)),
    })),
  removeTag: (tagIndex) =>
    set((state) => ({
      tags: state.tags.filter((_, index) => index !== tagIndex),
    })),
}));
