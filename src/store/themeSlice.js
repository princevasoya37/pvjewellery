import { createSlice } from '@reduxjs/toolkit';

const loadTheme = () => {
  try {
    const s = localStorage.getItem('luxury_theme');
    if (s === 'dark' || s === 'light') return s;
  } catch (_) {}
  return 'light'; // Default to pristine light beige atelier theme
};

const saveTheme = (theme) => {
  try {
    localStorage.setItem('luxury_theme', theme);
  } catch (_) {}
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: loadTheme(),
    isCartDrawerOpen: false,
  },
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      saveTheme(state.mode);
    },
    setTheme(state, { payload }) {
      state.mode = payload;
      saveTheme(state.mode);
    },
    toggleCartDrawer(state) {
      state.isCartDrawerOpen = !state.isCartDrawerOpen;
    },
    setCartDrawer(state, { payload }) {
      state.isCartDrawerOpen = payload;
    },
  },
});

export const { toggleTheme, setTheme, toggleCartDrawer, setCartDrawer } = themeSlice.actions;
export const selectThemeMode = (s) => s.theme.mode;
export const selectIsCartDrawerOpen = (s) => s.theme.isCartDrawerOpen;
export default themeSlice.reducer;
