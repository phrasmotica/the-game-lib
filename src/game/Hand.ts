import { Card } from "./Card"

/**
 * Represents a player's hand.
 */
export class Hand {
    /**
     * Creates a new hand.
     */
    constructor(
        public cards: Card[]
    ) { }

    /**
     * Returns a concrete hand object. Use when processing naive message from the server.
     */
    static from(hand: Hand) {
        return new Hand(hand.cards)
    }

    /**
     * Returns the size of the hand.
     */
    size() {
        return this.cards.length
    }

    /**
     * Returns whether the hand is empty.
     */
    isEmpty() {
        return this.size() === 0
    }

    /**
     * Adds a new random card to the hand.
     */
    add(card: Card) {
        this.cards.push(card)
    }

    /**
     * Removes the card at the given index from the hand.
     */
    remove(card: Card) {
        let index = this.cards.findIndex(c => c.value === card.value)
        this.cards.splice(index, 1)
    }

    /**
     * Returns a new hand containing this hand's cards sorted into ascending order.
     */
    sort() {
        return new Hand(this.cards.sort((a, b) => a.value - b.value))
    }
}
