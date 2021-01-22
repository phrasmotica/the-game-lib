import { GameMode } from "../../src/game/RuleSet"

import {
    createDeck,
    createGameData,
    createHand,
    createPile,
    createRuleSet
} from "../TestHelpers"

describe("game data", () => {
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
            deck: createDeck([4]),
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
                "player1": createHand([4])
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
                    cards: [20, 30, 40, 44],
                    turnsOnFire: 2,
                }),
                createPile({
                    cards: [35, 38],
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
            deck: createDeck([46, 47, 48]),
            hands: {
                "player1": createHand([41, 42, 43])
            },
            piles: [createPile({
                cards: [20, 30, 40, 50],
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
            deck: createDeck([46, 47, 48]),
            hands: {
                "player1": createHand([41, 42, 51])
            },
            piles: [createPile({
                cards: [20, 30, 40, 50],
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
                "player1": createHand([41, 42, 43])
            },
            piles: [createPile({
                cards: [20, 30, 40, 50],
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
                "player1": createHand([41, 42, 51])
            },
            piles: [createPile({
                cards: [20, 30, 40, 50],
            })],
        })

        // act
        let isLost = gameData.isLost()

        // assert
        expect(isLost).toBe(false)
    })
})
