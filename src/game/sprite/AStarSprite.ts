import {MovedSprite} from "./MovedSprite";
import {Ground, GROUND_SIZE} from "../Ground";
import {UnitRepository} from "../repository/UnitRepository";
import {SCALE} from "../state/Play";

const MOVE_TIME = Phaser.Timer.SECOND / 4;
const MAKE_ANIM = true;

export class AStarSprite extends MovedSprite
{
    private cellGoal: PIXI.Point = null;
    private ground: Ground;
    private canMove: boolean = true;
    private cellPosition: PIXI.Point;

    constructor(unitRepository: UnitRepository, x: number, y: number, ground: Ground) {
        super(
            unitRepository,
            AStarSprite.cellToReal(AStarSprite.realToCell(x)),
            AStarSprite.cellToReal(AStarSprite.realToCell(y)),
            'Tank11',
            1000
        );

        this.cellPosition = new PIXI.Point(AStarSprite.realToCell(x), AStarSprite.realToCell(y));
        this.ground = ground;
    }

    getCellPosition(): PIXI.Point {
        return this.cellPosition;
    }

    isPositionAccessible(position: PIXI.Point): boolean {
        return this.ground.isCellAccessible(position) && this.unitRepository.isCellNotOccupied(position);
    };

    getFirstEmptyPlace(position: PIXI.Point): PIXI.Point
    {
        let radius = 0;
        while (true) {
            for (let i = -radius; i <= radius; i++) {
                for (let j = -radius; j <= radius; j++) {
                    let test = new PIXI.Point(position.x + i, position.y + j);
                    if (this.isPositionAccessible(test)) {
                        return test;
                    }
                }
            }
            radius += 1;
        }
    }

    isArrived()
    {
        if (!this.cellGoal) {
            return true;
        }

        const goalX = this.cellGoal.x;
        const goalY = this.cellGoal.y;
        const thisX = this.cellPosition.x;
        const thisY = this.cellPosition.y;
        let radius = 0;

        while(radius < 20) {
            let foundEmptyPlace = false;
            let foundThis = false;
            for (let i = -radius; i <= radius; i++) {
                for (let j = -radius; j <= radius; j++) {
                    if (this.isPositionAccessible(new Phaser.Point(goalX + i, goalY + j))) {
                        foundEmptyPlace = true;
                    }
                    if (goalX + i === thisX && goalY + j === thisY) {
                        foundThis = true;
                    }
                }
            }

            if (foundThis) {
                return true;
            }
            if (foundEmptyPlace && !foundThis) {
                return false;
            }

            radius++;
        }
    }

    update()
    {
        if (this.isSelected() && this.game.input.activePointer.rightButton.isDown) {
            this.cellGoal = new PIXI.Point(
                AStarSprite.realToCell(this.game.input.mousePointer.x),
                AStarSprite.realToCell(this.game.input.mousePointer.y)
            );
            if (this.isArrived()) {
                console.log('is arrived!');
                this.cellGoal = null;
            }
        }

        if (this.cellGoal && this.canMove) {
            const path = this.getPath();

            if (path) {
                this.loadRotation(this.getRotation(new Phaser.Point(
                    AStarSprite.cellToReal(path.firstStep().x) - this.x,
                    AStarSprite.cellToReal(path.firstStep().y) - this.y
                )));

                this.cellPosition = path.firstStep();

                if (MAKE_ANIM) {
                    this.unitRepository.play_.game.add.tween(this).to({
                        x: AStarSprite.cellToReal(this.cellPosition.x),
                        y: AStarSprite.cellToReal(this.cellPosition.y)
                    }, MOVE_TIME, Phaser.Easing.Default, true);
                } else {
                    this.x = AStarSprite.cellToReal(this.cellPosition.x);
                    this.y = AStarSprite.cellToReal(this.cellPosition.y);
                }

                if (this.isArrived()) {
                    console.log('arrive');
                    this.cellGoal = null;
                }

                this.canMove = false;
                this.unitRepository.play_.game.time.events.add(MOVE_TIME, () => {
                    this.canMove = true;
                }, this);
            }
        }

        super.update();
    }

    static getClosest(position)
    {
        return (GROUND_SIZE * SCALE) * this.realToCell(position) + (GROUND_SIZE * SCALE)/2;
    }

    static cellToReal(position) {
        return GROUND_SIZE * SCALE * position + (GROUND_SIZE * SCALE)/2
    }

    static realToCell(position) {
        return Math.round((position - (GROUND_SIZE * SCALE)/2) / (GROUND_SIZE * SCALE));
    }

    private getPath() {
        let goal = this.cellGoal;
        if (!this.isPositionAccessible(this.cellGoal)) {
            console.log('get new goal');
            goal = this.getClosestGoal();
        }

        let firstPath = new Path(goal);
        firstPath.add(this.cellPosition.x, this.cellPosition.y);
        let paths = new Paths();
        paths.add(firstPath);

        let tries = 100;
        while (tries > 0) {
            let path = paths.getBetterConfidence();
            if (!path) {
                return null;
            }
            const nextPositions = path.getNextPositions().filter(this.isPositionAccessible.bind(this));
            path.setDone();

            for (let i = 0; i < nextPositions.length; i++) {
                const nextPosition = nextPositions[i];
                let newPath = path.clonez().add(nextPosition.x, nextPosition.y);

                let existingPath = paths.getExistingThrough(nextPosition.x, nextPosition.y);
                if (!existingPath) {
                    if (
                        nextPosition.x === goal.x &&
                        nextPosition.y === goal.y
                    ) {
                        console.log('found after ' + paths.length() + ' tries! ' + newPath.toString());
                        return newPath;
                    }
                    paths.add(newPath);
                } else {
                    const newWeight = newPath.weight();
                    const oldWeight = existingPath.weightUntil(nextPosition.x, nextPosition.y);
                    if (newWeight < oldWeight) {
                        existingPath.replaceBeginWith(newPath);
                    }
                }
            }

            tries--;
        }

        // console.log('No paths found.');
        return null;
    }

    private getClosestGoal() {
        return this.getFirstEmptyPlace(this.cellGoal);
    }
}

class Paths
{
    private paths: Path[];

    constructor()
    {
        this.paths = [];
    }

    add(path: Path) {
        this.paths.push(path);
    }

    getExistingThrough(x: number, y: number) {
        for (let i = 0; i < this.paths.length; i++) {
            if (this.paths[i].passThrough(x, y)) {
                return this.paths[i];
            }
        }

        return null;
    }

    length() {
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
    private confidence: number;
    private goal: PIXI.Point;
    private done: boolean = false;

    constructor(goal: PIXI.Point)
    {
        this.goal = goal;
        this.steps = [];
    }

    add(x: number, y: number) {
        this.steps.push(new PIXI.Point(x, y));
        this.confidence = Math.sqrt((x - this.goal.x) * (x - this.goal.x) + (y - this.goal.y) * (y - this.goal.y));

        return this;
    }

    getNextPositions(): Phaser.Point[] {
        const lastStep = this.steps[this.steps.length - 1];
        return [
            new Phaser.Point(lastStep.x, lastStep.y - 1),
            new Phaser.Point(lastStep.x + 1, lastStep.y),
            new Phaser.Point(lastStep.x, lastStep.y + 1),
            new Phaser.Point(lastStep.x - 1, lastStep.y),
            new Phaser.Point(lastStep.x - 1, lastStep.y - 1),
            new Phaser.Point(lastStep.x + 1, lastStep.y - 1),
            new Phaser.Point(lastStep.x + 1, lastStep.y + 1),
            new Phaser.Point(lastStep.x - 1, lastStep.y + 1),
        ];
    }

    clonez() {
        let result = new Path(this.goal);
        this.steps.forEach((step) => {
            result.add(step.x, step.y);
        });
        return result;
    }

    toString() {
        return this.steps.map((step) => { return '(' + step.x + ', ' + step.y + ')'}).join(', ');
    }

    passThrough(x: number, y: number): boolean {
        for (let i = 0; i < this.steps.length; i++) {
            if (this.steps[i].x === x && this.steps[i].y === y) {
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

    weightUntil(x: number, y: number): number {
        let weight = 0;
        for (let i = 0; i < this.steps.length - 1; i++) {
            weight += Math.sqrt(
                (this.steps[i].x - this.steps[i + 1].x) * (this.steps[i].x - this.steps[i + 1].x) +
                (this.steps[i].y - this.steps[i + 1].y) * (this.steps[i].y - this.steps[i + 1].y)
            );
            if (this.steps[i].x === x && this.steps[i].y === y) {
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
