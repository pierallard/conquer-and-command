import {AStar} from "./AStar";
import {GAME_HEIGHT, GAME_WIDTH} from "../../app";
import {GROUND_HEIGHT, GROUND_WIDTH} from "../map/GeneratedGround";
const MAX_SEARCH_RADIUS = 20;

export class AlternativePosition {
    /**
     * Returns true if the unit is arrived to its goal, or close enough to be considered as arrived.
     *
     * @param goalPosition    The goal position
     * @param currentPosition The current position of the unit
     * @param isAccessible    This method checks if a position is accessible by this unit
     * @returns {boolean}
     */
    public static isArrived(
        goalPosition: PIXI.Point,
        currentPosition: PIXI.Point,
        isAccessible: (point: PIXI.Point) => boolean
    ): boolean {
        for (let radius = 0; radius < MAX_SEARCH_RADIUS; radius++) {
            const points = this.getPointsFromRadius(goalPosition, radius);
            let foundAccessible = false;
            for (let i = 0; i < points.length; i++) {
                let test = points[i];
                if (currentPosition.x === test.x && currentPosition.y === test.y) {
                    return true;
                }
                if (isAccessible(test) && null !== AStar.getPath(currentPosition, test, isAccessible)) {
                    foundAccessible = true;
                }
            }
            if (foundAccessible) {
                return false;
            }
        }

        return true;
    }

    /**
     * Returns the closest available position to be considered as arrived.
     *
     * @param goalPosition    The goal position
     * @param currentPosition The current position of the unit
     * @param isAccessible    This method checks if a position is accessible by this unit
     * @returns {{PIXI.Point}}
     */
    public static getClosestAvailable(
        goalPosition: PIXI.Point,
        currentPosition: PIXI.Point,
        isAccessible: (point: PIXI.Point) => boolean
    ): PIXI.Point {
        for (let radius = 0; radius < MAX_SEARCH_RADIUS; radius++) {
            let possiblePositions = this.getPointsFromRadius(goalPosition, radius);
            possiblePositions = possiblePositions.filter((pos) => {
                AlternativePosition.hasAPathTo(goalPosition, currentPosition, isAccessible);
                return isAccessible(pos) && null !== AStar.getPath(currentPosition, pos, isAccessible);
            });

            if (possiblePositions.length) {
                possiblePositions.sort((pos1: PIXI.Point, pos2: PIXI.Point) => {
                    return (
                            (pos1.x - currentPosition.x) * (pos1.x - currentPosition.x) +
                            (pos1.y - currentPosition.y) * (pos1.y - currentPosition.y)
                        ) - (
                            (pos2.x - currentPosition.x) * (pos2.x - currentPosition.x) +
                            (pos2.y - currentPosition.y) * (pos2.y - currentPosition.y)
                        );
                });

                return possiblePositions[0];
            }
        }

        return null;
    }

    private static getPointsFromRadius(position: PIXI.Point, radius: number): PIXI.Point[] {
        let possiblePositions = [];

        if (radius === 0) {
            possiblePositions.push(new PIXI.Point(position.x, position.y));
        } else {
            for (let x = -radius; x <= radius; x++) {
                possiblePositions.push(new PIXI.Point(position.x + x, position.y - radius));
                possiblePositions.push(new PIXI.Point(position.x + x, position.y + radius));
            }

            for (let y = -radius; y <= radius; y++) {
                possiblePositions.push(new PIXI.Point(position.x - radius, position.y + y));
                possiblePositions.push(new PIXI.Point(position.x + radius, position.y + y));
            }
        }

        return possiblePositions;
    }

    private static hasAPathTo(
        goalPosition: PIXI.Point,
        currentPosition: PIXI.Point,
        isAccessible: (point: PIXI.Point) => boolean
    ): boolean {
        let zones = [];
        for (let y = 0; y < GROUND_HEIGHT; y++) {
            for (let x = 0; x < GROUND_WIDTH; x++) {
                const point = new PIXI.Point(x, y);
                if (isAccessible(point)) {
                    if (y === 0 && x === 0) {
                        zones.push([point]);
                    } else if (y === 0) {
                        const leftZone = AlternativePosition.getZone(zones, new PIXI.Point(x - 1, y));
                        if (null !== leftZone) {
                            zones[leftZone].push(point);
                        } else {
                            zones.push([point]);
                        }
                    } else if (x === 0) {
                        const topZone = AlternativePosition.getZone(zones, new PIXI.Point(x, y - 1));
                        if (null !== topZone) {
                            zones[topZone].push(point);
                        } else {
                            zones.push([point]);
                        }
                    } else {
                        const topLeftZone = AlternativePosition.getZone(zones, new PIXI.Point(x - 1, y - 1));
                        const leftZone = AlternativePosition.getZone(zones, new PIXI.Point(x - 1, y));
                        const topZone = AlternativePosition.getZone(zones, new PIXI.Point(x, y - 1));
                        let neighbourZones = [topLeftZone, leftZone, topZone].filter((zone) => {
                            return null !== zone;
                        });
                        neighbourZones = Array.from(new Set(neighbourZones));
                        if (neighbourZones.length === 0) {
                            zones.push([point]);
                        } else {
                            zones[neighbourZones[0]].push(point);
                            zones = AlternativePosition.mergeZones(zones, neighbourZones);
                        }
                    }
                }
            }
        }

        console.log(zones);

        return true;
    }

    private static getZone(zones: PIXI.Point[][], point: PIXI.Point) {
        for (let i = 0; i < zones.length; i++) {
            for (let j = 0; j < zones[i].length; j++) {
                if (zones[i][j].x === point.x && zones[i][j].y === point.y) {
                    return i;
                }
            }
        }

        return null;
    }

    private static mergeZones(zones: PIXI.Point[][], neighbourZones: number[]): PIXI.Point[][] {
        for (let i = 1; i < neighbourZones.length; i++) {
            zones[0] = zones[0].concat(zones[i]);
            zones[i] = [];
        }

        return zones;
    }
}
