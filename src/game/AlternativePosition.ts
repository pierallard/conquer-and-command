const MAX_SEARCH_RADIUS = 20;

export class AlternativePosition
{
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
        for (let radius = 1; radius < MAX_SEARCH_RADIUS; radius++) {
            let foundAccessible = false;
            for (let x = -radius + 1; x <= radius - 1; x++) {
                for (let y = -radius + 1; y <= radius - 1; y++) {
                    let test = new PIXI.Point(goalPosition.x + x, goalPosition.y + y);
                    if (currentPosition.x === test.x && currentPosition.y === test.y) {
                        return true;
                    }
                    if (isAccessible(test)) {
                        foundAccessible = true;
                    }
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
     * @returns {PIXI.Point}
     */
    public static getClosestAvailable(
        goalPosition: PIXI.Point,
        currentPosition: PIXI.Point,
        isAccessible: (point: PIXI.Point) => boolean
    ): PIXI.Point {
        for (let radius = 1; radius < MAX_SEARCH_RADIUS; radius++) {
            let possiblePositions = [];
            for (let x = -radius + 1; x <= radius - 1; x++) {
                for (let y = -radius + 1; y <= radius - 1; y++) {
                    let test = new PIXI.Point(goalPosition.x + x, goalPosition.y + y);
                    if (isAccessible(test)) {
                        possiblePositions.push(test);
                    }
                }
            }
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
}
