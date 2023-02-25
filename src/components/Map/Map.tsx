import React from 'react';
import { gameConfig } from '../../config/config';
import styles from './Map.module.scss';
import Cell from '../Cell/Cell';
import { useAppSelector } from '../../hooks';

const mapSideSize = gameConfig.mapSize * gameConfig.cellSize;

const Map = () => {
    const cells = useAppSelector((state) => state.cells.cells);

    return (
        <div className={styles.Map} style={{ width: mapSideSize, height: mapSideSize }}>
            {cells.map((cell) => (
                <Cell
                    key={cell.id}
                    id={cell.id}
                    cellSize={gameConfig.cellSize}
                    coordX={cell.x}
                    coordY={cell.y}
                    type={cell.type}
                    layer="env"
                />
            ))}
        </div>
    );
};

export default Map;
