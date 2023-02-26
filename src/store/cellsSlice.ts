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
        setType: (state, action: PayloadAction<Type>) => {
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
        setStatus: (state, action: PayloadAction<Cell>) => {
            const editableCell = state.cells.find(
                (cell) => cell.x === action.payload.x && cell.y === action.payload.y,
            );

            if (editableCell) {
                editableCell.status = action.payload.status;
            }
        },
        setTrigger: (state, action: PayloadAction<Trigger>) => {
            const editableCell = state.cells.find((cell) => cell.id === action.payload.id);

            if (editableCell) {
                if (action.payload.x && action.payload.y) {
                    editableCell.diggingTrigger = action.payload;
                } else {
                    editableCell.diggingTrigger = null;
                }
            }
        },
        setDiggingActive: (state, action: PayloadAction<Digging>) => {
            const editableCell = state.cells.find(
                (cell) => cell.x === action.payload.x && cell.y === action.payload.y,
            );

            if (editableCell) {
                editableCell.digging = action.payload.digging;
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
    status: string;
    digging?: boolean;
    // тут пишем, какая клетка будет копаться, когда юнит достигнет текущей клетки
    // на которой кстановлен триггер
    diggingTrigger?: Trigger | null;
};

type Type = {
    x: number;
    y: number;
    type: string;
};

type Coords = {
    id: string;
    top: number;
    left: number;
    bottom: number;
    right: number;
};

type Trigger = {
    id: string;
    x: number;
    y: number;
};

type Digging = {
    x: number;
    y: number;
    digging: boolean;
};

export const { setCells, setType, setCoords, setStatus, setTrigger, setDiggingActive } =
    cellsSlice.actions;

export default cellsSlice.reducer;
