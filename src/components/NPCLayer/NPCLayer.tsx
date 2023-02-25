import React from 'react';
import { gameConfig } from '../../config/config';
import { useAppSelector } from '../../hooks';
import Cell from '../Cell/Cell';
import styles from './NPCLayer.module.scss';

const mapSideSize = gameConfig.mapSize * gameConfig.cellSize;

const NPCLayer = () => {
    const cells = useAppSelector((state) => state.cells.cells);

    return (
        <div className={styles.NPCLayer} style={{ width: mapSideSize, height: mapSideSize }}>
            {cells.map((cell) => (
                <Cell
                    key={cell.id}
                    id={`${cell.id}-NPC-layer`}
                    cellSize={gameConfig.cellSize}
                    coordX={cell.x}
                    coordY={cell.y}
                    layer="NPC"
                />
            ))}
        </div>
    );
};

export default NPCLayer;
