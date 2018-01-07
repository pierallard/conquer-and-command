export class Distance {
    static discCache: PIXI.Point[][] = [];

    static to(from: PIXI.Point | PIXI.Point[], to: PIXI.Point | PIXI.Point[]): number {
        let toArray = (<PIXI.Point[]> ((!(to instanceof Array)) ? [to] : to));
        let fromArray = (<PIXI.Point[]> ((!(from instanceof Array)) ? [from] : from));

        let distances = [];
        toArray.forEach((posTo) => {
            fromArray.forEach((posFrom) => {
                distances.push(this.distance(posTo, posFrom));
            });
        });
        return distances.reduce((dist1, dist2) => {
            return Math.min(dist1, dist2);
        });
    }

    static getClosestPosition(from: PIXI.Point, to: PIXI.Point[]): PIXI.Point {
        let minDistance = null;
        let minPosition = null;
        to.forEach((posTo) => {
            const distance = this.distance(from, posTo);
            if (minDistance === null || minDistance > distance) {
                minPosition = posTo;
                minDistance = distance;
            }
        });

        return minPosition;
    }

    static getClosestItem(from: PIXI.Point, objects: any) {
        let minDistance = null;
        let closest = null;
        for (let i = 0; i < objects.length; i++) {
            const object = objects[i];
            const distance = Distance.to(from, object.getCellPositions());
            if (null === closest || minDistance > distance) {
                minDistance = distance;
                closest = object;
            }
        }

        return closest;
    }

    static getDisc(distance: number): PIXI.Point[] {
        if (!this.discCache[distance]) {
            let result = [];
            for (let x = -distance; x <= distance; x++) {
                for (let y = -distance; y <= distance; y++) {
                    const point = new PIXI.Point(x, y);
                    if (Distance.to(new PIXI.Point(0, 0), point) <= distance) {
                        result.push(point);
                    }
                }
            }
            this.discCache[distance] = result;
        }

        return this.discCache[distance];
    }

    private static distance(posTo: PIXI.Point, posFrom: PIXI.Point) {
        return Math.sqrt(
            (posFrom.x - posTo.x) * (posFrom.x - posTo.x) +
            (posFrom.y - posTo.y) * (posFrom.y - posTo.y)
        );
    }
}
