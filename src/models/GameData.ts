import { Deck } from "./Deck"
import { Hand } from "./Hand"
import { IGameData } from "./IGameData"
import { Direction, Pile } from "./Pile"
import { RuleSet } from "./RuleSet"

import { Vote } from "./voting/Vote"

/**
 * Represents a map of player names to hands.
 */
export type PlayerHandMap = {
    [playerName: string] : Hand
}

/**
 * Represents the results of setting the starting player from a vote.
 */
export enum GameStartResult {
    Success,
    NoStartingPlayer,
    NonExistent
}

/**
 * Represents data about a game.
 */
export class GameData implements IGameData {
    /**
     * Constructor.
     */
    constructor(
        public players: string[],
        public ruleSet: RuleSet,
        public deck: Deck,
        private hands: PlayerHandMap,
        public piles: Pile[],
        private hasStarted: boolean,
        public startingPlayerVote: Vote,
        public startingPlayer: string | undefined,
        public turnsPlayed: number,
        public currentPlayerIndex: number,
        public cardToPlay: number | undefined,
        public cardsPlayedThisTurn: number,
    ) { }

    /**
     * Returns a default game data object.
     */
    static default() {
        return GameData.withRuleSet(RuleSet.default())
    }

    /**
     * Creates a new game data object with the given rule set.
     */
    static withRuleSet(ruleSet: RuleSet) {
        let deck = GameData.createDeck(ruleSet)
        let piles = GameData.createPiles(ruleSet)

        return new GameData(
            [],
            ruleSet,
            deck,
            {},
            piles,
            false,
            Vote.empty(),
            undefined,
            0,
            0,
            undefined,
            0
        )
    }

    /**
     * Returns a concrete game data object. Use when processing naive message from the server.
     */
    static from(gameData: GameData) {
        return new GameData(
            gameData.players,
            RuleSet.from(gameData.ruleSet),
            Deck.from(gameData.deck),
            gameData.hands,
            gameData.piles.map(Pile.from),
            gameData.hasStarted,
            Vote.from(gameData.startingPlayerVote),
            gameData.startingPlayer,
            gameData.turnsPlayed,
            gameData.currentPlayerIndex,
            gameData.cardToPlay,
            gameData.cardsPlayedThisTurn,
        )
    }

    /**
     * Creates a deck for the rule set.
     */
    static createDeck(ruleSet: RuleSet) {
        return Deck.create(2, ruleSet.topLimit)
    }

    /**
     * Creates piles for the rule set.
     */
    static createPiles(ruleSet: RuleSet) {
        let piles = []

        for (let i = 0; i < ruleSet.pairsOfPiles; i++) {
            let pile = new Pile(i, 1, Direction.Ascending)
            piles.push(pile)
        }

        for (let j = 0; j < ruleSet.pairsOfPiles; j++) {
            let index = ruleSet.pairsOfPiles + j
            let pile = new Pile(index, ruleSet.topLimit, Direction.Descending)
            piles.push(pile)
        }

        return piles
    }

    /**
     * Sets this game's rule set to the given one.
     */
    setRuleSet(ruleSet: RuleSet) {
        this.ruleSet = ruleSet
        this.ready()
    }

    /**
     * Readies the game.
     */
    private ready() {
        this.deck = GameData.createDeck(this.ruleSet)
        this.piles = GameData.createPiles(this.ruleSet)
    }

    /**
     * Starts the game with the given players and rule set.
     */
    start(players: string[]) {
        this.players = players

        for (let player of this.players) {
            this.dealHand(player)
        }

        if (this.players.length === 1) {
            // no vote required
            this.startingPlayer = this.players[0]
        }
        else {
            this.startingPlayerVote.setVoters(players)
        }

        this.hasStarted = true
    }

    /**
     * Adds a starting player vote for the given player.
     */
    addStartingPlayerVote(playerName: string, startingPlayerName: string) {
        return this.startingPlayerVote.addVote(playerName, startingPlayerName)
    }

    /**
     * Removes the starting player vote from the given player.
     */
    removeStartingPlayerVote(playerName: string) {
        return this.startingPlayerVote.removeVote(playerName)
    }

    /**
     * Returns whether the starting player vote is complete.
     */
    isStartingPlayerVoteComplete() {
        return this.startingPlayerVote.isComplete()
    }

    /**
     * Sets the starting player for this game.
     */
    setStartingPlayer() {
        this.startingPlayer = this.startingPlayerVote.getWinner()
        if (this.startingPlayer !== undefined) {
            this.startingPlayerVote.close()
            this.currentPlayerIndex = this.players.indexOf(this.startingPlayer)
            return GameStartResult.Success
        }

        return GameStartResult.NoStartingPlayer
    }

    /**
     * Clears data from a lingering game.
     */
    clear() {
        this.startingPlayer = undefined
        this.startingPlayerVote = Vote.empty()
        this.turnsPlayed = 0
        this.hasStarted = false
        this.cardToPlay = undefined
        this.cardsPlayedThisTurn = 0
        this.currentPlayerIndex = 0
        this.players = []

        return true
    }

    /**
     * Returns whether this game is in progress.
     */
    isInProgress() {
        return this.hasStarted && this.startingPlayerChosen()
    }

    /**
     * Returns whether the starting player has been chosen.
     */
    startingPlayerChosen() {
        return this.startingPlayer !== undefined
    }

    /**
     * Creates a hand for the rule set from the given deck.
     */
    dealHand(playerName: string) {
        this.hands[playerName] = new Hand(this.deck.draw(this.ruleSet.handSize))
    }

    /**
     * Returns the current player.
     */
    getCurrentPlayer() {
        if (this.players.length <= 0) {
            return undefined
        }

        return this.players[this.currentPlayerIndex]
    }

    /**
     * Returns the hand belonging to the given player.
     */
    getHand(playerName: string) {
        let handObj = this.hands[playerName]
        return Hand.from(handObj)
    }

    /**
     * Returns the hands in this game as a list.
     */
    enumerateHands() {
        return Object.values(this.hands).map(Hand.from)
    }

    /**
     * Sets the card to play.
     */
    setCardToPlay(cardToPlay: number | undefined) {
        this.cardToPlay = cardToPlay
    }

    /**
     * Sorts the given player's hand.
     */
    sortHand(playerName: string) {
        let hand = this.getHand(playerName)
        this.hands[playerName] = hand.sort()
    }

    /**
     * Plays the given card on the given pile from the given player's hand.
     */
    playCard(player: string, card: number, pileIndex: number) {
        let pile = this.piles[pileIndex]
        pile.push(card, this.ruleSet)

        let hand = this.getHand(player)
        hand.remove(card)

        this.cardsPlayedThisTurn++
    }

    /**
     * Removes the given player from the game.
     */
    removePlayer(playerName: string) {
        if (this.playerIsPresent(playerName)) {
            // remove player from list
            let index = this.players.indexOf(playerName)
            this.players.splice(index, 1)

            // reset current player
            this.currentPlayerIndex = Math.max(0, this.currentPlayerIndex - 1)

            // shuffle player's hand back into the deck
            let hand = this.getHand(playerName)
            this.deck.addCards(hand.cards)
            this.deck.shuffle()
            delete this.hands[playerName]

            return true
        }

        return false
    }

    /**
     * Returns whether the given player is in this game.
     */
    playerIsPresent(playerName: string) {
        return this.players.includes(playerName)
    }

    /**
     * Returns whether the game is won.
     */
    isWon() {
        let handsEmpty = this.enumerateHands().every(h => h.isEmpty())
        return this.deck.isEmpty() && handsEmpty
    }

    /**
     * Returns whether the game is lost.
     */
    isLost() {
        if (this.piles.some(p => p.isDestroyed(this.ruleSet))) {
            return true
        }

        let nonEmptyHands = this.enumerateHands().filter(h => !h.isEmpty())
        if (nonEmptyHands.length <= 0) {
            return !this.deck.isEmpty()
        }

        let cardCanBePlayed = nonEmptyHands.some(
            h => h.cards.some(
                c => this.piles.some(
                    p => p.canBePlayed(c, this.ruleSet)
                )
            )
        )

        return !cardCanBePlayed
    }

    /**
     * Replenishes the hand of the current player.
     */
    replenish() {
        let currentPlayer = this.getCurrentPlayer()

        if (currentPlayer !== undefined) {
            let hand = this.getHand(currentPlayer)

            for (let i = 0; i < this.cardsPlayedThisTurn; i++) {
                if (!this.deck.isEmpty()) {
                    let newCard = this.deck.drawOne()
                    hand.add(newCard)
                }
            }
        }
    }

    /**
     * Ends the current turn.
     */
    endTurn() {
        this.piles.forEach(p => p.endTurn(this.ruleSet))
        this.cardsPlayedThisTurn = 0
    }

    /**
     * Passes control to the next player.
     */
    nextPlayer() {
        let players = this.players
        let newIndex = (this.currentPlayerIndex + 1) % players.length
        this.currentPlayerIndex = newIndex
        return players[newIndex]
    }
}
