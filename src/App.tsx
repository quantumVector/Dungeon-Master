import React, { useEffect } from 'react';
import styles from './App.module.scss';
import Map from './components/Map/Map';
import NPC from './components/NPC/NPC';
import { gameConfig } from './config/config';
import { useAppDispatch, useAppSelector } from './hooks';
import { setCells, setType } from './store/cellsSlice';
import { setNPC } from './store/NPCSlice';
import { createCells } from './utils/createCells';
import { handleKeyDown } from './utils/handleKeyDown';

function App() {
    const dispatch = useAppDispatch();

    const NPCList = useAppSelector((state) => state.NPC.NPC);

    useEffect(() => {
        dispatch(setCells(createCells()));
        gameConfig.baseCoord.forEach((coord) => {
            dispatch(
                setType({
                    id: new Date().toISOString(),
                    x: coord.x,
                    y: coord.y,
                    type: 'open',
                }),
            );
        });
        dispatch(
            setType({
                id: new Date().toISOString(),
                x: gameConfig.baseCenter.x,
                y: gameConfig.baseCenter.y,
                type: 'base-center',
            }),
        );
        dispatch(
            setNPC({
                // id: new Date().toISOString(),
                id: 'nimp-1',
                x: gameConfig.startCell.x,
                y: gameConfig.startCell.y,
                type: 'nimp',
                directionMovement: [],
                status: 'free',
            }),
        );

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className={styles.App}>
            {NPCList &&
                NPCList.map((unit) => <NPC key={unit.id} id={unit.id} x={unit.x} y={unit.y} />)}
            <Map />
        </div>
    );
}

export default App;
