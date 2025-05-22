import { createSlice } from "@reduxjs/toolkit";

const oilWellDataSlice = createSlice({
  name: "oilWellData",
  initialState: {
    oilWellData: [],
    oilSearchParams: {
      WellName: "",
      Height: "",
      Lithology: "",
      TMax: "",
    }
  },
  reducers: {
    // 更新油井数据
    setOilWellData: (state, action) => {
      state.oilWellData = action.payload;
    },
    addOilWellData: (state, action) => {
      state.oilWellData.push(action.payload);
    },
    setOilSearchParams: (state, action) => {
      state.oilSearchParams = action.payload;
    },
    // 删除某条油井数据
    deleteOilWellData: (state, action) => {
      const index = state.oilWellData.findIndex(item => item.ID === action.payload);
      if (index !== -1) {
        state.oilWellData.splice(index, 1);
      }
    },
    // 修改某条油井数据
    uploadOilWellData: (state, action) => {
      const index = state.oilWellData.findIndex(item => item.ID === action.payload.ID);
      if (index !== -1) {
        state.oilWellData[index] = action.payload;
      }
    }
  },
});

const { setOilWellData, setOilSearchParams, addOilWellData, deleteOilWellData, uploadOilWellData } = oilWellDataSlice.actions;
const oilWellDataReducer = oilWellDataSlice.reducer;


export { setOilWellData, setOilSearchParams, addOilWellData, deleteOilWellData, uploadOilWellData };
export default oilWellDataReducer;
