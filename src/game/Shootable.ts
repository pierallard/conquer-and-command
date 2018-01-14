import {Positionnable} from "./Positionnable";

export interface Shootable extends Positionnable {
    lostLife(life: number): void;
    isAlive(): boolean;
}
