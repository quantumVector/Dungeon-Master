class Point {
    private inOpenList: boolean = false;

    private inClosedList: boolean = false;

    private startPoint: boolean = false;

    private endPoint: boolean = false;

    private parent: Point = this;

    private h: number = 0;

    private g: number = 0;

    private f: number = 0;

    private value: any;

    private readonly x: number;

    private readonly y: number;

    public constructor(value: any, x: number, y: number) {
        this.value = value;
        this.x = x;
        this.y = y;
    }

    public setValue(value: any): void {
        this.value = value;
    }

    public getG(): number {
        return this.g;
    }

    public getParent(): Point {
        return this.parent;
    }

    public setParent(parent: Point): void {
        this.parent = parent;
    }

    public getF(): number {
        return this.f;
    }

    public isStartPoint(): boolean {
        return this.startPoint;
    }

    public setStartPoint(): void {
        this.startPoint = true;
    }

    public isEndPoint(): boolean {
        return this.endPoint;
    }

    public setEndPoint(): void {
        this.endPoint = true;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public getName(): any {
        return this.value;
    }

    public setHGF(h: number, g: number): void {
        this.h = h * 10;
        this.g = g + this.parent.g;
        this.f = this.h + this.g;
    }

    public addOpenList(): void {
        this.inOpenList = true;
    }

    public isInOpenList(): boolean {
        return this.inOpenList;
    }

    public moveToClosedList(): void {
        this.inClosedList = true;
        this.inOpenList = false;
    }

    public getInClosedList(): boolean {
        return this.inClosedList;
    }
}

const AStar = (cells: any, endPoint: any, startPoint: any) => {
    const delay = 0.1;
    const openList: any = [];
    const closedList = [];
    let targetPoint: any;
    let parentPoint: any;
    const array: any = [];
    const finalPath: any = [];

    cells.forEach((cell: any) => {
        // console.log(cell.x === endPoint.x, cell.y === endPoint.y);

        if (cell.type === 'wall' && cell.x !== endPoint.x && cell.y !== endPoint.y) {
            array[cell.id] = new Point('#', cell.x, cell.y);
        } else if (cell.x === startPoint.x && cell.y === startPoint.y) {
            const point = new Point('S', cell.x, cell.y);
            point.setStartPoint();
            point.setValue(0);
            array[cell.id] = point;
            openList.push(point);
        } else if (cell.x === endPoint.x && cell.y === endPoint.y) {
            const point = new Point('E', cell.x, cell.y);
            point.setEndPoint();
            targetPoint = point;
            array[cell.id] = point;
        } else if (cell.type !== 'wall') {
            array[cell.id] = new Point('0', cell.x, cell.y);
        }
    });

    return new Promise((resolve) => {
        const timer = setInterval(() => {
            if (openList.length !== 0 && targetPointNotInOpenList()) {
                parentPoint = popMinElementFromOpenList();

                if (parentPoint === null) {
                    console.log('Path not found');
                    clearInterval(timer);
                }

                addInClosedList(parentPoint);
                checkPoint(-1, 0);
                checkPoint(-1, -1);
                checkPoint(0, -1);
                checkPoint(1, -1);
                checkPoint(1, 0);
                checkPoint(1, 1);
                checkPoint(0, 1);
                checkPoint(-1, 1);
            } else {
                clearInterval(timer);
                const returned = printAStar();
                if (returned) {
                    resolve('Path not found');
                }
                resolve(finalPath);
            }
        }, delay);
    });

    function printAStar() {
        if (targetPointNotInOpenList()) {
            console.log('Path not found');

            return 'kek';
        }
        let parent = targetPoint.getParent();

        while (!parent.isStartPoint()) {
            // table.rows[parent.getY()].cells[parent.getX()].className = Class.PATH;
            const cellsPrint = cells.find(
                // eslint-disable-next-line prettier/prettier
                (cell: any) => cell.x === parent.getX() && cell.y === parent.getY()
            );
            finalPath.push(cellsPrint);
            targetPoint = parent;
            parent = targetPoint.getParent();
        }
    }
    function targetPointNotInOpenList() {
        for (const property in openList) {
            if (openList[property].isEndPoint()) {
                return false;
            }
        }

        return true;
    }
    function popMinElementFromOpenList() {
        let minF = Infinity;
        let minElementIndex = null;

        for (const index in openList) {
            if (minF > openList[index].getF()) {
                minF = openList[index].getF();
                minElementIndex = index;
            }
        }

        let result;

        if (minElementIndex) {
            result = openList[minElementIndex];
            openList.splice(minElementIndex, 1);
        }

        return result;
    }
    function checkPoint(x: any, y: any) {
        const tmpX = parentPoint.getX() + x;
        const tmpY = parentPoint.getY() + y;
        let verifiablePoint;

        if (array[tmpY]) {
            verifiablePoint = array[tmpY][tmpX];
        }

        array.forEach((point: any) => {
            if (point.x === tmpX && point.y === tmpY) {
                verifiablePoint = point;
            }
        });

        if (
            verifiablePoint &&
            verifiablePoint.getName() !== '#' &&
            !verifiablePoint.getInClosedList()
        ) {
            if (x !== 0 && y !== 0) {
                return;
            }

            const currG = 10;
            const h = Math.abs(tmpX - targetPoint.getX()) + Math.abs(tmpY - targetPoint.getY());
            if (verifiablePoint.isInOpenList()) {
                // стоимость от новой закрытой точки
                const newG = parentPoint.getG() + currG;
                // прыдущая стоимость
                const oldG = verifiablePoint.getG();
                if (newG <= oldG) {
                    verifiablePoint.setParent(parentPoint);
                    verifiablePoint.setHGF(h, currG);
                }
            } else {
                verifiablePoint.setParent(parentPoint);

                verifiablePoint.setHGF(h, currG);
                addInOpenList(verifiablePoint);
            }
        }
    }

    function addInOpenList(point: any) {
        // setPointClass(point, Class.OPEN);
        point.addOpenList();
        openList.push(point);
    }
    function addInClosedList(point: any) {
        // setPointClass(point, Class.CLOSED);
        point.moveToClosedList();
        closedList.push(point);
    }
};

export default AStar;
