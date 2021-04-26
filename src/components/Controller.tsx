import React from "react";
import { useContext, useState } from "react";
import CardView from "./display/CardView";
import cardData from "../data/cards.json";
import ScrollContainer from 'react-indiana-drag-scroll';
import Battle from "./display/Battle";
import { Character, generateEnemyDeck, getDifficulty, setCharacter } from "./display/CharacterDisplay";
import Battlefield from "./Battlefield";
import { copyFileSync } from "fs";
import ReactAudioPlayer from 'react-audio-player';
import Confetti from 'react-confetti';
import { Link } from "react-router-dom";


export const getCardDescription = (card: any) => {
    let cardText = "";
    if (card.defense) cardText += "Add " + card.defense + " shield. "
    if (card.attack) cardText += "Attack for " + card.attack + " damage. "
    if (card.healing) cardText += "Heal for " + card.healing + " health. "
    if (card.draw) cardText += "Draw " + card.draw + " cards. "
    if (card.repeat) cardText += "Take " + card.repeat + " extra actions. "

    return cardText;
}

const parseCardData = (jsonData: any) => {
    let cards: any[] = [];
    jsonData.forEach((card: any) => {
        if (card.copies) {
            const clone = JSON.parse(JSON.stringify(card));
            clone.description = getCardDescription(card);
            for (let i = 1; i <= card.copies; i++) {
                cards.push(clone);
            }
            card.copies = "";
        } else {
            cards.push(card);
        }
    });
    return cards.sort(function () {
        return 0.5 - Math.random();
    });
}

const splitArray = (arr: any[], n: number) => {
    var p1 = arr.slice(0, n);
    var p2 = arr.slice(n);
    return [p1, p2];
}

const playerDeckSetup = (data: any[]) => {
    const startingHandSize = 5;
    const split = splitArray(data, startingHandSize);
    return {
        library: split[1],
        hand: split[0],
        discard: []
    };
}

function Controller() {

    const [delveActions, setDelveActions] = useState<any[]>([]);
    const [delving, setDelving] = useState(false);
    const [gameState, setGameState] = useState(0);
    const [depth, setDepth] = useState(90);
    const [depthStack, setDepthStack] = useState<any[]>([]);

    const cards = parseCardData(cardData);
    const difficulty: number = getDifficulty(depth);
    const [characters, setCharacters] = useState<Character[]>([
        {
            name: "Hero",
            index: 13,
            deck: playerDeckSetup(cards),
            action: "",
            health: {
                current: 10,
                max: 10
            },
            effects: {
                shield: 0,
                turns: 1,
                draw: 1
            }
        },
        setCharacter("wraith", 1, "Attacking!", difficulty, generateEnemyDeck(difficulty))
    ]);

    const setBattlefield = (card: any) => {
        setDepthStack([{ characters: JSON.parse(JSON.stringify(characters)), card: card }, ...depthStack]);
        let updatedChars = [...characters];
        updatedChars[0].index = card.character;
        updatedChars[0].health = { current: 10, max: 10 };

        let newDeck = playerDeckSetup(cards);
        updatedChars[0].deck = newDeck;

        const newEnemy = setCharacter(card.name, card.opponent, "Attacking!", difficulty, generateEnemyDeck(difficulty));
        updatedChars[1].index = newEnemy.index;
        updatedChars[1].health = newEnemy.health;
        updatedChars[1].deck = newEnemy.deck;
        updatedChars[1].action = newEnemy.action;

        setCharacters(updatedChars);
    }

    const delveHandler = (index: number, card: any) => {
        setDelving(true);
        const timer = setTimeout(function () {
            setBattlefield(card);
            setDepth(depth + 1);
            console.log(depthStack);
            setDelving(false);
            clearTimeout(timer);
        }, 1000);
    }

    const combineDelveActions = (actions: any) => {
        let atkCount = 0;
        let defCount = 0;
        let healCount = 0;
        let drawCount = 0;
        let repeatCount = 0;
        actions.forEach((card: any) => {
            //If used by player
            if (card.name) {
                //If not delve
                if (!card.delve) {
                    if (card.attack && card.attack !== "") atkCount = atkCount + card.attack;
                    if (card.healing && card.healing !== "") defCount = defCount + card.healing;
                    if (card.defense && card.defense !== "") healCount = healCount + card.defense;
                    if (card.repeat && card.repeat !== "") drawCount = drawCount + card.repeat;
                    if (card.draw && card.draw !== "") repeatCount = repeatCount + card.draw;
                }
            }
        });
        let newCard = {
            "name": "Legnedary Delve",
            "description": "You did it!",
            "defense": defCount,
            "attack": atkCount,
            "healing": healCount,
            "draw": drawCount,
            "repeat": repeatCount,
            "image": "dragon"
        };
        newCard.description = getCardDescription(newCard);
        return newCard;
    }

    const getDelveSuccessCard = (card: any) => {
        return combineDelveActions(delveActions);
    }

    const getDelveFailedCard = (card: any) => {
        return {
            "name": "Cracked " + card.name,
            "description": "You lost a delve. Don't give up!",
            "defense": "",
            "attack": "",
            "healing": "",
            "draw": 3,
            "repeat": 1,
            "image": "dragon"
        }
    }

    const addCardToHand = (target: any, card: any) => {
        target.deck.hand.push(card);
        return target;
    }

    const riseHandler = (win: boolean) => {
        if (depthStack.length > 0) {
            setDepth(depth - 1);
            let updatedChars = [...characters];
            const stackChars = [...depthStack[0].characters];
            updatedChars[0].index = stackChars[0].index;
            updatedChars[0].health = {
                current: stackChars[0].health.current,
                max: stackChars[0].health.max
            };

            /*
            let newDeck = stackChars[0].deck;
            if (win) {
                updatedChars[index] = func(updatedChars[index], ammount);
                updatedChars[0].deck = newDeck;
                updatedChars[0] = addCardToHand(updatedChars[0], getDelveSuccessCard(1));
            } else {
                newDeck.hand = [...newDeck.hand, getDelveFailedCard(depthStack[0].card)];
                updatedChars[0].deck = newDeck;
            }
            */


            /*
            if (win) {
                let newHand = [...stackChars[0].deck.hand];
                //newHand.push(getDelveSuccessCard(1));
                updatedChars[0].deck.hand = [...newHand, (getDelveSuccessCard(depthStack[0].card))];
            } else {
                let newHand = [...stackChars[0].deck.hand];
                //newHand.push(getDelveFailedCard(depthStack[0].card));
                updatedChars[0].deck.hand = [...newHand, (getDelveFailedCard(depthStack[0].card))];
            }
            */

            if (win) {
                let newHand = [...updatedChars[0].deck.hand];
                newHand.push(getDelveSuccessCard(1));
                updatedChars[0].deck.hand = newHand;
            } else {
                let newHand = [...updatedChars[0].deck.hand];
                newHand.push(getDelveFailedCard(depthStack[0].card));
                updatedChars[0].deck.hand = newHand;
            }

            setDelveActions([]);

            updatedChars[1].index = stackChars[1].index;
            updatedChars[1].health = {
                current: stackChars[1].health.current,
                max: stackChars[1].health.max
            };
            updatedChars[1].deck = stackChars[1].deck;
            updatedChars[1].action = stackChars[1].action;

            setCharacters(updatedChars);
            let newDepthStack = [...depthStack];
            newDepthStack.shift();
            setDepthStack(newDepthStack);
        } else {
            if (win) {
                setGameState(2);
            } else {
                setGameState(1);
            }
        }
    }

    const addDelveActions = (card: any) => {
        setDelveActions([card, ...delveActions]);
    }

    //const darkness = (depth) / 100;

    if (gameState == 0) {
        return (
            <div style={{ height: "100vh", position: "relative", top: delving ? "-100vh" : 0, transition: delving ? "top 1s linear" : "none" }}>
                <div>
                    <span>Depth: {depth}</span>
                </div>
                <Battlefield addDelveActions={addDelveActions} depth={depth} characters={characters} setCharacters={setCharacters} cardData={cards} delveHandler={delveHandler} riseHandler={riseHandler} />
            </div>
        );
    }
    if (gameState == 1) {
        return (
            <div className="home">
                <div className="menu-container">
                    <span>You lost!</span>
                    <Link to={"/"}>
                        <div className="menu-item">
                            <span className="menu-button">Play Again</span>
                        </div>
                    </Link>
                </div>
            </div>
        );
    }
    if (gameState == 2) {
        return (
            <div>
                <Confetti />
                <div className="home">
                    <div className="menu-container">
                        <span>You won!</span>
                        <Link to={"/"}>
                            <div className="menu-item">
                                <span className="menu-button">Play Again</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Controller;
