export class AStar
{
    static nextStep(
        cellPosition: PIXI.Point,
        cellGoal: PIXI.Point,
        isPositionAccessible: (position: PIXI.Point) => boolean
    ): PIXI.Point {
        const path = AStar.getPath(cellPosition, cellGoal, isPositionAccessible);
        if (null === path) {
            return null;
        }

        return path.firstStep();
    }

    private static getFirstEmptyPlace(position: PIXI.Point, isPositionAccessible: (position: PIXI.Point) => boolean): PIXI.Point {
        let radius = 0;
        while (true) {
            for (let i = -radius; i <= radius; i++) {
                for (let j = -radius; j <= radius; j++) {
                    let test = new PIXI.Point(position.x + i, position.y + j);
                    if (isPositionAccessible(test)) {
                        return test;
                    }
                }
            }
            radius += 1;
        }
    }

    private static getPath(
        cellPosition: PIXI.Point,
        cellGoal: PIXI.Point,
        isPositionAccessible: (position: PIXI.Point) => boolean
    ): Path {
        let goal = cellGoal;
        if (!isPositionAccessible(cellGoal)) {
            goal = this.getFirstEmptyPlace(goal, isPositionAccessible);
        }

        let firstPath = new Path(goal);
        firstPath.add(cellPosition);
        let paths = new Paths();
        paths.add(firstPath);

        let tries = 200;
        while (tries > 0) {
            let path = paths.getBetterConfidence();
            if (!path) {
                return null;
            }
            const nextPositions = path.getNextPositions().filter(isPositionAccessible.bind(this));
            path.setDone();

            for (let i = 0; i < nextPositions.length; i++) {
                tries--;
                const nextPosition = nextPositions[i];
                let newPath = path.clonez().add(nextPosition);

                let existingPath = paths.getExistingThrough(nextPosition);
                if (!existingPath) {
                    if (
                        nextPosition.x === goal.x &&
                        nextPosition.y === goal.y
                    ) {
                        return newPath;
                    }
                    paths.add(newPath);
                } else {
                    const newWeight = newPath.weight();
                    const oldWeight = existingPath.weightUntil(nextPosition);
                    if (newWeight < oldWeight) {
                        existingPath.replaceBeginWith(newPath);
                    }
                }
            }
        }

        return null;
    }
}

class Paths {
    private paths: Path[];

    constructor() {
        this.paths = [];
    }

    add(path: Path): void {
        this.paths.push(path);
    }

    getExistingThrough(position: PIXI.Point): Path {
        for (let i = 0; i < this.paths.length; i++) {
            if (this.paths[i].passThrough(position)) {
                return this.paths[i];
            }
        }

        return null;
    }

    length(): number {
        return this.paths.length;
    }

    getBetterConfidence(): Path {
        const sortedPaths = this.paths.filter((path) => {
            return path.isNotDone();
        }).sort((path1, path2) => {
            return path1.getConfidence() - path2.getConfidence();
        });

        return sortedPaths[0];
    }
}

class Path
{
    private steps: PIXI.Point[];
    private goal: PIXI.Point;
    private confidence: number;
    private done: boolean = false;

    constructor(goal: PIXI.Point) {
        this.goal = goal;
        this.steps = [];
    }

    add(position: PIXI.Point): Path {
        this.steps.push(position);
        this.confidence = Math.sqrt((position.x - this.goal.x) * (position.x - this.goal.x) + (position.y - this.goal.y) * (position.y - this.goal.y));

        return this;
    }

    getNextPositions(): PIXI.Point[] {
        const lastStep = this.steps[this.steps.length - 1];
        return [
            new PIXI.Point(lastStep.x, lastStep.y - 1),
            new PIXI.Point(lastStep.x + 1, lastStep.y),
            new PIXI.Point(lastStep.x, lastStep.y + 1),
            new PIXI.Point(lastStep.x - 1, lastStep.y),
            new PIXI.Point(lastStep.x - 1, lastStep.y - 1),
            new PIXI.Point(lastStep.x + 1, lastStep.y - 1),
            new PIXI.Point(lastStep.x + 1, lastStep.y + 1),
            new PIXI.Point(lastStep.x - 1, lastStep.y + 1),
        ];
    }

    clonez() {
        let result = new Path(this.goal);
        this.steps.forEach((step) => {
            result.add(step);
        });
        return result;
    }

    toString() {
        return this.steps.map((step) => { return '(' + step.x + ', ' + step.y + ')'}).join(', ');
    }

    passThrough(position: PIXI.Point): boolean {
        for (let i = 0; i < this.steps.length; i++) {
            if (this.steps[i].x === position.x && this.steps[i].y === position.y) {
                return true;
            }
        }

        return false;
    }

    getConfidence(): number {
        return this.confidence;
    }

    firstStep() {
        return this.steps[1];
    }

    setDone() {
        this.done = true;
    }

    isNotDone() {
        return this.done === false;
    }

    weight() {
        let weight = 0;
        for (let i = 0; i < this.steps.length - 1; i++) {
            weight += Math.sqrt(
                (this.steps[i].x - this.steps[i + 1].x) * (this.steps[i].x - this.steps[i + 1].x) +
                (this.steps[i].y - this.steps[i + 1].y) * (this.steps[i].y - this.steps[i + 1].y)
            );
        }

        return weight;
    }

    weightUntil(position): number {
        let weight = 0;
        for (let i = 0; i < this.steps.length - 1; i++) {
            weight += Math.sqrt(
                (this.steps[i].x - this.steps[i + 1].x) * (this.steps[i].x - this.steps[i + 1].x) +
                (this.steps[i].y - this.steps[i + 1].y) * (this.steps[i].y - this.steps[i + 1].y)
            );
            if (this.steps[i].x === position.x && this.steps[i].y === position.y) {
                return weight;
            }
        }

        return weight;
    }

    replaceBeginWith(newPath: Path) {
        let newSteps = [];
        for (let i = 0; i < newPath.steps.length; i++) {
            newSteps.push(newPath.steps[i]);
        }
        let add = false;
        const x = newPath.steps[newPath.steps.length - 1].x;
        const y = newPath.steps[newPath.steps.length - 1].y;
        for (let i = 0; i < this.steps.length; i++) {
            if (add) {
                newSteps.push(this.steps[i])
            } else if (this.steps[i].x === x && this.steps[i].y === y) {
                add = true;
            }
        }
        this.steps = newSteps;
    }
}
