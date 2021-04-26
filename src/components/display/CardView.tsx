import React, { useState } from "react";
import ReactArcText from './ReactArcText';
//import Card from 'react-animated-3d-card';
import Tooltip from "react-simple-tooltip";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faBolt, faLayerGroup } from '@fortawesome/free-solid-svg-icons';


function parseCardDescription(description: string) {
    let asd = '<b>' + description + '</b>';
    return asd;
}

function getCardText(card: any) {
    if (card.description) return <div dangerouslySetInnerHTML={{ __html: parseCardDescription(card.description) }} />;
    //TODO add icons, clean up output
    let cardText = "";
    if (card.defense) cardText += "Add <b>" + card.defense + "</b> shield. "
    if (card.attack) cardText += "Attack for " + card.attack + " damage. "
    if (card.healing) cardText += "Heal for " + card.healing + " hp. "
    if (card.draw) cardText += "Draw " + card.draw + " cards. "
    if (card.repeat) cardText += "Take " + card.repeat + " extra actions. "

    return <div dangerouslySetInnerHTML={{ __html: cardText }} />;
}

function CardView({ card }: { card: any }) {
    const text = card.name;
    const classFont = '';
    const direction = 1;
    const arc = 220;

    const cardText = getCardText(card);

    return (
        <div style={{ position: "relative", width: "200px", height: "293px" }} onDragStart={(e) => { e.preventDefault(); }}>
            <div style={{
                height: "30px",
                position: "absolute",
                zIndex: 99999999999,
                background: "black",
                border: "2px solid white",
                borderRadius: "100%",
                width: "30px",
                textAlign: "center",
                visibility: card.delve ? "hidden" : "visible"
            }}>
                <Tooltip content="Costs 1 Action">
                    <div style={{ height: "24px", width: "24px" }}>
                        <FontAwesomeIcon className={"ml-1"} icon={faBolt} color="white" />
                    </div>
                </Tooltip>
            </div>
            <div style={{ position: "absolute", zIndex: 99999, left: "100px", top: "162px", fontSize: "13px", fontWeight: "bold" }}>
                <ReactArcText
                    text={text}
                    direction={direction}
                    arc={arc}
                    class={classFont}
                />
            </div>
            <div style={{ position: "absolute", zIndex: 9999 }}>
                <img
                    src={card.delve ? "../../assets/ui/card/front-legendary.png" : "../../assets/ui/card/front-rare.png"}
                    alt=""
                    onDragStart={(e) => { e.preventDefault(); }}
                />
            </div>
            <div style={{ position: "absolute", borderRadius: "20px", background: "#907f94" }}>
                <img onError={(e: any) => { e.target.onError = null; e.target.src = "../../assets/ui/card/art/book.png" }} src={"../../assets/ui/card/art/" + card.image + ".png"} alt="" onDragStart={(e) => { e.preventDefault(); }}></img>
            </div>
            <div style={{
                fontSize: "12px",
                paddingBottom: "7px",
                position: "absolute",
                left: "33px",
                top: "217px",
                zIndex: 99999,
                width: "133px",
                height: "47px",
                textAlign: "center",
                display: "flex",
                justifyContent: "center", /* align horizontal */
                alignItems: "center" /* align vertical */
            }}>
                {cardText}
            </div>
        </div>
    )
}

export default CardView;