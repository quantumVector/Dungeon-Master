import { gameConfig } from '../config/config';
import { Cell } from '../store/cellsSlice';

export const createCells = () => {
    const numCells = gameConfig.mapSize * gameConfig.mapSize;
    const cells: Cell[] = [];
    let coordX = 0;
    let coordY = 1;

    for (let i = 1; i <= numCells; i++) {
        coordX += 1;

        if (coordX > gameConfig.mapSize) {
            coordX = 1;
            coordY += 1;
        }

        cells.push({
            id: `${i}`,
            x: coordX,
            y: coordY,
            type: 'wall',
        });
    }

    return cells;
};
