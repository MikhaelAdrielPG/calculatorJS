function appendToDisplay(value) {
    document.getElementById("display").value += value;
}

function clearDisplay() {
    document.getElementById("display").value = "";
}

function calculateResult() {
    let expression = document.getElementById("display").value;
    try {
        let result = evaluateExpression(expression);
        document.getElementById("display").value = result;
    } catch (error) {
        document.getElementById("display").value = "Error";
    }
}

function calculatePercentage() {
    let expression = document.getElementById("display").value;
    try {
        let result = evaluateExpression(expression + "*0.01");
        document.getElementById("display").value = result;
    } catch (error) {
        document.getElementById("display").value = "Error";
    }
}

function evaluateExpression(expression) {
    expression = expression.replace(/x/g, "*").replace(/÷/g, "/");
    expression = expression.replace(/(\d+(\.\d+)?)/g, function(match) {
        return parseFloat(match);
    });

    let outputQueue = [];
    const operators = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2
    };
    let operatorStack = [];

    for (let token of expression.match(/\d+(\.\d+)?|[-+*/()]/g) || []) {
        if (token.match(/\d+(\.\d+)?/)) {
            outputQueue.push(parseFloat(token));
        } else if (token === '(') {
            operatorStack.push(token);
        } else if (token === ')') {
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.pop();
        } else {
            while (
                operatorStack.length > 0 &&
                operators[operatorStack[operatorStack.length - 1]] >= operators[token]
            ) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(token);
        }
    }

    while (operatorStack.length > 0) {
        outputQueue.push(operatorStack.pop());
    }

    return evaluatePostfix(outputQueue);
}

function evaluatePostfix(postfix) {
    let stack = [];

    postfix.forEach(token => {
        if (typeof token === 'number') {
            stack.push(token);
        } else {
            let operand2 = stack.pop();
            let operand1 = stack.pop();

            switch (token) {
                case "+":
                    stack.push(operand1 + operand2);
                    break;
                case "-":
                    stack.push(operand1 - operand2);
                    break;
                case "*":
                    stack.push(operand1 * operand2);
                    break;
                case "/":
                    if (operand2 === 0) {
                        throw new Error("Division by zero");
                    }
                    stack.push(operand1 / operand2);
                    break;
                default:
                    throw new Error("Invalid operator");
            }
        }
    });

    return stack[0];
}

function deleteLastCharacter() {
    let display = document.getElementById("display");
    let currentValue = display.value;
    display.value = currentValue.slice(0, -1);
}