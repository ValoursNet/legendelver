import React, { useState } from "react";
import Button from "../Button";
import { characters } from "../Characters";
import Animation from './Animation';

function CharacterSelect({ playerName }: { playerName: string }) {
    const [index, setIndex] = useState(0);

    return (
        <>
            <h4>{playerName}</h4>
            <Button onClick={() => { setIndex(index - 1) }} text={"<"} />
            <Animation character={characters[index]}></Animation>
            <Button onClick={() => { setIndex(index + 1) }} text={">"} />
        </>
    )
}

export default CharacterSelect;