import React, { useCallback, useState } from 'react'
import { Box, Button, Container, TextField } from '@mui/material'

function OperatorButton({ label, action, isActive, onClick }) {
  return (
    <Button
      variant={isActive ? 'contained' : 'outlined'}
      color="success"
      onClick={() => onClick(action)}
    >
      {label}
    </Button>
  )
}

export default function App() {
  const [display, setDisplay] = useState('')
  const [firstOperand, setFirstOperand] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false)
  const [lastOperator, setLastOperator] = useState(null)
  const [lastSecondOperand, setLastSecondOperand] = useState(null)

  const [activeOperator, setActiveOperator] = useState(null)

  const reset = useCallback(() => {
    setDisplay('')
    setFirstOperand(null)
    setOperator(null)
    setWaitingForSecondOperand(false)
    setLastOperator(null)
    setLastSecondOperand(null)
    setActiveOperator(null)
  }, [])

  const inputDigit = useCallback((digit) => {
    if (activeOperator) setActiveOperator(null)
    if (waitingForSecondOperand) {
      setDisplay(digit === '.' ? '0.' : digit)
      setWaitingForSecondOperand(false)
      return
    }

    if (digit === '.') {
      if (!display) { setDisplay('0.'); return }
      if (display.includes('.')) return
    }

    setDisplay(prev => prev ? prev + digit : digit)
  }, [activeOperator, display, waitingForSecondOperand])

  const round = (value) => Math.round((value + Number.EPSILON) * 1e10) / 1e10

  const performCalculation = useCallback((op, a, b) => {
    switch (op) {
      case 'add': return round(a + b)
      case 'subtract': return round(a - b)
      case 'multiply': return round(a * b)
      case 'divide': return b === 0 ? NaN : round(a / b)
      default: return b
    }
  }, [])

  const setOp = useCallback((nextOperator) => {
    const inputValue = parseFloat(display || '0')

    if (operator && waitingForSecondOperand) {
      setOperator(nextOperator)
      return
    }

    if (firstOperand === null) {
      setFirstOperand(inputValue)
    } else if (operator) {
      const result = performCalculation(operator, firstOperand, inputValue)
      setDisplay(String(result))
      setFirstOperand(result)
    }

    setOperator(nextOperator)
    setWaitingForSecondOperand(true)
    setLastOperator(null)
    setLastSecondOperand(null)
    setActiveOperator(nextOperator)
  }, [display, firstOperand, operator, performCalculation, waitingForSecondOperand])

  const handleEquals = useCallback(() => {
    if (operator !== null) {
      if (waitingForSecondOperand) return
      const inputValue = parseFloat(display || '0')
      const result = performCalculation(operator, firstOperand ?? 0, inputValue)
      setDisplay(String(result))
      setFirstOperand(result)
      setLastOperator(operator)
      setLastSecondOperand(inputValue)
      setOperator(null)
      setWaitingForSecondOperand(true)
      setActiveOperator(null)
      return
    }

    if (lastOperator !== null && lastSecondOperand !== null) {
      const a = parseFloat(display || '0')
      const result = performCalculation(lastOperator, a, lastSecondOperand)
      setDisplay(String(result))
      setFirstOperand(result)
      setWaitingForSecondOperand(true)
    }
  }, [display, firstOperand, lastOperator, lastSecondOperand, operator, performCalculation, waitingForSecondOperand])

  const handleKeyDown = useCallback((e) => {
    const { key } = e
    if (/^[0-9]$/.test(key)) { inputDigit(key); return }
    if (key === '.') { inputDigit('.'); return }
    if (key === 'Enter' || key === '=') { handleEquals(); return }
    if (key === 'Escape') { reset(); return }
    if (key === '+') { setOp('add'); return }
    if (key === '-') { setOp('subtract'); return }
    if (key === '*' || key.toLowerCase() === 'x') { setOp('multiply'); return }
    if (key === '/') { setOp('divide'); return }
  }, [handleEquals, inputDigit, reset, setOp])

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const numberButton = useCallback((text) => (
    <Button variant="contained" onClick={() => inputDigit(text)}>{text}</Button>
  ), [inputDigit])

  return (
    <Container className="page">
      <Box className="calculator">
        <TextField
          value={display}
          onChange={() => {}}
          fullWidth
          variant="outlined"
          sx={{ bgcolor: 'white' }}
          inputProps={{ inputMode: 'decimal', readOnly: true, style: { textAlign: 'right', fontSize: 24, color: '#000' } }}
        />

        <Box className="keys">
          <Button className="row-span-2" color="warning" variant="contained" onClick={reset}>C</Button>
          <OperatorButton label="/" action="divide" isActive={activeOperator === 'divide'} onClick={setOp} />
          <OperatorButton label="x" action="multiply" isActive={activeOperator === 'multiply'} onClick={setOp} />

          {numberButton('7')}
          {numberButton('8')}
          {numberButton('9')}
          <OperatorButton label="-" action="subtract" isActive={activeOperator === 'subtract'} onClick={setOp} />

          {numberButton('4')}
          {numberButton('5')}
          {numberButton('6')}
          <OperatorButton label="+" action="add" isActive={activeOperator === 'add'} onClick={setOp} />

          {numberButton('1')}
          {numberButton('2')}
          {numberButton('3')}
          {numberButton('0')}

          {numberButton('.')}
          <Button variant="contained" color="success" onClick={handleEquals}>=</Button>
        </Box>
        <div className="credit">Lab 4: React + MUI Calculator</div>
      </Box>
    </Container>
  )
}


