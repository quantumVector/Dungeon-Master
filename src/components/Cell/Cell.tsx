import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import styles from './Cell.module.scss';
import {
    setCoords,
    setDiggingActive,
    setStatus,
    setTrigger,
    setType,
} from '../../store/cellsSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import AStar from '../../utils/aStar';
import { setDirectionMovement } from '../../store/NPCSlice';

interface CellSizeProps {
    id: string;
    cellSize: number;
    coordX?: number;
    coordY?: number;
    type?: string;
    layer: string;
    status: string;
}

const Cell = ({ id, cellSize, coordX, coordY, type, status }: CellSizeProps) => {
    const dispatch = useAppDispatch();

    const cells = useAppSelector((state) => state.cells.cells);
    const currentCell = useAppSelector((state) => state.cells.cells.find((cell) => cell.id === id));
    const unit = useAppSelector((state) => state.NPC.NPC.find((npc) => npc.id === 'nimp-1'));

    const [cellFlicker, setCellFlicker] = useState<boolean>();
    const [cellWithTrigger, setCellWithTrigger] = useState<string>();

    const elementRef = useRef<HTMLInputElement>(null);

    function getCoords(elem: HTMLInputElement) {
        const box = elem.getBoundingClientRect();

        return {
            top: box.top + window.pageYOffset,
            right: box.right + window.pageXOffset,
            bottom: box.bottom + window.pageYOffset,
            left: box.left + window.pageXOffset,
        };
    }

    useEffect(() => {
        const element = elementRef.current;
        if (element) {
            const coords = getCoords(element);
            dispatch(
                setCoords({
                    id,
                    top: coords.top,
                    left: coords.left,
                    bottom: coords.bottom,
                    right: coords.right,
                }),
            );
        }
    }, []);

    // процесс копания клетки
    useEffect(() => {
        // определяем, что клетка должна быть раскопана и активируем мерцание
        if (currentCell?.digging) {
            setCellFlicker(true);

            // ставим таймер на длительность копания и совершаем действия после раскопок
            setTimeout(() => {
                if (coordX && coordY) {
                    dispatch(
                        setType({
                            x: coordX,
                            y: coordY,
                            type: 'open',
                        }),
                    );
                    setCellFlicker(false);
                    dispatch(
                        setDiggingActive({
                            x: coordX,
                            y: coordY,
                            digging: false,
                        }),
                    );
                    if (type) {
                        dispatch(
                            setStatus({
                                x: coordX,
                                y: coordY,
                                id,
                                type,
                                status: '',
                            }),
                        );
                    }
                    if (cellWithTrigger) {
                        dispatch(
                            setTrigger({
                                id: cellWithTrigger,
                                x: 0,
                                y: 0,
                            }),
                        );
                    }
                }
            }, 1000);
        }
    }, [currentCell]);

    const onClick = () => {
        if (unit && type === 'wall' && coordX && coordY) {
            // определяем самый короткий путь к нужной позиции
            AStar(cells, { x: coordX, y: coordY }, { x: unit.x, y: unit.y }).then((result: any) => {
                if (result === 'Path not found') {
                    return;
                }
                if (result && result.length > 0) {
                    dispatch(setDirectionMovement({ id: 'nimp-1', direction: result }));
                }

                // ставим выделение на клетку, которую юнит будет копать
                dispatch(
                    setStatus({
                        x: coordX,
                        y: coordY,
                        id,
                        type,
                        status: 'digging',
                    }),
                );
                // ставим триггер на клетку, которая находитя перед выделенной клеткой
                // чтобы потом активировать мерцание
                dispatch(
                    setTrigger({
                        id: result.length > 0 ? result[0].id : id,
                        x: coordX,
                        y: coordY,
                    }),
                );
                // запоминаем клетку с триггером в текущем компоненте,
                // чтобы потом удалить триггер
                setCellWithTrigger(result.length > 0 ? result[0].id : id);

                // если клетка находится рядом с юнитом, то он не будет двигаться с места
                // значит сразу вешаем мерцание на клетку, которую нужно раскопать
                if (!result.length) {
                    dispatch(
                        setDiggingActive({
                            x: coordX,
                            y: coordY,
                            digging: true,
                        }),
                    );
                }
            });
        }
    };

    return (
        <div
            ref={elementRef}
            id={id}
            className={clsx(styles.Cell, {
                [styles.Wall]: type === 'wall',
                [styles.Open]: type === 'open',
                [styles.BaseCenter]: type === 'base-center',
                [styles.Digging]: status === 'digging',
                [styles.DiggingActive]: cellFlicker,
            })}
            style={{ width: cellSize, height: cellSize }}
            data-coord-x={coordX}
            data-coord-y={coordY}
            onClick={onClick}
        />
    );
};

export default Cell;
