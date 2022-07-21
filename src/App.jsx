import React from 'react'
import './App.css'

function Square(props) {
  return (
    <button
      className={`square ${props.className}`}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        className={this.props.move === i ? 'selected' : ''}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  render() {
    const lines = []
    for (let i = 0; i < 9; i += 3) {
      const line = []
      for (let j = 0; j < 3; j++)
        line.push(this.renderSquare(i + j))

      lines.push(<div key={`line-${i + 1}`} className="board-row">{line}</div>)
    }
    return (<div>{lines}</div>)
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        i: -1,
      }],
      xIsNext: true,
      stepNumber: 0,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i])
      return

    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{ squares, i }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    const moves = history.map(({ i }, move) => {
      const desc = move
        ? `Go to move #${move}, location: (${Math.floor(i / 3) + 1}, ${(i % 3) + 1})`
        : 'Go to game state'
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    let status
    if (winner)
      status = `Winner: ${winner}`
    else
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`
    return (
      <div className="game">
        <div className="game-board">
          <Board
            move={current.i}
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
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
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a]
  }
  return null
}

export default Game
