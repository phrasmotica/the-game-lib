import * as TypeMoq from "typemoq"

import { Card } from "../../src/game/Card"
import { Hand } from "../../src/game/Hand"
import { Pile } from "../../src/game/Pile"
import { GameMode } from "../../src/game/RuleSet"

import {
    createCards,
    createCardsWithInfo,
    createDeck,
    createGameData,
    createHand,
    createPile,
    createRuleSet
} from "../TestHelpers"

describe("game data", () => {
    let canMulliganTests = [
        {
            limit: 1,
            cardsMulliganed: 0,
            expectedCanMulligan: true,
        },
        {
            limit: 1,
            cardsMulliganed: 1,
            expectedCanMulligan: false,
        },
    ]

    canMulliganTests.forEach(t =>
        it("allows taking a mulligan according to the limit", () => {
            // arrange
            let gameData = createGameData({
                ruleSet: createRuleSet({
                    mulliganLimit: t.limit,
                }),
                cardsMulliganed: t.cardsMulliganed,
            })

            // act
            let canMulligan = gameData.canMulligan()

            // assert
            expect(canMulligan).toBe(t.expectedCanMulligan)
        })
    )

    it("allows a mulligan if the pile allows it and the player has a hand", () => {
        // arrange
        let pile = TypeMoq.Mock.ofType<Pile>()
        pile
            .setup(
                m => m.canMulligan(
                    TypeMoq.It.isAnyString(),
                    TypeMoq.It.isAnyNumber(),
                )
            )
            .returns(() => true)

        pile.setup(m => m.popCard()).returns(() => new Card(40, false))
        pile.setup(m => m.topCard()).returns(() => new Card(30, false))

        let hand = TypeMoq.Mock.ofType<Hand>()
        hand.setup(m => m.cards).returns(() => [new Card(20, false)])

        let gameData = createGameData({
            piles: [pile.object],
            hands: { "player1": hand.object }
        })

        // act
        let result = gameData.mulligan(0, "player1")

        // assert
        expect(result.success).toBe(true)
        expect(result.card!.value).toBe(40)
        expect(result.card!.revealed).toBe(true)
        expect(result.previousCard!.value).toBe(30)
    })

    it("prevents a mulligan if the pile prevents it", () => {
        // arrange
        let pile = TypeMoq.Mock.ofType<Pile>()
        pile
            .setup(
                m => m.canMulligan(
                    TypeMoq.It.isAnyString(),
                    TypeMoq.It.isAnyNumber(),
                )
            )
            .returns(() => false)

        let gameData = createGameData({ piles: [pile.object] })

        // act
        let result = gameData.mulligan(0, "player1")

        // assert
        expect(result.success).toBe(false)
    })

    it("prevents a mulligan if the player has no hand", () => {
        // arrange
        let pile = TypeMoq.Mock.ofType<Pile>()
        pile
            .setup(
                m => m.canMulligan(
                    TypeMoq.It.isAnyString(),
                    TypeMoq.It.isAnyNumber(),
                )
            )
            .returns(() => true)

        let gameData = createGameData({
            piles: [pile.object],
            hands: {
                "player1": createHand()
            }
        })

        // act
        let result = gameData.mulligan(0, "player2")

        // assert
        expect(result.success).toBe(false)
    })

    it("is won when the deck and the players' hands are empty", () => {
        // arrange
        let gameData = createGameData({
            deck: createDeck([]),
            hands: {
                "player1": createHand([])
            },
        })

        // act
        let isWon = gameData.isWon()

        // assert
        expect(isWon).toBe(true)
    })

    it("is not won when the deck is not empty", () => {
        // arrange
        let gameData = createGameData({
            deck: createDeck(createCards([4])),
        })

        // act
        let isWon = gameData.isWon()

        // assert
        expect(isWon).toBe(false)
    })

    it("is not won when the players' hands are not empty", () => {
        // arrange
        let gameData = createGameData({
            hands: {
                "player1": createHand(createCards([4]))
            },
        })

        // act
        let isWon = gameData.isWon()

        // assert
        expect(isWon).toBe(false)
    })

    it("is lost in On Fire mode if a pile is destroyed", () => {
        // arrange
        let destroyedPile = TypeMoq.Mock.ofType<Pile>()
        destroyedPile
            .setup(m => m.isDestroyed(TypeMoq.It.isAny()))
            .returns(() => true)

        let gameData = createGameData({ piles: [destroyedPile.object] })

        // act
        let isLost = gameData.isLost()

        // assert
        expect(isLost).toBe(true)
    })

    it("is lost if all players passed their last turn", () => {
        // arrange
        let gameData = createGameData({
            players: ["player1", "player2", "player3"],
            piles: [],
            passedLastTurn: ["player1", "player2", "player3"],
        })

        // act
        let isLost = gameData.isLost()

        // assert
        expect(isLost).toBe(true)
    })

    it("is not lost if not all players passed their last turn", () => {
        // arrange
        let gameData = createGameData({
            players: ["player1", "player2", "player3"],
            piles: [],
            passedLastTurn: ["player1", "player2"],
        })

        // act
        let isLost = gameData.isLost()

        // assert
        expect(isLost).toBe(false)
    })
})
