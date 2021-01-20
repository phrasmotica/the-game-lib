import { Deck } from "../src/game/Deck"
import { Hand } from "../src/game/Hand"
import { Direction, Pile } from "../src/game/Pile"
import { GameMode, RuleSet, RuleSetBuilder } from "../src/game/RuleSet"

import { GameData, PlayerHandMap } from "../src/game/GameData"

import { Vote, VoteCalculationMethod, VoteMap } from "../src/voting/Vote"

export const createGameData = (
    args: {
        players?: string[],
        ruleSet?: RuleSet,
        deck?: Deck,
        hands?: PlayerHandMap,
        piles?: Pile[],
        hasStarted?: boolean,
        vote?: Vote,
        startingPlayer?: string,
        turnsPlayed?: number,
        currentPlayerIndex?: number,
        cardToPlay?: number,
        cardsPlayedThisTurn?: number,
    }
) => {
    return new GameData(
        args.players ?? createPlayers(),
        args.ruleSet ?? createRuleSet({}),
        args.deck ?? createDeck(),
        args.hands ?? createHands(),
        args.piles ?? createPiles({}),
        args.hasStarted ?? false,
        args.vote ?? createVote({}),
        args.startingPlayer,
        args.turnsPlayed ?? 0,
        args.currentPlayerIndex ?? 0,
        args.cardToPlay,
        args.cardsPlayedThisTurn ?? 0,
    )
}

const createPlayers = () => {
    return ["player1"]
}

const createSpectators = () => {
    return ["spectator1"]
}

export const createRuleSet = (
    args: {
        jumpBackSize?: number,
        gameMode?: GameMode,
    }
) => {
    return new RuleSetBuilder()
            .withJumpBackSize(args.jumpBackSize ?? 10)
            .withGameMode(args.gameMode ?? GameMode.Regular)
            .build()
}

export const createDeck = (cards?: number[]) => {
    return new Deck(cards ?? [2, 3, 4])
}

export const createHands = (players?: string[], cards?: number[]) => {
    let hands: PlayerHandMap = {}

    players ??= ["player1"]
    players.forEach(p => hands[p] = createHand(cards))

    return hands
}

export const createHand = (cards?: number[]) => {
    return new Hand(cards ?? [41, 42, 43])
}

export const createPiles = (
    args: {
        start?: number,
        direction?: Direction,
        cards?: number[],
    }
) => {
    return [createPile(args)]
}

export const createPile = (
    args: {
        start?: number,
        direction?: Direction,
        cards?: number[],
        turnsOnFire?: number,
    }
) => {
    return new Pile(
        0,
        args.start ?? 1,
        args.direction ?? Direction.Ascending,
        args.cards ?? [20, 30, 40],
        args.turnsOnFire
    )
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
