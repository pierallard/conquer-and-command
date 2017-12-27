import {AStar} from "./AStar";
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
                if (isAccessible(test) && null !== AStar.getPath(currentPosition, goalPosition, isAccessible)) {
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
                return isAccessible(pos);
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
}
