import { Card } from "./Card"
import { RuleSet } from "./RuleSet"

/**
 * Represents a direction that a pile can go in.
 */
export enum Direction {
    Ascending,
    Descending
}

/**
 * Represents a state that a pile can be in
 */
export enum PileState {
    Safe,
    OnFire,
    Destroyed
}

/**
 * Represents a pile.
 */
export class Pile {
    /**
     * The cards in the pile.
     */
    cards: Card[]

    /**
     * The number of turns that this pile has been on fire for.
     */
    private turnsOnFire: number

    /**
     * Creates a new pile.
     */
    constructor(
        public start: number,
        public direction: Direction,
        cards?: Card[],
        turnsOnFire?: number,
    ) {
        this.cards = cards || []
        this.turnsOnFire = turnsOnFire || 0
    }

    /**
     * Returns a concrete pile object. Use when processing naive message from the server.
     */
    static from(pile: Pile) {
        return new Pile(
            pile.start,
            pile.direction,
            pile.cards.map(c => Card.from(c)),
            pile.turnsOnFire,
        )
    }

    /**
     * Adds a card from the given owner to the pile, if possible.
     */
    push(card: Card, ruleSet: RuleSet) {
        if (this.canBePlayed(card, ruleSet)) {
            this.cards.push(card)
            return true
        }

        return false
    }

    /**
     * Removes the card on the top of the pile and returns it.
     */
    pop() {
        return this.cards.pop()
    }

    /**
     * Returns the card on the top of the pile.
     */
    top() {
        if (this.cards.length <= 0) {
            return new Card(this.start)
        }

        return this.cards[this.cards.length - 1]
    }

    /**
     * Returns whether the given number can be played on this pile.
     */
    canBePlayed(card: Card, ruleSet: RuleSet) {
        let cardValue = card.value
        let topValue = this.top().value

        if (this.direction === Direction.Ascending) {
            return cardValue > topValue || cardValue === topValue - ruleSet.jumpBackSize
        }

        return cardValue < topValue || cardValue === topValue + ruleSet.jumpBackSize
    }

    /**
     * Returns whether the given player can mulligan from this pile.
     */
    canMulligan(player: string) {
        return this.cards.length > 0 && this.top().owner === player
    }

    /**
     * Returns the state of the pile.
     */
    getState(ruleSet: RuleSet) {
        if (this.isOnFire(ruleSet)) {
            if (this.turnsOnFire > 1) {
                return PileState.Destroyed
            }

            return PileState.OnFire
        }

        return PileState.Safe
    }

    /**
     * Returns whether this pile is on fire.
     */
    isOnFire(ruleSet: RuleSet) {
        return ruleSet.isOnFire() && ruleSet.cardIsOnFire(this.top())
    }

    /**
     * Returns whether this pile is on fire.
     */
    isDestroyed(ruleSet: RuleSet) {
        return ruleSet.isOnFire() && this.getState(ruleSet) === PileState.Destroyed
    }

    /**
     * Ends the turn according to the rule set.
     */
    endTurn(ruleSet: RuleSet) {
        if (ruleSet.isOnFire()) {
            if (ruleSet.cardIsOnFire(this.top())) {
                this.turnsOnFire++
            }
            else if (this.turnsOnFire > 0) {
                this.turnsOnFire = 0
            }
        }
    }
}
