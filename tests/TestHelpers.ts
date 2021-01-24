import { Card } from "../src/game/Card"
import { Deck } from "../src/game/Deck"
import { GameData, PlayerHandMap } from "../src/game/GameData"
import { Hand } from "../src/game/Hand"
import { CardInfo, Direction, Pile } from "../src/game/Pile"
import { GameMode, RuleSet, RuleSetBuilder } from "../src/game/RuleSet"

import { Vote, VoteCalculationMethod, VoteMap } from "../src/voting/Vote"

export const createGameData = (
    args: {
        players?: string[],
        ruleSet?: RuleSet,
        deck?: Deck,
        hands?: PlayerHandMap,
        piles?: Pile[],
        vote?: Vote,
        startingPlayer?: string,
        turnCounter?: number,
        currentPlayerIndex?: number,
        cardToPlay?: Card
        cardsPlayedThisTurn?: number,
        cardsMulliganed?: number,
        passedLastTurn?: string[],
    }
) => {
    return new GameData(
        args.players ?? createPlayers(),
        args.ruleSet ?? createRuleSet({}),
        args.deck ?? createDeck(),
        args.hands ?? createHands(),
        args.piles ?? createPiles({}),
        args.vote ?? createVote({}),
        args.startingPlayer,
        args.turnCounter ?? 0,
        args.currentPlayerIndex ?? 0,
        args.cardToPlay,
        args.cardsPlayedThisTurn ?? 0,
        args.cardsMulliganed ?? 0,
        args.passedLastTurn ?? [],
    )
}

const createPlayers = () => {
    return ["player1"]
}

export const createRuleSet = (
    args: {
        jumpBackSize?: number,
        gameMode?: GameMode,
        mulliganLimit?: number,
    }
) => {
    return new RuleSetBuilder()
            .withJumpBackSize(args.jumpBackSize ?? 10)
            .withGameMode(args.gameMode ?? GameMode.Regular)
            .withMulliganLimit(args.mulliganLimit ?? 0)
            .build()
}

export const createDeck = (cards?: Card[]) => {
    return new Deck(cards ?? createCards([2, 3, 4]))
}

export const createHands = (players?: string[], cards?: Card[]) => {
    let hands: PlayerHandMap = {}

    players ??= ["player1"]
    players.forEach(p => hands[p] = createHand(cards))

    return hands
}

export const createHand = (cards?: Card[]) => {
    return new Hand(cards ?? createCards([41, 42, 43]))
}

export const createPiles = (
    args: {
        start?: number,
        direction?: Direction,
        cards?: [Card, CardInfo][],
    }
) => {
    return [createPile(args)]
}

export const createPile = (
    args: {
        start?: number,
        direction?: Direction,
        cards?: [Card, CardInfo][],
        turnsOnFire?: number,
    }
) => {
    return new Pile(
        args.start ?? 1,
        args.direction ?? Direction.Ascending,
        args.cards ?? createCardsWithInfo([20, 30, 40]),
        args.turnsOnFire
    )
}

export const createCardsWithInfo = (values: number[]) => {
    return values.map(v => <[Card, CardInfo]>[new Card(v, false), new CardInfo()])
}

export const createCards = (values: number[]) => {
    return values.map(v => new Card(v, false))
}

export const createVote = (
    args: {
        voters?: string[],
        voteMap?: VoteMap,
        voteCalculationMethod?: VoteCalculationMethod,
    }
) => {
    return new Vote(
        args.voters ?? ["voter1"],
        args.voteMap ?? createVoteMap(args.voters ?? ["voter1"]),
        args.voteCalculationMethod ?? VoteCalculationMethod.Unanimous,
        false,
    )
}

export const createVoteMap = (voters: string[]) => {
    let voteMap: VoteMap = {}
    voters.forEach(p => voteMap[p] = p)
    return voteMap
}
