import { Board, Piece, Ranks, Files, Position, Player, PieceId, ChessGame } from './chessGameModel';
import { getPieceAtPosition, isOffBoard, getPieceById } from './playChessGame'

export const getPossibleMoves = (allPieces: Piece[], piece: Piece): Position[] => {

    switch (piece.type) {

        case "Pawn":
            return getPawnPossibleMoves(allPieces, piece);
        case "Knight":
            return getKnightPossibleMoves(allPieces, piece);
        case "Rook":
            return getRookPossibleMoves(allPieces, piece);
        case "Bishop":
            return getBishopPossibleMoves(allPieces, piece);
        case "King":
            return getKingPossibleMoves(allPieces, piece);
        case "Queen":
            return getQueenPossibleMoves(allPieces, piece);
    }
};

const getPawnPossibleMoves = (pieces: Piece[], pawn: Piece): Position[] => {

    const possibleMoves: Position[] = [];
    const direction = pawn.player === "White" ? 1 : -1;

    // move forward one position
    let newRank = pawn.position.rank + direction as Ranks;
    let pieceAtPos = getPieceAtPosition(pieces, newRank, pawn.position.file);
    if (!pieceAtPos) {
        possibleMoves.push({ rank: newRank, file: pawn.position.file })

        if (pawn.moveCount === 0) {
            // test move forward 2 positions
            newRank = newRank + direction as Ranks;

            pieceAtPos = getPieceAtPosition(pieces, newRank, pawn.position.file);
            if (!pieceAtPos) {
                possibleMoves.push({ rank: newRank, file: pawn.position.file })
            }
        }
    }

    // test take diagonal 1
    newRank = pawn.position.rank + direction as Ranks;
    let newFile = pawn.position.file + 1 as Files;
    pieceAtPos = getPieceAtPosition(pieces, newRank, newFile);
    if (pieceAtPos && pieceAtPos.player !== pawn.player) {
        // can take diagonal
        possibleMoves.push({ rank: newRank, file: newFile })
    }

    // test take diagonal 2
    newRank = pawn.position.rank + direction as Ranks;
    newFile = pawn.position.file - 1 as Files;
    pieceAtPos = getPieceAtPosition(pieces, newRank, newFile);
    if (pieceAtPos && pieceAtPos.player !== pawn.player) {
        // can take diagonal
        possibleMoves.push({ rank: newRank, file: newFile })

    }

    return possibleMoves;
};

const getKnightPossibleMoves = (pieces: Piece[], knight: Piece): Position[] => {

    const testMoves1 = generatePositionPermutations(knight.position, [1, -1], [2, -2]);
    const testMoves2 = generatePositionPermutations(knight.position, [2, -2], [1, -1]);
    const testMoves = testMoves1.concat(testMoves2)

    return testMoves.reduce<Position[]>((acc, pos) => {
        if (isOffBoard(pos)) return acc;
        const pieceAtPos = getPieceAtPosition(pieces, pos.rank, pos.file);
        if (!pieceAtPos || pieceAtPos.player !== knight.player) {
            acc.push(pos);
        }
        return acc;
    }, []);
};

const getRookPossibleMoves = (pieces: Piece[], rook: Piece): Position[] => {

    let possibleMoves = testMovesAlongRanks(pieces, rook);
    possibleMoves = possibleMoves.concat(testMovesAlongFiles(pieces, rook));
    return possibleMoves;
};

const getBishopPossibleMoves = (pieces: Piece[], bishop: Piece): Position[] => {

    let possibleMoves = testMovesAlongDiagonal(pieces, bishop, true, true);
    possibleMoves = possibleMoves.concat(testMovesAlongDiagonal(pieces, bishop, true, false));
    possibleMoves = possibleMoves.concat(testMovesAlongDiagonal(pieces, bishop, false, true));
    possibleMoves = possibleMoves.concat(testMovesAlongDiagonal(pieces, bishop, false, false));
    return possibleMoves;
};

const getKingPossibleMoves = (pieces: Piece[], king: Piece): Position[] => {

    const testMoves = generatePositionPermutations(king.position, [1, 0, -1], [1, 0, -1])

    let possibleMoves = testMoves.reduce<Position[]>((acc, pos) => {
        if (isOffBoard(pos)) return acc;
        const pieceAtPos = getPieceAtPosition(pieces, pos.rank, pos.file);
        if (!pieceAtPos || pieceAtPos.player !== king.player) {
            acc.push(pos);
        }
        return acc;
    }, []);

    possibleMoves = possibleMoves.concat(canKingCastle(pieces, king));
    return possibleMoves;
}

const canKingCastle = (pieces: Piece[], king: Piece): Position[] => {

    const possibleMoves: Position[] = [];

    if (king.moveCount > 0) return possibleMoves;
    if (king.player === "White") {

        let rook = getPieceById(pieces, "White Kings Rook");
        if (rook && rook.moveCount === 0 &&
            getPieceAtPosition(pieces, 0, 1) === null &&
            getPieceAtPosition(pieces, 0, 2) === null &&
            getPieceAtPosition(pieces, 0, 3) === null) {
            possibleMoves.push({ rank: 0, file: 2 })
        }

        rook = getPieceById(pieces, "White Queens Rook");
        if (rook && rook.moveCount === 0 &&
            getPieceAtPosition(pieces, 0, 5) === null &&
            getPieceAtPosition(pieces, 0, 6) === null) {
            possibleMoves.push({ rank: 0, file: 6 })
        }
    } else {
        let rook = getPieceById(pieces, "Black Kings Rook");
        if (rook && rook.moveCount === 0 &&
            getPieceAtPosition(pieces, 7, 5) === null &&
            getPieceAtPosition(pieces, 7, 6) === null) {
            possibleMoves.push({ rank: 7, file: 6 })
        }

        rook = getPieceById(pieces, "Black Queens Rook");
        if (rook && rook.moveCount === 0 &&
            getPieceAtPosition(pieces, 7, 1) === null &&
            getPieceAtPosition(pieces, 7, 2) === null &&
            getPieceAtPosition(pieces, 7, 3) === null) {
            possibleMoves.push({ rank: 7, file: 2 })
        }
    }
    return possibleMoves;

}

const getQueenPossibleMoves = (pieces: Piece[], king: Piece): Position[] => {

    let possibleMoves = testMovesAlongDiagonal(pieces, king, true, true);
    possibleMoves = possibleMoves.concat(testMovesAlongDiagonal(pieces, king, true, false));
    possibleMoves = possibleMoves.concat(testMovesAlongDiagonal(pieces, king, false, true));
    possibleMoves = possibleMoves.concat(testMovesAlongDiagonal(pieces, king, false, false));
    possibleMoves = possibleMoves.concat(testMovesAlongRanks(pieces, king));
    possibleMoves = possibleMoves.concat(testMovesAlongFiles(pieces, king));

    return possibleMoves;
}

const testMovesAlongRanks = (pieces: Piece[], piece: Piece): Position[] => {

    const possibleMoves: Position[] = [];

    for (let rank = piece.position.rank + 1; rank < 8; rank++) {
        const pos = { rank: rank as Ranks, file: piece.position.file };
        const pieceAtPos = getPieceAtPosition(pieces, pos.rank, pos.file);
        if (!pieceAtPos || pieceAtPos.player !== piece.player) possibleMoves.push(pos);
        if (pieceAtPos) break;
    }

    for (let rank = piece.position.rank - 1; rank >= 0; rank--) {
        const pos = { rank: rank as Ranks, file: piece.position.file };
        const pieceAtPos = getPieceAtPosition(pieces, pos.rank, pos.file);
        if (!pieceAtPos || pieceAtPos.player !== piece.player) possibleMoves.push(pos);
        if (pieceAtPos) break;
    }

    return possibleMoves;
}

const testMovesAlongFiles = (pieces: Piece[], piece: Piece): Position[] => {

    const possibleMoves: Position[] = [];

    for (let file = piece.position.file + 1; file < 8; file++) {
        const pos = { rank: piece.position.rank, file: file as Files };
        const pieceAtPos = getPieceAtPosition(pieces, pos.rank, pos.file);
        if (!pieceAtPos || pieceAtPos.player !== piece.player) possibleMoves.push(pos);
        if (pieceAtPos) break;
    }

    for (let file = piece.position.file - 1; file >= 0; file--) {
        const pos = { rank: piece.position.rank, file: file as Files };
        const pieceAtPos = getPieceAtPosition(pieces, pos.rank, pos.file);
        if (!pieceAtPos || pieceAtPos.player !== piece.player) possibleMoves.push(pos);
        if (pieceAtPos) break;
    }

    return possibleMoves;
}

const testMovesAlongDiagonal = (pieces: Piece[], piece: Piece, rankDirection: boolean, fileDirection: boolean): Position[] => {

    const possibleMoves: Position[] = [];
    const rankFactor = rankDirection ? 1 : -1;
    const filesFactor = fileDirection ? 1 : -1;

    for (let i = 0 + 1; i < 8; i++) {
        const pos = {
            rank: piece.position.rank + i * rankFactor as Ranks,
            file: piece.position.file + i * filesFactor as Files
        }
        if (isOffBoard(pos)) break;
        const pieceAtPos = getPieceAtPosition(pieces, pos.rank, pos.file);
        if (!pieceAtPos || pieceAtPos.player !== piece.player) possibleMoves.push(pos);
        if (pieceAtPos) break;
    }
    return possibleMoves;
}

const generatePositionPermutations = (startPos: Position, rankOptions: number[], fileOptions: number[]): Position[] => {

    const permutations: Position[] = [];

    rankOptions.forEach(rank => {
        fileOptions.forEach(file => {
            const pos: Position = {
                rank: startPos.rank + rank as Ranks,
                file: startPos.file + file as Files
            };
            if (pos.rank >= 0 &&
                pos.rank < 8 &&
                pos.file >= 0 &&
                pos.file < 8 &&
                (startPos.file !== pos.file || startPos.rank !== pos.rank)) {
                permutations.push(pos);
            }
        })
    });
    return permutations;
}
