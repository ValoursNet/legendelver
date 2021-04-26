import React, { useState } from "react";
import CharacterDisplay, { Character, generateRandomCharacter, setCharacter } from "../display/CharacterDisplay";
import { charactersCount } from "../display/CharacterDisplay";

function Battle({ characters, clickTarget }: { characters: Character[], clickTarget: any }) {
  const [teamTurn, setTeamTurn] = useState(true);
  return (
    <div className="screen battlebg">
      <div className="container flex">
        {characters.map((c, i) =>
          <BattleTeam key={c.index} character={c} clickTarget={clickTarget} flip={false} player={i == 0} ></BattleTeam>
        )}
      </div>
    </div>
  );

  /*
  <BattleTeam characterIndex={13} characterAction={""} clickTarget={clickTarget} flip={false} player={true} ></BattleTeam>
  <BattleTeam characterIndex={characterIndex} characterAction={characterAction} clickTarget={clickTarget} flip={true} player={false} ></BattleTeam>
  */
}


function BattleTeam({ character, flip, clickTarget, player }: { character: Character, flip: boolean, clickTarget: any, player: boolean }) {
  return (
    <div className="flex-grow m-4">
      <CharacterDisplay clickTarget={clickTarget} character={character} flip={flip} player={player}></CharacterDisplay>
    </div>
  );
  /*
return (
  <div className="flex-grow m-4">
    <CharacterDisplay clickTarget={clickTarget} character={setCharacter(1)} flip={flip} active={active}></CharacterDisplay>
    <CharacterDisplay clickTarget={clickTarget} character={generateRandomCharacter()} flip={flip} active={active} odd></CharacterDisplay>
    <CharacterDisplay clickTarget={clickTarget} character={generateRandomCharacter()} flip={flip} active={active}></CharacterDisplay>
    <CharacterDisplay clickTarget={clickTarget} character={generateRandomCharacter()} flip={flip} active={active} odd></CharacterDisplay>
  </div>
);
*/
}

export default Battle;
