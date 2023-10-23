import { useState } from 'react';

function Square({ value, onSquareClick, highlight }) {
  const symbolClass = value === 'X' ? 'x-symbol' : value === 'O' ? 'o-symbol' : '';
  return (
    <button className={`square ${highlight} ${symbolClass}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  let winningSquares = null;
  const xSymbol = <span className="x-symbol">X</span>;
  const oSymbol = <span className="o-symbol">O</span>;

  if (winner) {
    status = (
      <span>
        Winner: {winner.item === 'X' ? xSymbol : oSymbol}
      </span>
    );
    winningSquares = winner.line;
  } else if (!squares.includes(null)) {
    status = 'Draw !!!';
  } else {
    status = (
      <span>
        Next player: {xIsNext ? xSymbol : oSymbol}
      </span>
    );
  }

  const rows = [];
  const degree = 3;
  for (let row = 0; row < degree; row++) {
    const squaresInRow = [];
    for (let col = 0; col < degree; col++) {
      const squareIndex = row * degree + col;
      const isWinningSquare = winningSquares && winningSquares.includes(squareIndex);
      squaresInRow.push(
        <Square
          key={squareIndex}
          value={squares[squareIndex]}
          onSquareClick={() => handleClick(squareIndex)}
          highlight={isWinningSquare ? 'highlight' : ''}
        />
      );
    }
    rows.push(
      <div key={row} className="board-row">
        {squaresInRow}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="content">{rows}</div>
    </>
  );
}


export default function Game() {
  const [history, setHistory] = useState([{
    squares: Array(9).fill(null),
    location: null
  }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function calculateLocation(nextSquares, prevSquares) {
    for (let i = 0; i < nextSquares.length; i++) {
      if (nextSquares[i] !== prevSquares[i]) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        return `(${row + 1}, ${col + 1})`; // Convert indices to (row, col) format
      }
    }
    return null;
  }

  function handlePlay(nextSquares) {
    const nextHistory = history.slice(0, currentMove + 1);
    const location = calculateLocation(nextSquares, currentSquares);
    nextHistory.push({ squares: nextSquares, location });
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((step, move) => {
    // sort the moves
    if (!isAscending) {
      move = history.length - 1 - move;
    }
    let description;
    if (move > 0) {
      description = (
        <p>
          Move to #{move} &nbsp;
          <span className={move % 2 ? 'x-symbol' : 'o-symbol'}>
            {step.location ? step.location : ''}
          </span>
        </p>
      );

    } else {
      description = 'Game start';
    }
    return (
      <li key={move}>
        {
          move === currentMove ? <span className="current-item">You are at move #{move}</span> :
            <button className={description === "Game start" ? "start-btn fancy" : "fancy"} onClick={() => jumpTo(move)}>
              <span className="top-key"></span>
              <span className="text">{description}</span>
              <span className="bottom-key-1"></span>
              <span className="bottom-key-2"></span>
            </button>
        }
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div>
        <div className="text-center">
          <label className="switch">
            <input type="checkbox" onClick={() => setIsAscending(!isAscending)} />
            <span className="slider"></span>
          </label>
        </div>
        <div className="game-info">
          <ul className="ul-wrapper">{moves}</ul>
        </div>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return (
        {
          item: squares[a],
          line: lines[i]
        }
      )
    }
  }
  return null;
}
