import React, { useState } from "react";
import { SpriteAnimator } from 'react-sprite-animator';

function Animation({
    character,
    flip = false
}: {
    character: string,
    flip?: boolean
}) {
    const fps = 1 + Math.floor(Math.random() * 9);
    const startFrame = Math.floor(Math.random() * 4);

    const size = 192;
    const scale = 1;
    const sizeScale = size / scale;
    return (
        <div className={
            (flip ? "flip-it mr-auto" : "ml-auto")
        }
            style={{
                width: sizeScale + "px",
                height: sizeScale + "px",
                //Gold glow
                //filter: "drop-shadow(0px 0px 3px rgba(212, 175, 55, 0.5))"
            }}>
            <img src={"../../assets/characters/" + character + ".png"} width={size} height={size} />
            {/*
            <SpriteAnimator
                sprite={"../../assets/heroes/spritesheets/" + character + ".png"}
                width={size}
                height={size}
                scale={scale}
                fps={fps}
                frame={startFrame}
            />
            */}
        </div>
    )
}

export default Animation;