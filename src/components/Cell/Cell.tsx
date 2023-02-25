import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import styles from './Cell.module.scss';
import { setCoords } from '../../store/cellsSlice';
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
}

const Cell = ({ id, cellSize, coordX, coordY, type }: CellSizeProps) => {
    const dispatch = useAppDispatch();

    const cells = useAppSelector((state) => state.cells.cells);
    const unit = useAppSelector((state) => state.NPC.NPC.find((npc) => npc.id === 'nimp-1'));

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

    const onClick = () => {
        if (unit && type === 'wall') {
            AStar(cells, { x: coordX, y: coordY }, { x: unit.x, y: unit.y }).then((result: any) => {
                if (result && result.length > 0) {
                    dispatch(setDirectionMovement({ id: 'nimp-1', direction: result }));
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
            })}
            style={{ width: cellSize, height: cellSize }}
            data-coord-x={coordX}
            data-coord-y={coordY}
            onClick={onClick}
        />
    );
};

export default Cell;
