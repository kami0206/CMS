// languageStore.ts
import { create } from 'zustand';

type LanguageSlice = {
  language: 'en' | 'vi';
  setLanguage: (lang: 'en' | 'vi') => void;
};

const LanguageStore = create<LanguageSlice>((set) => ({
  language: 'vi',  // Mặc định là 'en'
  setLanguage: (lang) => set({ language: lang }),
}));

export default LanguageStore;
