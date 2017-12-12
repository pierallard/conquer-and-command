import {MovedSprite} from "./MovedSprite";
import {Ground, GROUND_SIZE} from "../Ground";
import {UnitRepository} from "../repository/UnitRepository";
import {SCALE} from "../state/Play";

const MOVE_TIME = Phaser.Timer.SECOND / 4;
const MAKE_ANIM = true;

export class AStarSprite extends MovedSprite
{
    private spriteGoal: Phaser.Point = null;
    private ground: Ground;
    private canMove: boolean = true;
    public positionWithoutAnim: Phaser.Point;

    constructor(unitRepository: UnitRepository, x: number, y: number, ground: Ground) {
        super(unitRepository, AStarSprite.getClosest(x), AStarSprite.getClosest(y), 'Tank11', 1000);

        this.positionWithoutAnim = new Phaser.Point(AStarSprite.getClosest(x), AStarSprite.getClosest(y));
        this.ground = ground;
    }

    isPositionAccessible(position): boolean {
        return this.ground.isAccessible(position) && this.unitRepository.isNotOccupied(new Phaser.Point(
            AStarSprite.apply(position.x),
            AStarSprite.apply(position.y)
        ));
    };

    getFirstEmptyPlace(x: number, y: number)
    {
        let radius = 0;
        while (true) {
            for (let i = -radius; i <= radius; i++) {
                for (let j = -radius; j <= radius; j++) {
                    if (this.isPositionAccessible(new Phaser.Point(x + i, y + j))) {
                        return new Phaser.Point(x + i, y + j);
                    }
                }
            }
            radius += 1;
        }
    }

    isArrived()
    {
        if (!this.spriteGoal) {
            return true;
        }

        const goalX = AStarSprite.getGroundPos(this.spriteGoal.x);
        const goalY = AStarSprite.getGroundPos(this.spriteGoal.y);
        const thisX = AStarSprite.getGroundPos(this.positionWithoutAnim.x);
        const thisY = AStarSprite.getGroundPos(this.positionWithoutAnim.y);
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
            this.spriteGoal = new Phaser.Point(AStarSprite.getClosest(this.game.input.mousePointer.x), AStarSprite.getClosest(this.game.input.mousePointer.y));
            if (this.isArrived()) {
                this.spriteGoal = null;
            }
        }

        if (this.spriteGoal && this.canMove) {
            const path = this.getPath();

            if (path) {
                this.loadRotation(this.getRotation(new Phaser.Point(
                    AStarSprite.apply(path.firstStep().x) - this.x,
                    AStarSprite.apply(path.firstStep().y) - this.y
                )));

                this.positionWithoutAnim.x = AStarSprite.apply(path.firstStep().x);
                this.positionWithoutAnim.y = AStarSprite.apply(path.firstStep().y);

                if (MAKE_ANIM) {
                    this.unitRepository.play_.game.add.tween(this).to({
                        x: this.positionWithoutAnim.x,
                        y: this.positionWithoutAnim.y
                    }, MOVE_TIME, Phaser.Easing.Default, true);
                } else {
                    this.x = this.positionWithoutAnim.x;
                    this.y = this.positionWithoutAnim.y;
                }

                if (this.isArrived()) {
                    console.log('arrive');
                    this.spriteGoal = null;
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
        return (GROUND_SIZE * SCALE) * this.getGroundPos(position) + (GROUND_SIZE * SCALE)/2;
    }

    static apply(position) {
        return GROUND_SIZE * SCALE * position + (GROUND_SIZE * SCALE)/2
    }

    static getGroundPos(position) {
        return Math.round((position - (GROUND_SIZE * SCALE)/2) / (GROUND_SIZE * SCALE));
    }

    private getPath() {
        let goal = this.spriteGoal;
        if (!this.isPositionAccessible(new Phaser.Point(
            AStarSprite.getGroundPos(this.spriteGoal.x),
            AStarSprite.getGroundPos(this.spriteGoal.y))
        )) {
            console.log('get new goal');
            goal = this.getClosestGoal();
        }

        let firstPath = new Path(new Phaser.Point(
            AStarSprite.getGroundPos(goal.x),
            AStarSprite.getGroundPos(goal.y)
        ));
        firstPath.add(AStarSprite.getGroundPos(this.x), AStarSprite.getGroundPos(this.y));

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
                        nextPosition.x === AStarSprite.getGroundPos(goal.x) &&
                        nextPosition.y === AStarSprite.getGroundPos(goal.y)
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
        const result = this.getFirstEmptyPlace(
            AStarSprite.getGroundPos(this.spriteGoal.x),
            AStarSprite.getGroundPos(this.spriteGoal.y)
        );
        return new Phaser.Point(AStarSprite.apply(result.x), AStarSprite.apply(result.y));
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
    private steps: Phaser.Point[];
    private confidence: number;
    private goal: Phaser.Point;
    private done: boolean = false;

    constructor(goal: Phaser.Point)
    {
        this.goal = goal;
        this.steps = [];
    }

    add(x: number, y: number) {
        this.steps.push(new Phaser.Point(x, y));
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
