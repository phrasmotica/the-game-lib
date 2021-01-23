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
 * Represents info about a card that was played on a pile.
 */
export class CardInfo{
    constructor(
        public owner?: string,
        public turnPlayed?: number,
    ) { }
}

/**
 * Represents a pile.
 */
export class Pile {
    /**
     * The cards in the pile.
     */
    cards: [Card, CardInfo][]

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
        cards?: [Card, CardInfo][],
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
            pile.cards.map(c => [Card.from(c[0]), c[1]]),
            pile.turnsOnFire,
        )
    }

    /**
     * Adds a card from the given owner to the pile, if possible.
     */
    push(card: Card, player: string, turnCounter: number, ruleSet: RuleSet) {
        if (this.canBePlayed(card, ruleSet)) {
            let cardInfo = new CardInfo(player, turnCounter)
            this.cards.push([card, cardInfo])
            return true
        }

        return false
    }

    /**
     * Removes the card on the top of the pile and returns it.
     */
    popCard() {
        if (this.cards.length <= 0) {
            return undefined
        }

        return this.cards.pop()![0]
    }

    /**
     * Returns the card on the top of the pile.
     */
    topCard() {
        if (this.cards.length <= 0) {
            return new Card(this.start)
        }

        return this.cards[this.cards.length - 1][0]
    }

    /**
     * Returns info about the card on the top of the pile.
     */
    topCardInfo() {
        if (this.cards.length <= 0) {
            return undefined
        }

        return this.cards[this.cards.length - 1][1]
    }

    /**
     * Returns whether the given number can be played on this pile.
     */
    canBePlayed(card: Card, ruleSet: RuleSet) {
        let cardValue = card.value
        let topValue = this.topCard().value

        if (this.direction === Direction.Ascending) {
            return cardValue > topValue || cardValue === topValue - ruleSet.jumpBackSize
        }

        return cardValue < topValue || cardValue === topValue + ruleSet.jumpBackSize
    }

    /**
     * Returns whether the given player can mulligan from this pile on the given
     * turn.
     */
    canMulligan(player: string, turnCounter: number) {
        if (this.cards.length <= 0) {
            return false
        }

        let cardInfo = this.topCardInfo()!
        return cardInfo.owner === player && cardInfo.turnPlayed === turnCounter
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
        return ruleSet.isOnFire() && ruleSet.cardIsOnFire(this.topCard())
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
            if (ruleSet.cardIsOnFire(this.topCard())) {
                this.turnsOnFire++
            }
            else if (this.turnsOnFire > 0) {
                this.turnsOnFire = 0
            }
        }
    }
}
