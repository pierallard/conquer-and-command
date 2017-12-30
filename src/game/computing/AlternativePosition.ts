import {GROUND_HEIGHT, GROUND_WIDTH} from "../map/GeneratedGround";
const MAX_SEARCH_RADIUS = 20;

export class AlternativePosition {
    static zones: PIXI.Point[][];

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
        let zones = this.getZones(isAccessible, currentPosition);
        for (let radius = 0; radius < MAX_SEARCH_RADIUS; radius++) {
            const points = this.getPointsFromRadius(goalPosition, radius);
            let foundAccessible = false;
            for (let i = 0; i < points.length; i++) {
                let test = points[i];
                if (currentPosition.x === test.x && currentPosition.y === test.y) {
                    return true;
                }
                if (isAccessible(test) &&
                    AlternativePosition.getZone(zones, test) ===
                    AlternativePosition.getZone(zones, currentPosition)) {
                    foundAccessible = true;
                }
            }
            if (foundAccessible) {
                return false;
            }
        }

        return true;
    }

    public static getSquareClosest(position: PIXI.Point, radius: number = 0) {
        let result = [];
        for (let x = position.x - radius; x <= position.x + radius; x++) {
            for (let y = position.y - radius; y <= position.y + radius; y++) {
                result.push(new PIXI.Point(x, y));
            }
        }

        console.log(result);

        return result;
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
        let zones = this.getZones(isAccessible, currentPosition);
        for (let radius = 0; radius < MAX_SEARCH_RADIUS; radius++) {
            let possiblePositions = this.getPointsFromRadius(goalPosition, radius);
            possiblePositions = possiblePositions.filter((pos) => {
                return isAccessible(pos) &&
                    AlternativePosition.getZone(zones, pos) ===
                    AlternativePosition.getZone(zones, currentPosition);
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

    static getZones(isAccessible: (point: PIXI.Point) => boolean, source: PIXI.Point = null) {
        if (this.zones) {
            return this.zones;
        }

        this.zones = [];
        for (let y = 0; y < GROUND_HEIGHT; y++) {
            for (let x = 0; x < GROUND_WIDTH; x++) {
                const point = new PIXI.Point(x, y);
                if ((null !== source && source.x === x && source.y === y) || isAccessible(point)) {
                    if (y === 0 && x === 0) {
                        this.zones.push([point]);
                    } else if (y === 0) {
                        const leftZone = AlternativePosition.getZone(this.zones, new PIXI.Point(x - 1, y));
                        if (null !== leftZone) {
                            this.zones[leftZone].push(point);
                        } else {
                            this.zones.push([point]);
                        }
                    } else if (x === 0) {
                        const topZone = AlternativePosition.getZone(this.zones, new PIXI.Point(x, y - 1));
                        if (null !== topZone) {
                            this.zones[topZone].push(point);
                        } else {
                            this.zones.push([point]);
                        }
                    } else {
                        const topLeftZone = AlternativePosition.getZone(this.zones, new PIXI.Point(x - 1, y - 1));
                        const leftZone = AlternativePosition.getZone(this.zones, new PIXI.Point(x - 1, y));
                        const topZone = AlternativePosition.getZone(this.zones, new PIXI.Point(x, y - 1));
                        let neighbourZones = [topLeftZone, leftZone, topZone].filter((zone) => {
                            return null !== zone;
                        });
                        neighbourZones = Array.from(new Set(neighbourZones)).sort((a, b) => {
                            return a - b;
                        });
                        if (neighbourZones.length === 0) {
                            this.zones.push([point]);
                        } else {
                            this.zones[neighbourZones[0]].push(point);
                            if (neighbourZones.length > 1) {
                                for (let i = 1; i < neighbourZones.length; i++) {
                                    this.zones[neighbourZones[0]] = this.zones[neighbourZones[0]]
                                        .concat(this.zones[neighbourZones[i]]);
                                    this.zones[neighbourZones[i]] = [];
                                }
                            }
                        }
                    }
                }
            }
        }

        return this.zones;
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
}
