import {MovedSprite} from "./MovedSprite";
import {Ground, GROUND_SIZE} from "../Ground";
import {UnitRepository} from "../repository/UnitRepository";
import {SCALE} from "../state/Play";

export class AStarSprite extends MovedSprite
{
    private spriteGoal: Phaser.Point = null;
    private ground: Ground;
    private canMove: boolean = true;

    constructor(unitRepository: UnitRepository, x: number, y: number, ground: Ground) {

        super(unitRepository, AStarSprite.getClosest(x), AStarSprite.getClosest(y), 'Tank11', 1000);
        this.ground = ground;
    }

    update()
    {
        if (this.isSelected() && this.game.input.activePointer.rightButton.isDown) {
            this.spriteGoal = new Phaser.Point(AStarSprite.getClosest(this.game.input.mousePointer.x), AStarSprite.getClosest(this.game.input.mousePointer.y));
        }

        if (this.spriteGoal && this.canMove) {
            const path = this.getPath();

            if (path) {
                this.x = AStarSprite.apply(path.firstStep().x);
                this.y = AStarSprite.apply(path.firstStep().y);

                this.canMove = false;

                this.unitRepository.play_.game.time.events.add(Phaser.Timer.SECOND / 8, () => {
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
        let firstPath = new Path(new Phaser.Point(
            AStarSprite.getGroundPos(this.spriteGoal.x),
            AStarSprite.getGroundPos(this.spriteGoal.y)
        ));
        firstPath.add(AStarSprite.getGroundPos(this.x), AStarSprite.getGroundPos(this.y));

        let paths = new Paths();
        paths.add(firstPath);

        let tries = 100;
        while (tries > 0) {
            let path = paths.getBetterConfidence();
            const nextPositions = path.getNextPositions().filter((position) => {
                return this.ground.isAccessible(position);
            });
            path.setDone();

            for (let i = 0; i < nextPositions.length; i++) {
                const nextPosition = nextPositions[i];
                let newPath = path.clonez().add(nextPosition.x, nextPosition.y);

                let existingPath = paths.getExistingThrough(nextPosition.x, nextPosition.y);
                if (!existingPath) {
                    if (
                        nextPosition.x === AStarSprite.getGroundPos(this.spriteGoal.x) &&
                        nextPosition.y === AStarSprite.getGroundPos(this.spriteGoal.y)
                    ) {
                        console.log('found! ' + newPath.toString());
                        return newPath;
                    }
                    paths.add(newPath);
                }
            }

            tries--;
        }

        return null;
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
            new Phaser.Point(lastStep.x - 1, lastStep.y - 1),
            new Phaser.Point(lastStep.x, lastStep.y - 1),
            new Phaser.Point(lastStep.x + 1, lastStep.y - 1),
            new Phaser.Point(lastStep.x + 1, lastStep.y),
            new Phaser.Point(lastStep.x + 1, lastStep.y + 1),
            new Phaser.Point(lastStep.x, lastStep.y + 1),
            new Phaser.Point(lastStep.x - 1, lastStep.y + 1),
            new Phaser.Point(lastStep.x - 1, lastStep.y),
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
}
