import { Card } from "../Card";

/**
 * Represents the result of a mulligan.
 */
export class MulliganResult {
    constructor(
        public success: boolean,
        public card?: Card,
        public previousCard?: Card,
    ) { }
}
