import React, { useState } from "react";
import Button from "./Button";
import Animation from "./display/Animation";
import Battle from "./display/Battle";
import CharacterSelect from "./display/CharacterSelect";

function Screen() {
  const [text, setText] = useState("screen");

  return (
    //<Battle clickTarget={null}></Battle>
    <div className="screen battlebg">
      <div className="container">
        <div className="row align-items-center">
          <h2>Select Character</h2>
          <div className="col-lg-5">
            <CharacterSelect playerName={"Player 1"}></CharacterSelect>
            <CharacterSelect playerName={"Player 2"}></CharacterSelect>
            <CharacterSelect playerName={"Player 3"}></CharacterSelect>
            <CharacterSelect playerName={"Player 4"}></CharacterSelect>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Screen;
