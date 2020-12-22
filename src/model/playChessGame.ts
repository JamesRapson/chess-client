import { Board, Piece, Ranks, Files, Position, Player, PieceId, ChessGame } from './chessGameModel';
import { getPossibleMoves } from './possibleMoves'

export const getPieceById = (pieces: Piece[], id: PieceId) => {

    return pieces.find(piece => piece.id === id);
}

// check if there is any move of the specified piece to escape check
const canMovePieceToEscapeCheck = (allPieces: Piece[], piece: Piece) => {

    const possibleMoves = getPossibleMoves(allPieces, piece);
    for (let move of possibleMoves) {

        const game: ChessGame = {
            currentBoard: {
                pieces: allPieces
            },
            moves: [],
            currentState: "Playing",
            playersTurn: piece.player,
        };

        doMove(game, piece, move);

        if (!isInCheck(game.currentBoard.pieces, piece.player))
            return true;
    }
    return false;
}

// check if the specified player is in check mate
export const isInCheckMate = (pieces: Piece[], player: Player): boolean => {

    if (!isInCheck(pieces, player)) return false;

    const playersPieces = pieces.filter(piece => piece.player !== player && !piece.isOffBoard)
    for (let piece of playersPieces) {
        if (canMovePieceToEscapeCheck(pieces, piece))
            return false;
    }
    return true;
}

// check if the specified player is in check
export const isInCheck = (pieces: Piece[], player: Player): Piece | null => {

    const playersKing = pieces.find(piece => piece.player === player && piece.type === "King");
    if (!playersKing) throw Error("Failed to find king");

    const playersPieces = pieces.filter(piece => piece.player !== player && !piece.isOffBoard)
    for (let piece of playersPieces) {
        const possibleMoves = getPossibleMoves(pieces, piece);
        if (possibleMoves.find(pos => pos.rank === playersKing.position.rank && pos.file === playersKing.position.file)) {
            return piece;
        }
    }
    return null;
}

// check if the specified play is able to make any moves
export const testIfPossibleMoves = (pieces: Piece[], player: Player): boolean => {

    return pieces
        .filter(piece => piece.player !== player && !piece.isOffBoard)
        .reduce<boolean>((acc, piece) => {
            if (acc) return acc;
            const possibleMoves = getPossibleMoves(pieces, piece);
            acc = possibleMoves.length > 0;
            return acc;
        }, false);
}

export const isOffBoard = (position: Position) => {
    if (position.file < 0 || position.file > 7) return true;
    if (position.rank < 0 || position.rank > 7) return true;
    return false;
}

export const getPieceAtPosition = (pieces: Piece[], rank: Ranks, file: Files): Piece | null => {

    if (isOffBoard({ rank, file })) return null;

    const piece = pieces.find(piece => {
        return (!piece.isOffBoard &&
            piece.position.file === file &&
            piece.position.rank === rank);
    });

    return piece || null;
};

export const initialiseBoard = (): Board => {

    const pieces: Piece[] = [
        {
            id: "White Queens Rook",
            type: "Rook",
            position: {
                rank: 0,
                file: 0,
            },
            player: "White",
            moveCount: 0
        },
        {
            id: "White Queens Knight",
            type: "Knight",
            position: {
                rank: 0,
                file: 1,
            },
            player: "White",
            moveCount: 0
        },
        {
            id: "White Queens Bishop",
            type: "Bishop",
            position: {
                rank: 0,
                file: 2,
            },
            player: "White",
            moveCount: 0
        },
        {
            id: "White Queen",
            type: "Queen",
            position: {
                rank: 0,
                file: 3,
            },
            player: "White",
            moveCount: 0
        },
        {
            id: "White King",
            type: "King",
            position: {
                rank: 0,
                file: 4,
            },
            player: "White",
            moveCount: 0
        },
        {
            id: "White Kings Bishop",
            type: "Bishop",
            position: {
                rank: 0,
                file: 5,
            },
            player: "White",
            moveCount: 0
        },
        {
            id: "White Kings Knight",
            type: "Knight",
            position: {
                rank: 0,
                file: 6,
            },
            player: "White",
            moveCount: 0
        },
        {
            id: "White Kings Rook",
            type: "Rook",
            position: {
                rank: 0,
                file: 7
            },
            player: "White",
            moveCount: 0
        },
        {
            id: "Black Queens Rook",
            type: "Rook",
            position: {
                rank: 7,
                file: 0,
            },
            player: "Black",
            moveCount: 0
        },
        {
            id: "Black Queens Knight",
            type: "Knight",
            position: {
                rank: 7,
                file: 1,
            },
            player: "Black",
            moveCount: 0
        },
        {
            id: "Black Queens Bishop",
            type: "Bishop",
            position: {
                rank: 7,
                file: 2,
            },
            player: "Black",
            moveCount: 0
        },
        {
            id: "Black Queen",
            type: "Queen",
            position: {
                rank: 7,
                file: 3,
            },
            player: "Black",
            moveCount: 0
        },
        {
            id: "Black King",
            type: "King",
            position: {
                rank: 7,
                file: 4,
            },
            player: "Black",
            moveCount: 0
        },
        {
            id: "Black Kings Bishop",
            type: "Bishop",
            position: {
                rank: 7,
                file: 5,
            },
            player: "Black",
            moveCount: 0
        },
        {
            id: "Black Kings Knight",
            type: "Knight",
            position: {
                rank: 7,
                file: 6,
            },
            player: "Black",
            moveCount: 0
        },
        {
            id: "Black Kings Rook",
            type: "Rook",
            position: {
                rank: 7,
                file: 7,
            },
            player: "Black",
            moveCount: 0
        },
    ];

    for (let file = 0; file < 8; file++) {

        pieces.push(
            {
                id: `White Pawn ${file}` as PieceId,
                type: "Pawn",
                position: {
                    rank: 1,
                    file: file as Files,
                },
                player: "White",
                moveCount: 0
            });

        pieces.push(
            {
                id: `Black Pawn ${file}` as PieceId,
                type: "Pawn",
                position: {
                    rank: 6,
                    file: file as Files,
                },
                player: "Black",
                moveCount: 0
            });
    }
    const board: Board = {
        pieces,
    };

    return board;
};

export const initialiseGame = () => {
    const game: ChessGame = {
        currentBoard: initialiseBoard(),
        moves: [],
        playersTurn: "White",
        currentState: "Playing",
    };
    return game;
}


export const doMove = (game: ChessGame, piece: Piece, position: Position) => {

    if (doCastleMove(game, piece, position)) {
        return;
    }
    const takenPiece = getPieceAtPosition(game.currentBoard.pieces, position.rank, position.file);

    // do normal move
    const move = {
        player: piece.player,
        pieceMoves: [{
            piece: piece,
            startPosition: {
                rank: piece.position.rank,
                file: piece.position.file
            },
            endPosition: position
        }]
    };

    if (takenPiece) {
        takenPiece.isOffBoard = true;
        move.pieceMoves.push({
            piece: takenPiece,
            startPosition: {
                rank: takenPiece.position.rank,
                file: takenPiece.position.file
            },
            endPosition: { rank: -1, file: -1 }
        });
    }
    game.moves.push(move);

    piece.position = position;
    piece.moveCount = piece.moveCount + 1;
}

const doCastleMove = (game: ChessGame, king: Piece, position: Position): boolean => {

    if (king.moveCount !== 0)
        return false;

    const kingOrigPos = {
        rank: king.position.rank,
        file: king.position.file
    };

    let rookNewPos: Position = { rank: 0, file: 0 };
    let rookId: PieceId | null = null;

    if (king.type === "King" &&
        king.player === "White" &&
        (position.rank === 0 && position.file === 2)) {
        rookId = "White Queens Rook";
        rookNewPos = { rank: 0, file: 3 };
    }
    else if (king.type === "King" &&
        king.player === "White" &&
        (position.rank === 0 && position.file === 6)) {
        rookId = "White Kings Rook";
        rookNewPos = { rank: 0, file: 5 };
    }
    else if (king.type === "King" &&
        king.player === "Black" &&
        (position.rank === 7 && position.file === 2)) {
        rookId = "Black Queens Rook";
        rookNewPos = { rank: 7, file: 3 };
    }
    else if (king.type === "King" &&
        king.player === "Black" &&
        (position.rank === 7 && position.file === 6)) {
        rookId = "Black Kings Rook";
        rookNewPos = { rank: 7, file: 5 };
    }
    else {
        return false;
    }

    const rook = getPieceById(game.currentBoard.pieces, rookId);
    if (!rook || rook.moveCount !== 0) return false;

    const move = {
        player: king.player,
        pieceMoves: [{
            piece: king,
            startPosition: kingOrigPos,
            endPosition: position
        }, {
            piece: rook,
            startPosition: rook.position,
            endPosition: rookNewPos
        }]
    };
    game.moves.push(move);

    king.position = position;
    king.moveCount = king.moveCount + 1;
    rook.position = rookNewPos;
    rook.moveCount = rook.moveCount + 1;

    return true;
}
