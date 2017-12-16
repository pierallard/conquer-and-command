export class Distance {
    static to(from: PIXI.Point | PIXI.Point[], to: PIXI.Point | PIXI.Point[]) {
        let toArray = (<PIXI.Point[]> ((!(to instanceof Array)) ? [to] : to));
        let fromArray = (<PIXI.Point[]> ((!(from instanceof Array)) ? [from] : from));

        let distances = [];
        toArray.forEach((posTo) => {
            fromArray.forEach((posFrom) => {
                distances.push(Math.sqrt(
                    (posFrom.x - posTo.x) * (posFrom.x - posTo.x) +
                    (posFrom.y - posTo.y) * (posFrom.y - posTo.y)
                ));
            });
        });
        return distances.reduce((dist1, dist2) => {
            return Math.min(dist1, dist2);
        });
    }

    static getClosest(from: PIXI.Point, objects: any) {
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
}
