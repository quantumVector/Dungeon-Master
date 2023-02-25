import { configureStore } from '@reduxjs/toolkit';
import cellsReducer from './cellsSlice';
import NPCReducer from './NPCSlice';

const store = configureStore({
    reducer: {
        cells: cellsReducer,
        NPC: NPCReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
