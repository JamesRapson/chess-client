import React, { Fragment } from "react";
import { blackSquareColor, getSquaresCoordinates, squareHeight, squareWidth, whiteSquareColor } from "./board";
import { Files, Player, Ranks } from "./model/chessGameModel";
import { GamePlayState } from "./model/gamePlayState";

type ChessBoardProps = {
    gamePlayState: GamePlayState;
    onSelectSquare: (rank: Ranks, file: Files) => void;
};

export const ChessBoard = ({ gamePlayState, onSelectSquare }: ChessBoardProps) => {
    const ranks: Ranks[] = [0, 1, 2, 3, 4, 5, 6, 7];
    const files: Files[] = [0, 1, 2, 3, 4, 5, 6, 7];
    let alt: boolean = false;
    return (
        <>
            {ranks.map((rank) => {
                alt = !alt;
                return files.map((file) => {
                    alt = !alt;
                    const player = alt ? "White" : "Black";
                    return (
                        <ChessBoardSquare
                            rank={rank}
                            file={file}
                            player={player}
                            gamePlayState={gamePlayState}
                            onSelectSquare={onSelectSquare}
                        />
                    );
                });
            })}
        </>
    );
};

type ChessBoardSquareProps = {
    rank: Ranks;
    file: Files;
    player: Player;
    gamePlayState: GamePlayState;
    onSelectSquare: (rank: Ranks, file: Files) => void;
};

export const ChessBoardSquare = ({ rank, file, player, gamePlayState, onSelectSquare }: ChessBoardSquareProps) => {
    const color = player === "White" ? whiteSquareColor : blackSquareColor;
    const selectedSquare = gamePlayState.selectedSquare;
    const isSelected = selectedSquare && selectedSquare.file === file && selectedSquare.rank === rank;
    const { x, y } = getSquaresCoordinates(rank, file);

    return (
        <Fragment key={`Frag${rank},${file}`}>
            <rect
                key={`Square${rank},${file}`}
                x={x}
                y={y}
                width={squareWidth}
                height={squareHeight}
                onClick={() => onSelectSquare(rank, file)}
                style={{
                    fill: color,
                    stroke: "black",
                    strokeWidth: isSelected ? 5 : 2,
                    opacity: 1,
                }}
            ></rect>
            <text key={`Info${rank},${file}`} x={x + 5} y={y + 15} fill="black">
                R: {rank}, F: {file}
            </text>
        </Fragment>
    );
};
