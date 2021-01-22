import { Card } from "../../src/game/Card"
import { GameMode } from "../../src/game/RuleSet"

import {
    createCards,
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

    it("returns a mulliganed card to the player's hand", () => {
        // arrange
        let gameData = createGameData({
            piles: [createPile({
                cards: [new Card(30), new Card(40, "player1")]
            })],
            hands: {
                "player1": createHand(createCards([41, 42, 43])),
            }
        })

        // act
        console.log(gameData.piles[0].cards.stack)
        let result = gameData.mulligan(0, "player1")
        console.log(gameData.piles[0].cards.stack)

        // assert
        expect(result.success).toBe(true)
        expect(result.card!.value).toBe(40)
        expect(result.previousCard!.value).toBe(30)
        expect(gameData.getHand("player1")!.cards).toHaveLength(4)
    })

    it("does nothing if a mulligan is prevented", () => {
        // arrange
        let gameData = createGameData({
            piles: [createPile({
                cards: [new Card(30), new Card(40, "player2")]
            })],
            hands: {
                "player1": createHand(createCards([41, 42, 43])),
            }
        })

        // act
        let result = gameData.mulligan(0, "player1")

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
        let gameData = createGameData({
            ruleSet: createRuleSet({
                gameMode: GameMode.OnFire,
            }),
            piles: [
                createPile({
                    cards: createCards([20, 30, 40, 44]),
                    turnsOnFire: 2,
                }),
                createPile({
                    cards: createCards([35, 38]),
                    turnsOnFire: 0,
                }),
            ],
        })

        // act
        let isLost = gameData.isLost()

        // assert
        expect(isLost).toBe(true)
    })

    it("is lost when the deck is not empty and the players cannot play any cards", () => {
        // arrange
        let gameData = createGameData({
            deck: createDeck(createCards([46, 47, 48])),
            hands: {
                "player1": createHand(createCards([41, 42, 43]))
            },
            piles: [createPile({
                cards: createCards([20, 30, 40, 50]),
            })],
        })

        // act
        let isLost = gameData.isLost()

        // assert
        expect(isLost).toBe(true)
    })

    it("is not lost when the deck is not empty and the players can play a card", () => {
        // arrange
        let gameData = createGameData({
            deck: createDeck(createCards([46, 47, 48])),
            hands: {
                "player1": createHand(createCards([41, 42, 51]))
            },
            piles: [createPile({
                cards: createCards([20, 30, 40, 50]),
            })],
        })

        // act
        let isLost = gameData.isLost()

        // assert
        expect(isLost).toBe(false)
    })

    it("is lost when the deck is empty and the players cannot play any cards", () => {
        // arrange
        let gameData = createGameData({
            deck: createDeck([]),
            hands: {
                "player1": createHand(createCards([41, 42, 43]))
            },
            piles: [createPile({
                cards: createCards([20, 30, 40, 50]),
            })],
        })

        // act
        let isLost = gameData.isLost()

        // assert
        expect(isLost).toBe(true)
    })

    it("is not lost when the deck is empty and the players can play a card", () => {
        // arrange
        let gameData = createGameData({
            deck: createDeck([]),
            hands: {
                "player1": createHand(createCards([41, 42, 51]))
            },
            piles: [createPile({
                cards: createCards([20, 30, 40, 50]),
            })],
        })

        // act
        let isLost = gameData.isLost()

        // assert
        expect(isLost).toBe(false)
    })
})
