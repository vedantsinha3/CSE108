(function () {
  const display = document.getElementById('display');
  const keys = document.querySelector('.keys');

  /**
   * Calculator state
   */
  let firstOperand = null;
  let operator = null;
  let waitingForSecondOperand = false;
  let lastOperator = null;
  let lastSecondOperand = null;
  let activeOperatorButton = null;

  function reset() {
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    lastOperator = null;
    lastSecondOperand = null;
    display.value = '';
    clearActiveOperator();
  }

  function inputDigit(digit) {
    // number input clears operator highlight
    if (activeOperatorButton) clearActiveOperator();
    if (waitingForSecondOperand) {
      display.value = digit === '.' ? '0.' : digit;
      waitingForSecondOperand = false;
      return;
    }

    if (digit === '.') {
      if (!display.value) {
        display.value = '0.';
        return;
      }
      if (display.value.includes('.')) return;
    }

    display.value = display.value ? display.value + digit : digit;
  }

  function setOperator(nextOperator) {
    const inputValue = parseFloat(display.value || '0');

    if (operator && waitingForSecondOperand) {
      operator = nextOperator;
      return;
    }

    if (firstOperand === null) {
      firstOperand = inputValue;
    } else if (operator) {
      const result = performCalculation(operator, firstOperand, inputValue);
      display.value = String(result);
      firstOperand = result;
    }

    operator = nextOperator;
    waitingForSecondOperand = true;
    // Starting a fresh chain; discard repeated-equals state
    lastOperator = null;
    lastSecondOperand = null;
    setActiveOperator(nextOperator);
  }

  function performCalculation(op, a, b) {
    switch (op) {
      case 'add': return round(a + b);
      case 'subtract': return round(a - b);
      case 'multiply': return round(a * b);
      case 'divide': return b === 0 ? NaN : round(a / b);
      default: return b;
    }
  }

  function round(value) {
    return Math.round((value + Number.EPSILON) * 1e10) / 1e10;
  }

  function setActiveOperator(action) {
    const button = keys.querySelector('button[data-action="' + action + '"]');
    if (activeOperatorButton === button) return;
    if (activeOperatorButton) activeOperatorButton.classList.remove('active');
    if (button) {
      button.classList.add('active');
      activeOperatorButton = button;
    }
  }

  function clearActiveOperator() {
    if (activeOperatorButton) {
      activeOperatorButton.classList.remove('active');
      activeOperatorButton = null;
    }
  }

  function handleEquals() {
    // Case 1: We have an active operator and a second operand → compute and remember
    if (operator !== null) {
      if (waitingForSecondOperand) return; // no second operand yet
      const inputValue = parseFloat(display.value || '0');
      const result = performCalculation(operator, firstOperand, inputValue);
      display.value = String(result);
      firstOperand = result;
      // Remember for repeated equals
      lastOperator = operator;
      lastSecondOperand = inputValue;
      operator = null;
      waitingForSecondOperand = true; // next digit replaces
      clearActiveOperator();
      return;
    }

    // Case 2: No active operator, but we have a previous operation → repeat it
    if (lastOperator !== null && lastSecondOperand !== null) {
      const a = parseFloat(display.value || '0');
      const result = performCalculation(lastOperator, a, lastSecondOperand);
      display.value = String(result);
      firstOperand = result;
      waitingForSecondOperand = true; // keep replacing on next digit
    }
  }

  keys.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLButtonElement)) return;

    const value = target.getAttribute('data-value');
    const action = target.getAttribute('data-action');

    if (value) {
      inputDigit(value);
      return;
    }

    if (action === 'clear') {
      reset();
      return;
    }

    if (action === 'equals') {
      handleEquals();
      return;
    }

    if (action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide') {
      setOperator(action);
      return;
    }
  });

  // Keyboard support
  window.addEventListener('keydown', (e) => {
    const { key } = e;
    if (/^[0-9]$/.test(key)) {
      inputDigit(key);
      return;
    }
    if (key === '.') { inputDigit('.'); return; }
    if (key === 'Enter' || key === '=') { handleEquals(); return; }
    if (key === 'Escape') { reset(); return; }
    if (key === '+') { setOperator('add'); return; }
    if (key === '-') { setOperator('subtract'); return; }
    if (key === '*' || key.toLowerCase() === 'x') { setOperator('multiply'); return; }
    if (key === '/') { setOperator('divide'); return; }
  });

  // Initialize
  reset();
})();


