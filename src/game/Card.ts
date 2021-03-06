/**
 * Represents a card.
 */
export class Card {
    constructor(
        public value: number,
        public revealed: boolean,
    ) { }

    /**
     * Returns a new card from the given card instance.
     */
    static from(card: Card) {
        return new Card(card.value, card.revealed)
    }
}
