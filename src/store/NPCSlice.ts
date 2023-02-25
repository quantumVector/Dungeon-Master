import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NPCState {
    NPC: NPC[];
}

const initialState: NPCState = {
    NPC: [],
};

export const NPCSlice = createSlice({
    name: 'NPC',
    initialState,
    reducers: {
        setNPC: (state, action: PayloadAction<NPC>) => {
            state.NPC.push(action.payload);
        },
        setDirectionMovement: (
            state,
            action: PayloadAction<{ id: string; direction: unknown }>,
        ) => {
            const { id, direction } = action.payload;
            const npcIndex = state.NPC.findIndex((npc) => npc.id === id);
            if (npcIndex !== -1) {
                state.NPC[npcIndex].directionMovement = [
                    direction as {
                        id: string;
                        x: number;
                        y: number;
                        type: string;
                        top: number;
                        left: number;
                        bottom: number;
                        right: number;
                    },
                ];
            }
        },
        setStartPosition: (state, action: PayloadAction<NPC>) => {
            const editableUnit = state.NPC.find((unit) => unit.id === 'nimp-1');

            if (editableUnit) {
                editableUnit.x = action.payload.x;
                editableUnit.y = action.payload.y;
            }
        },
    },
});

export type NPC = {
    id: string;
    x: number;
    y: number;
    type: string;
    directionMovement: {
        [x: string]: any;
        id: string;
        x: number;
        y: number;
        type: string;
        top: number;
        left: number;
        bottom: number;
        right: number;
    }[];
    status: string;
};

export const { setNPC, setDirectionMovement, setStartPosition } = NPCSlice.actions;

export default NPCSlice.reducer;
