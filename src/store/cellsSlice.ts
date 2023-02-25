import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CellsState {
    cells: Cell[];
}

const initialState: CellsState = {
    cells: [],
};

export const cellsSlice = createSlice({
    name: 'cells',
    initialState,
    reducers: {
        setCells: (state, action: PayloadAction<Cell[]>) => {
            state.cells = action.payload;
        },
        setType: (state, action: PayloadAction<Cell>) => {
            const editableCell = state.cells.find(
                (cell) => cell.x === action.payload.x && cell.y === action.payload.y,
            );

            if (editableCell) {
                editableCell.type = action.payload.type;
            }
        },
        setCoords: (state, action: PayloadAction<Coords>) => {
            const editableCell = state.cells.find((cell) => cell.id === action.payload.id);

            if (editableCell) {
                editableCell.top = action.payload.top;
                editableCell.left = action.payload.left;
                editableCell.bottom = action.payload.bottom;
                editableCell.right = action.payload.right;
            }
        },
    },
});

export type Cell = {
    id: string;
    x: number;
    y: number;
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    type: string;
};

type Coords = {
    id: string;
    top: number;
    left: number;
    bottom: number;
    right: number;
};

export const { setCells, setType, setCoords } = cellsSlice.actions;

export default cellsSlice.reducer;
