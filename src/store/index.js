import { configureStore } from '@reduxjs/toolkit';
import oilWellDataReducer from './models/oilWellData';

const store = configureStore({
  reducer: {
    oil: oilWellDataReducer
  }
})

export default store;