export interface State {
    /**
     * Returns the next state. Used to know what to do in a particular context.
     */
    getNextStep(): State;

    /**
     * Executes the actions related to this current state
     */
    run(): void;
}
