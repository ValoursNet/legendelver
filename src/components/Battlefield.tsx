import React from "react";
import { useContext, useState } from "react";
import CardView from "./display/CardView";
import ScrollContainer from 'react-indiana-drag-scroll';
import Battle from "./display/Battle";
import levelsData from "../data/levels.json";
import { Character, generateEnemyDeck, generateRandomCharacter, getActionString, getDifficulty, setCharacter } from "./display/CharacterDisplay";
import { getCardDescription } from "./Controller";
import { useEffect } from "react";

function Battlefield({ addDelveActions, characters, setCharacters, cardData, delveHandler, riseHandler, depth }: { addDelveActions: any, characters: any[], setCharacters: any, cardData: any, delveHandler: any, riseHandler: any, depth: number }) {
    const [actionsArray, setActionsArray] = useState<any[]>([]);
    const [text, setText] = useState("word");

    const modifyCharacter = (index: number, func: any, ammount: number) => {
        let updatedChars = [...characters];
        updatedChars[index] = func(updatedChars[index], ammount);
        setCharacters(updatedChars);
    }

    /*
    THIS SHOULD BE IN A BATTLE LOGIC OR CARD HANDLER FILE
    BELOW
    */
    let selectedCard: any = null;

    const clickCard = (card: any) => {
        selectedCard = card;

        if (characters[0].effects.turns && selectedCard) {
            const target = characters[1];
            actionCard(characters[0], target, selectedCard);
            addActionToLog(characters[0], target, card);

            playerDiscardCard(selectedCard);
            modifyCharacter(0, addRepeat, -1);
        }
    }

    const clickTarget = (target: Character) => {
        /*
        if (characters[0].effects.turns && selectedCard) {
            actionCard(characters[0], target, selectedCard);
            playerDiscardCard(selectedCard);
            modifyCharacter(0, addRepeat, -1);
            if (characters[0].effects.turns <= 0) {
                takeEnemyAction();
            } else if (characters[0].deck.hand.length <= 0) {
                //If character has turns left and an empty hand, draw 3
                //TODO fix wild bug where it draws one less than asked
                modifyCharacter(0, addDraw, 4);
            }
        }
        */
    }

    const playerDiscardCard = (card: any) => {
        if (!checkForFinish()) {
            const cardIndex = characters[0].deck.hand.indexOf(card);
            modifyCharacter(0, discardCard, cardIndex);
        }
    }

    const discardCard = (target: Character, index: number) => {
        target.deck.discard.push(target.deck.hand.splice(index, 1)[0]);
        return target;
    }

    const drawCard = (target: Character) => {
        const chance = 50;//percent
        const legendary: boolean = Math.floor(Math.random() * 100) > chance;
        if (legendary) {
            const legendaryCard = getLegendaryCard();
            if (legendaryCard) {
                target.deck.hand.push(legendaryCard);
                return target;
            }
        }
        return drawCardSafe(target);
    }

    const drawCardSafe = (target: Character) => {
        if (target.deck.library.length >= 1) {
            target.deck.hand.push(target.deck.library.splice(0, 1)[0]);
        } else {
            target.deck.library = [...target.deck.discard].sort(function () {
                return 0.5 - Math.random();
            });
            target.deck.discard = [];
            target.deck.hand.push(target.deck.library.splice(0, 1)[0]);
        }
        return target;
    }

    const deckContainsCardByName = (name: string) => {
        if (characters[0].deck.hand.some((e: { name: string; }) => e.name === name)) {
            return true;
        }
        if (characters[0].deck.discard.some((e: { name: string; }) => e.name === name)) {
            return true;
        }
        if (characters[0].deck.library.some((e: { name: string; }) => e.name === name)) {
            return true;
        }
        return false;
    }

    const getLegendaryCard = () => {
        const filteredLegendaries = levelsData.filter((c) => {
            if (c.minDepth >= depth) {
                if (!deckContainsCardByName(c.name)) {
                    return true;
                }
            }
            return false;
        });
        if (filteredLegendaries.length <= 0) return false;
        var item = filteredLegendaries[Math.floor(Math.random() * filteredLegendaries.length)];
        return {
            "name": item.name,
            "description": "Delve",
            "delve": 1,
            "image": "dragon",
            "opponent": item.opponent,
            "character": item.character
        };
    }


    //TODO combine turns so that one function is called (passTurn or something)
    const takeEnemyAction = () => {
        console.log("takeEnemyAction");
        const enemyCard = characters[1].deck[0];
        actionCard(characters[1], characters[0], enemyCard);
        modifyCharacter(1, updateInfoAndShuffle, 1);

        //Start players turn
        modifyCharacter(0, addDraw, 1);
        modifyCharacter(0, addRepeat, 1);

        addActionToLog(characters[1], characters[0], enemyCard);
    }

    const updateInfoAndShuffle = (target: Character, played: number) => {
        target.deck = target.deck.sort(function () {
            return 0.5 - Math.random();
        });
        target.action = getActionString(target.deck[0]);
        return target;
    }


    const addActionToLog = (origin: Character, index: number, card: any) => {
        const name = (index == 0) ? origin.name + " (player)" : origin.name;
        setActionsArray(["The " + name + " - " + getCardDescription(card), ...actionsArray]);
        addDelveActions(card);
    }

    useEffect(() => {
        //check for turn
        if (characters[0].effects.turns <= 0) {
            const timer = setTimeout(function () {
                if (!checkForFinish() && characters[0].effects.turns <= 0) {
                    takeEnemyAction();
                }
                clearTimeout(timer);
            }, 1000);
        } else if (characters[0].deck.hand.length <= 0) {
            //If character has turns left and an empty hand, draw 3
            //TODO fix wild bug where it draws one less than asked
            modifyCharacter(0, addDraw, 4);
        }
    }, [actionsArray]); // this will call getChildChange when ever name changes.


    //Delve
    //Attack
    //Heal
    //Shield
    //Draw
    //Action

    const actionCard = (origin: Character, target: Character, card: any) => {
        const targetIndex = characters.indexOf(target);
        const originIndex = characters.indexOf(origin);
        if (card.attack && card.attack !== "") modifyCharacter(targetIndex, dealDamage, card.attack);

        //TODO, maybe don't assume all good effects are coming from origin
        if (card.healing && card.healing !== "") modifyCharacter(originIndex, giveHealing, card.healing);
        if (card.defense && card.defense !== "") modifyCharacter(originIndex, addShield, card.defense);
        if (card.repeat && card.repeat !== "") modifyCharacter(originIndex, addRepeat, card.repeat);
        if (card.draw && card.draw !== "") modifyCharacter(originIndex, addDraw, card.draw);
        if (card.delve && card.delve !== "") modifyCharacter(originIndex, doDelve, card.delve);
        card = null;
    }

    //OLD
    /*
    const actionCard = (target: Character, card: any) => {
        console.log(card);
        if (card.attack && card.attack !== "") dealDamage(target, card.attack);
        if (card.healing && card.healing !== "") giveHealing(target, card.healing);
        if (card.defense && card.defense !== "") addShield(target, card.defense);
        if (card.repeat && card.repeat !== "") addRepeat(target, card.repeat);
        if (card.draw && card.draw !== "") addDraw(target, card.draw);
        if (card.delve && card.delve !== "") doDelve(target);
        card = null;
    }
    */

    const checkForFinish = () => {
        if (characters[0].health.current <= 0) {
            return true;
        }
        if (characters[1].health.current <= 0) {
            return true;
        }
        return false;
    }

    const dealDamage = (target: Character, damage: number) => {
        target.effects.shield = target.effects.shield - damage;
        if (target.effects.shield < 0) {
            target.health.current = target.health.current + target.effects.shield;
            target.effects.shield = 0;
        }
        if (target.health.current <= 0) {
            if (characters.indexOf(target) == 0) {
                riseHandler(false);//if the player is on 0, you loose
            } else {
                riseHandler(true);
            }
            modifyCharacter(0, addRepeat, 1);
        }
        return target;
    }

    const giveHealing = (target: Character, healing: number) => {
        target.health.current = target.health.current + healing;
        if (target.health.current > target.health.max) {
            target.health.current = target.health.max;
        }
        return target;
    }

    const addShield = (target: Character, shield: number) => {
        target.effects.shield = target.effects.shield + shield;
        return target;
    }

    const addRepeat = (target: Character, repeat: number) => {
        target.effects.turns = target.effects.turns + repeat;
        return target;
    }

    const addDraw = (target: Character, draw: number) => {
        target.effects.draw = target.effects.draw + draw;
        target = drawCards(target);
        return target;
    }

    const doDelve = (target: Character) => {
        console.log("do delve");
        target.effects.turns = target.effects.turns + 1;
        delveHandler(5, selectedCard);
        return target;
    }


    const drawCards = (target: Character) => {
        if (target.effects.draw > 0) {
            for (let i = 1; i <= target.effects.draw; i++) {
                console.log("drawCard->");
                target = drawCard(target);
                target.effects.draw = target.effects.draw - 1;
            }
        }
        return target;
    }

    /*
    ABOVE
    THIS SHOULD BE IN A BATTLE LOGIC OR CARD HANDLER FILE
    */

    return (
        <div className="controller">
            <div className="container">
                <Battle characters={characters} clickTarget={clickTarget}></Battle>
                <div className="w-full text-center">
                    {actionsArray.map((e) => (
                        <p>{e}</p>
                    ))}
                </div>
                <div className="w-full" style={{
                    position: "absolute",
                    bottom: 0
                }}>
                    <ScrollContainer className="scroll-container" nativeMobileScroll={false}>
                        <div className="flex flex-nowrap">
                            {characters[0].deck.hand.map((card: any) => (
                                <div key={card.name + Math.ceil(Math.random() * 1000000)} className="flex-initial m-1 cursor-pointer card-container" onClick={() => { clickCard(card) }}>
                                    <CardView card={card}></CardView>
                                </div>
                            ))}
                        </div>
                    </ScrollContainer>
                </div>
            </div>
        </div>
    );
}

export default Battlefield;
