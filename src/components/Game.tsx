import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import styled from "styled-components";
import {
	BOARD_DIMENSIONS,
	BOX_SIZE,
	COLORS,
	INITIAL_BOARD,
	Pieces as PiecesType,
	Turn,
} from "../common/constants";
import { Bishop, King, Knight, Pawn, Queen, Rook } from "./pieces/pack1";
import {
	calculateBishopMove,
	calculateKingMove,
	calculateKnightMove,
	calculatePawnMove,
	calculateQueenMove,
	calculateRookMove,
	getBoard,
	getPointerPosition,
} from "../common/helpers";

const Game = () => {
	const boardRef = useRef<HTMLDivElement>(null);
	const currPieceRef = useRef<HTMLDivElement>(null);
	const dropzoneHighlightRef = useRef<HTMLDivElement>(null);

	const [board, setBoard] = useState(INITIAL_BOARD);
	const [selectedBox, setSelectedBox] = useState<
		[number | null, number | null]
	>([null, null]);
	const [isDragging, setIsDragging] = useState(false);
	const [validMoves, setValidMoves] = useState<number[][]>([]);
	const [currTurn, setCurrTurn] = useState(Turn.White);
	const [blackFirstDisplay, setBlackFirstDisplay] = useState(false);

	useEffect(() => {
		// Install event handlers
		document.addEventListener("mouseup", mouseUpHandler);

		return () => {
			document.removeEventListener("mouseup", mouseUpHandler);
		};
	}, []);

	const handleBoxClick = (row: number, col: number) => {
		const isEmpty = board[row][col] === 0;
		const isSelected = selectedBox[0] === row && selectedBox[1] === col;
		if (isSelected || isEmpty) {
			setSelectedBox([null, null]);
			setValidMoves([]);
		} else {
			setSelectedBox([row, col]);
		}
	};

	const handlePieceClick = (row: number, col: number) => {
		const piece = board[row][col];
		if (
			(currTurn === Turn.White && piece < 0) ||
			(currTurn === Turn.Black && piece > 0)
		)
			return;

		let moves: number[][] = [];

		switch (Math.abs(piece)) {
			case PiecesType.Pawn:
				moves = calculatePawnMove({
					row,
					col,
					board,
					reversedBoard: blackFirstDisplay,
				});
				break;
			case PiecesType.Knight:
				moves = calculateKnightMove({ row, col, board });
				break;
			case PiecesType.Bishop:
				moves = calculateBishopMove({ row, col, board });
				break;
			case PiecesType.Rook:
				moves = calculateRookMove({ row, col, board });
				break;
			case PiecesType.Queen:
				moves = calculateQueenMove({ row, col, board });
				break;
			case PiecesType.King:
				moves = calculateKingMove({ row, col, board });
				break;
		}

		setValidMoves(moves);
		setIsDragging(true);
		setSelectedBox([row, col]);
	};

	const mouseUpHandler = useCallback(() => {
		setIsDragging(false);
	}, []);

	const onDragHandler = (evt: any) => {
		if (!boardRef.current || !currPieceRef.current) return;
		// const elem = evt.target as HTMLElement;
		const [x, y] = getPointerPosition(
			evt,
			boardRef.current.getBoundingClientRect()
		);

		const pieceHeight = currPieceRef.current.offsetHeight;
		currPieceRef.current.style.left = `${x - pieceHeight / 2}px`;
		currPieceRef.current.style.top = `${y - pieceHeight / 2}px`;
	};

	const mouseOverHandler = (evt: any) => {
		if (!boardRef.current || !currPieceRef.current) return;

		const elem = evt.target as HTMLElement;

		const boundingClientRect = elem.getBoundingClientRect();
		const boardBoundingClientRect =
			boardRef.current.getBoundingClientRect();

		const [x, y] = [
			boundingClientRect.x - boardBoundingClientRect.x,
			boundingClientRect.y - boardBoundingClientRect.y,
		];

		if (dropzoneHighlightRef.current) {
			dropzoneHighlightRef.current.style.display = "block";

			dropzoneHighlightRef.current.style.left = `${x}px`;
			dropzoneHighlightRef.current.style.top = `${y}px`;
		}
	};

	const mouseOutHandler = (evt: any) => {
		if (dropzoneHighlightRef.current) {
			dropzoneHighlightRef.current.style.display = "none";
		}
	};

	const movePiece = (row: number, col: number) => {
		const newBoard = [...board];
		if (selectedBox[0] !== null && selectedBox[1] !== null) {
			newBoard[row][col] = board[selectedBox[0]][selectedBox[1]];
			newBoard[selectedBox[0]][selectedBox[1]] = 0;
		}
		setBoard(newBoard);
		setValidMoves([]);

		const updatedCurrTurn =
			currTurn === Turn.White ? Turn.Black : Turn.White;
		setCurrTurn(updatedCurrTurn);
		// setBlackFirstDisplay(updatedCurrTurn === Turn.Black);
		// setBoard(getBoard(board, true));
	};

	// Components

	const Grid = () => {
		let isLightSquare = false;

		return (
			<>
				{board.map((row, rowIdx) => {
					return row.map((_, colIdx) => {
						const isSelected =
							selectedBox[0] === rowIdx &&
							selectedBox[1] === colIdx;
						isLightSquare = (rowIdx + colIdx) % 2 === 0;

						return (
							<Box
								key={`${rowIdx}_${colIdx}`}
								className={isLightSquare ? "light" : "dark"}
								selected={isSelected}
								onClick={() => handleBoxClick(rowIdx, colIdx)}
								onMouseOver={mouseOverHandler}
								onMouseOut={mouseOutHandler}
							/>
						);
					});
				})}
			</>
		);
	};

	const PieceIcon = ({ piece }: { piece: PiecesType }) => {
		if (Math.abs(piece) === PiecesType.King) {
			return (
				<King
					color={piece < 0 ? COLORS.BLACK : COLORS.WHITE}
					stroke={piece > 0 ? COLORS.BLACK : COLORS.WHITE}
				/>
			);
		} else if (Math.abs(piece) === PiecesType.Queen) {
			return (
				<Queen
					color={piece < 0 ? COLORS.BLACK : COLORS.WHITE}
					stroke={piece > 0 ? COLORS.BLACK : COLORS.WHITE}
				/>
			);
		} else if (Math.abs(piece) === PiecesType.Rook) {
			return (
				<Rook
					color={piece < 0 ? COLORS.BLACK : COLORS.WHITE}
					stroke={piece > 0 ? COLORS.BLACK : COLORS.WHITE}
				/>
			);
		} else if (Math.abs(piece) === PiecesType.Knight) {
			return (
				<Knight
					color={piece < 0 ? COLORS.BLACK : COLORS.WHITE}
					stroke={piece > 0 ? COLORS.BLACK : COLORS.WHITE}
				/>
			);
		} else if (Math.abs(piece) === PiecesType.Bishop) {
			return (
				<Bishop
					color={piece < 0 ? COLORS.BLACK : COLORS.WHITE}
					stroke={piece > 0 ? COLORS.BLACK : COLORS.WHITE}
				/>
			);
		} else if (Math.abs(piece) === PiecesType.Pawn) {
			return (
				<Pawn
					size={BOARD_DIMENSIONS * BOX_SIZE}
					color={piece < 0 ? COLORS.BLACK : COLORS.WHITE}
					stroke={piece > 0 ? COLORS.BLACK : COLORS.WHITE}
				/>
			);
		}
	};

	const Pieces = () => {
		return board.map((row, rowIdx) => {
			return row.map((piece, colIdx) => {
				const isSelected =
					selectedBox[0] === rowIdx && selectedBox[1] === colIdx;

				if (piece) {
					return (
						<PieceContainer
							style={{
								top: rowIdx * BOARD_DIMENSIONS * BOX_SIZE,
								left: colIdx * BOARD_DIMENSIONS * BOX_SIZE,
							}}
							key={`${piece}_${rowIdx}_${colIdx}`}
							ref={isSelected && isDragging ? currPieceRef : null}
							selected={isSelected}
							dragging={isSelected && isDragging}
							onMouseDown={() => handlePieceClick(rowIdx, colIdx)}
							onMouseOver={mouseOverHandler}
							onMouseOut={mouseOutHandler}
						>
							<PieceIcon piece={piece} />
						</PieceContainer>
					);
				}
			});
		});
	};

	const ValidMoveMarker = () => {
		return validMoves.map((move) => {
			const [row, col] = move;
			const isLightSquare = (row + col) % 2 === 0;

			return (
				<Marker
					key={`${row}_${col}`}
					className={isLightSquare ? "light" : "dark"}
					selected={true}
					style={{
						top: row * BOARD_DIMENSIONS * BOX_SIZE,
						left: col * BOARD_DIMENSIONS * BOX_SIZE,
					}}
					onClick={() => movePiece(row, col)}
					onMouseOver={mouseOverHandler}
					onMouseOut={mouseOutHandler}
					onMouseUp={() => movePiece(row, col)}
				>
					{board[row][col] === 0 ? <Move /> : <Capture />}
				</Marker>
			);
		});
	};

	return (
		<Wrapper>
			<Board
				ref={boardRef}
				onMouseMove={onDragHandler}
				onMouseUp={mouseOutHandler}
				dragging={isDragging}
			>
				<HorizontalLabels reverse={blackFirstDisplay} />
				<VerticalLabels reverse={blackFirstDisplay} />
				<Grid />
				<Pieces />
				<ValidMoveMarker />
				<DropzoneHighlight
					ref={dropzoneHighlightRef}
					data-selection-attr={"dropzone-highlight"}
				/>
			</Board>
			<Label>
				Current turn: <span>{currTurn}</span>
				<br />
				Black first:{" "}
				<input
					type="checkbox"
					checked={blackFirstDisplay}
					onChange={(evt: any) => {
						setBlackFirstDisplay(evt.target.checked);
						setBoard(getBoard(board, true));
					}}
				/>
			</Label>
		</Wrapper>
	);
};

const HorizontalLabels = ({ reverse }: { reverse: boolean }) => {
	return (
		<HorizontalWrapper>
			{Array.from({ length: 8 }).map((_, idx) => (
				<div key={idx}>
					{String.fromCharCode(reverse ? 97 + 7 - idx : 97 + idx)}
				</div>
			))}
		</HorizontalWrapper>
	);
};

const VerticalLabels = ({ reverse }: { reverse: boolean }) => {
	return (
		<VerticalWrapper>
			{Array.from({ length: 8 }).map((_, idx) => (
				<div key={idx}>{reverse ? 8 - idx : idx + 1}</div>
			))}
		</VerticalWrapper>
	);
};

const HorizontalWrapper = styled.div`
	position: absolute;
	bottom: -50px;
	left: 0;
	display: flex;
	width: ${BOARD_DIMENSIONS}px;
	height: 50px;

	& div {
		width: ${BOX_SIZE * BOARD_DIMENSIONS}px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 0 10px;
	}
`;

const VerticalWrapper = styled.div`
	position: absolute;
	top: 0;
	left: -50px;
	width: 50px;
	height: ${BOARD_DIMENSIONS}px;
	display: flex;
	flex-direction: column-reverse;

	& div {
		height: ${BOARD_DIMENSIONS * BOX_SIZE}px;
		display: flex;
		justify-content: center;
		align-items: end;
		padding: 10px 0;
	}
`;

const Wrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	width: 100%;
	background-color: #282c34;
	font-size: 24px;
`;

const Board = styled.div<{ dragging: boolean }>`
	display: grid;
	grid-template-columns: repeat(8, 1fr);
	grid-template-rows: repeat(8, 1fr);
	width: ${BOARD_DIMENSIONS}px;
	height: ${BOARD_DIMENSIONS}px;
	border-radius: 0.5rem;
	position: relative;
	cursor: ${(props) => (props.dragging ? "grabbing" : "default")};
`;

const Box = styled.div<{ selected: boolean }>`
	display: flex;
	justify-content: center;
	align-items: center;
	${(props) =>
		props.selected && {
			backgroundColor: `${COLORS.SELECTION} !important`,
		}};

	&.light {
		background-color: ${COLORS.LIGHT};
		color: #121212;
	}

	&.dark {
		background-color: ${COLORS.DARK};
	}
`;

const PieceContainer = styled.div<{ selected: boolean; dragging: boolean }>`
	position: absolute;
	width: ${BOARD_DIMENSIONS * BOX_SIZE}px;
	height: ${BOARD_DIMENSIONS * BOX_SIZE}px;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: ${(props) => (props.dragging ? "grabbing" : "grab")};
	pointer-events: ${(props) => (props.dragging ? "none" : "all")};
	z-index: ${(props) => (props.selected ? 3 : 1)};

	& svg {
		pointer-events: none;
		width: 80%;
		height: 80%;

		& path {
			stroke: black;
		}
	}
`;

const Marker = styled.div<{ selected: boolean }>`
	position: absolute;
	width: ${BOARD_DIMENSIONS * BOX_SIZE}px;
	height: ${BOARD_DIMENSIONS * BOX_SIZE}px;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 2;
`;

const Move = styled.div`
	width: 30%;
	height: 30%;
	background-color: #58545424;
	border-radius: 50%;
	pointer-events: none;
	box-sizing: border-box;
`;

const Capture = styled.div`
	width: 100%;
	height: 100%;
	background-color: transparent;
	border: 10px solid #58545424;
	border-radius: 50%;
	pointer-events: none;
	box-sizing: border-box;
`;

const Label = styled.div`
	position: absolute;
	top: 10px;
	right: 20px;

	span {
		text-transform: uppercase;
		font-size: 35px;
		font-weight: bold;
	}
`;

const DropzoneHighlight = styled.div`
	position: absolute;
	width: ${BOARD_DIMENSIONS * BOX_SIZE}px;
	height: ${BOARD_DIMENSIONS * BOX_SIZE}px;
	top: 0;
	right: 0;
	box-sizing: border-box;
	border: 8px solid ${COLORS.DROPZONE};
	pointer-events: none;
	z-index: 2;
	display: none;
`;

export default Game;
