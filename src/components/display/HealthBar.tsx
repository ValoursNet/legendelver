import React, { useState } from "react";

const HealthBar = (props: { completed: number; current: number; max: number; player: boolean; }) => {
    const { completed, current, max } = props;
    const bgcolor = props.player ? "#6d836e" : "#804d4c";

    return (
        <div style={{
            width: '100%',
            backgroundColor: "black",
            border: "4px solid black"
        }}>
            <div style={{
                height: '100%',
                width: `${completed}%`,
                backgroundColor: bgcolor,
                borderRadius: 'inherit',
                textAlign: 'center'
            }}>
                {current}/{max}
            </div>
        </div>
    );
};

export default HealthBar;