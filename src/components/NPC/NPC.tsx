import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setDiggingActive } from '../../store/cellsSlice';
import { setStartPosition } from '../../store/NPCSlice';
import styles from './NPC.module.scss';

interface NPCProps {
    id: string;
    x: number;
    y: number;
}

const NPC = ({ id, x, y }: NPCProps) => {
    const dispatch = useAppDispatch();

    const startCell = useAppSelector((state) =>
        // eslint-disable-next-line prettier/prettier
        state.cells.cells.find((cell) => cell.x === x && cell.y === y));
    const cells = useAppSelector((state) => state.cells.cells);
    const unit = useAppSelector((state) => state.NPC.NPC.find((npc) => npc.id === id));
    const [position, setPosition] = useState<any>();

    // юнит начинает движение
    useEffect(() => {
        if (unit && unit.directionMovement.length > 0) {
            const arr = unit.directionMovement[0].slice().reverse();
            let i = 0;
            const timer = setInterval(() => {
                setPosition({
                    top: arr[i].top,
                    left: arr[i].left,
                });

                i++;

                // действия в конце движения
                if (i === arr.length) {
                    clearInterval(timer);
                    dispatch(
                        setStartPosition({
                            x: arr[arr.length - 1].x,
                            y: arr[arr.length - 1].y,
                            id: '',
                            type: '',
                            directionMovement: [],
                            status: '',
                        }),
                    );

                    // в последней клетке пройденного пути должен быть триггер, находим его
                    const diggingCell = cells.find((cell) => cell.id === arr[arr.length - 1].id);

                    // из триггера достаем координаты клетки, которую нужно раскопать
                    // чтобы повесить на нее мерцание
                    if (diggingCell?.diggingTrigger) {
                        dispatch(
                            setDiggingActive({
                                x: diggingCell.diggingTrigger.x,
                                y: diggingCell.diggingTrigger.y,
                                digging: true,
                            }),
                        );
                    }
                }
            }, 200);
        }
    }, [unit?.directionMovement]);

    return (
        <div>
            {startCell && (
                <div
                    className={styles.NPC}
                    style={{
                        top: position ? position.top : startCell.top,
                        left: position ? position.left : startCell.left,
                    }}
                />
            )}
        </div>
    );
};

export default NPC;
