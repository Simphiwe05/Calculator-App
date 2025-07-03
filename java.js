const display = document.getElementById('display');

const buttons = document.querySelectorAll('.calculator button');

let currentInput = ''; 
let operator = null;  
let previousInput = ''; 
let awaitingNextInput = false; 


function updateDisplay() {
    display.value = currentInput || '0'; 
}


function handleNumber(num) {
    if (awaitingNextInput) {
        currentInput = num;
        awaitingNextInput = false;
    } else {
        
        if (num === '.' && currentInput.includes('.')) {
            return;
        }
        currentInput += num;
    }
    updateDisplay();
}


function handleOperator(op) {
    if (currentInput === '') {
        
        operator = op;
        return;
    }

    if (previousInput && operator && !awaitingNextInput) {
       
        currentInput = String(calculate(previousInput, currentInput, operator));
        updateDisplay();
    }

    previousInput = currentInput;
    operator = op;
    awaitingNextInput = true;
}


function handleEquals() {
    if (!previousInput || !operator || currentInput === '') {
        return;
    }

    try {
        currentInput = String(calculate(previousInput, currentInput, operator));
        updateDisplay();
        previousInput = ''; 
        operator = null;
        awaitingNextInput = true;
    } catch (error) {
        display.value = 'Error';
        currentInput = '';
        previousInput = '';
        operator = null;
        awaitingNextInput = false;
        console.error("Calculation error:", error);
    }
}


function handleClear() {
    currentInput = '';
    operator = null;
    previousInput = '';
    awaitingNextInput = false;
    updateDisplay();
}


function calculate(num1, num2, op) {
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);

    if (isNaN(n1) || isNaN(n2)) {
        throw new Error("Invalid number input");
    }

    switch (op) {
        case '+':
            return n1 + n2;
        case '-':
            return n1 - n2;
        case '*':
            return n1 * n2;
        case '/':
            if (n2 === 0) {
                throw new Error("Cannot divide by zero");
            }
            return n1 / n2;
        default:
            return n2; 
    }
}


buttons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.dataset.num) {
            handleNumber(button.dataset.num);
        } else if (button.dataset.op) {
            handleOperator(button.dataset.op);
        } else if (button.dataset.equals) {
            handleEquals();
        } else if (button.dataset.clear) {
            handleClear();
        }
    });
});

/
updateDisplay();

document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (/[0-9]/.test(key) || key === '.') {
        handleNumber(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
        handleOperator(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault(); 
        handleEquals();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        handleClear();
    } else if (key === 'Backspace') {
        currentInput = currentInput.slice(0, -1);
        updateDisplay();
    }
});
