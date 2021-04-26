import React, { useState } from "react";
import Button from "../Button";
import Animation from './Animation';
import HealthBar from "./HealthBar";

import Tooltip from "react-simple-tooltip";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faBolt, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { characters } from "../Characters";

//type
interface Health {
    current: number,
    max: number
}

//type
export interface Character {
    name: string,
    index: number,
    deck: any,
    action: string,//TODO REMOVE THIS
    /*
    deck: {
        draw : [],
        hand : [],
        discard : []
    },
    effects: [],
    */
    health: Health,
    effects: Effects
}

//type
interface Effects {
    shield: number,
    turns: number,
    draw: number,
    delve?: number
}

export const getDifficulty = (depth: number) => {
    const maxDifficulty = 100;
    const minDifficulty = 1;
    let difficulty = maxDifficulty - depth;
    if (difficulty < minDifficulty) difficulty = minDifficulty;
    return maxDifficulty - depth;
}

export const generateEnemyCard = (difficulty: number) => {
    return {
        attack: Math.ceil(Math.random() * difficulty / 2)
    };
}

export const generateEnemyDeck = (difficulty: number) => {
    const variance = Math.floor(difficulty / 5);
    let deck = [];
    for (let i = 0; i <= variance; i++) {
        deck.push(generateEnemyCard(difficulty));
    }
    return deck;
}

export const getActionString = (card: any) => {
    return "Attacking for " + card.attack + " damage";
}

//util
export const generateRandomCharacter = () => {
    const randomCharIndex = Math.floor(Math.random() * charactersCount);
    const newChar: Character = {
        name: "charname here",
        index: randomCharIndex,
        deck: null,
        health: { current: 20, max: 20 },
        action: "Attacking!",
        effects: { shield: 0, turns: 0, draw: 0 }
    }
    return newChar;
};

//util
export const setCharacter = (name: string, index: number, nextAction: string, difficulty: number, deck?: any) => {
    const charHealth = difficulty + Math.floor(Math.random() * difficulty);
    const newChar: Character = {
        name: name,
        index: index,
        deck: deck,
        action: getActionString(deck[0]),
        health: { current: charHealth, max: charHealth },
        effects: { shield: 0, turns: 0, draw: 0 }
    }
    return newChar;
};

//create your forceUpdate hook
const useForceUpdate = () => {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}

export const charactersCount = characters.length;

export const getRandomId = () => {
    return Math.floor(Math.random() * 99999999);
}

function CharacterDisplay({ character, clickTarget, flip = false, odd = false, player = false }: { character: Character, clickTarget: any, flip?: boolean, odd?: boolean, player?: boolean }) {
    const forceUpdate = useForceUpdate();
    const hpPercent = Math.floor((character.health.current / character.health.max) * 100);
    return (
        <div
            style={{
                margin: "auto",
                width: "192px"
            }}
            className={odd ? "ml-20" : ""}
            onClick={() => { clickTarget(character); forceUpdate(); }}
        >
            <div style={{ height: "24px", margin: "auto", textAlign: "center", color: "black" }}>
                <Tooltip placement={"bottom"} content="Next action">
                    <b>{character.action}</b>
                </Tooltip>
            </div>
            <Animation character={characters[character.index]} flip={flip}></Animation>
            <HealthBar completed={hpPercent} current={character.health.current} max={character.health.max} player={player}></HealthBar>
            <div style={{ height: "24px" }}>
                {[...Array(character.effects.shield)].map(() =>
                    <Tooltip content="Each shield will stop one instance of damage" key={getRandomId()}>
                        <FontAwesomeIcon className={"ml-1"} icon={faShieldAlt} color="black" />
                    </Tooltip>
                )}
                {[...Array(character.effects.turns)].map(() =>
                    <Tooltip content="Each action will allow the character to PLAY one extra card on their turn" key={getRandomId()}>
                        <FontAwesomeIcon className={"ml-1"} icon={faBolt} color="black" />
                    </Tooltip>
                )}
                {/*
                [...Array(character.effects.draw)].map(() =>
                    <Tooltip content="Each draw will allow the player to DRAW one extra card on their turn" key={getRandomId()}>
                        <FontAwesomeIcon className={"ml-1"} icon={faLayerGroup} color="black" />
                    </Tooltip>
                )
                */}
            </div>
        </div>
    )
}

export default CharacterDisplay;
