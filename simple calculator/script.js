function appendToDisplay(value) {
    const display = document.getElementById("display");
    display.value += value;
}


function clearDisplay() {
    document.getElementById("display").value = "";
}

function deleteLastDigit() {
    const display = document.getElementById("display");
    const currentValue = display.value;

    display.value = currentValue.slice(0, -1);
}

function evaluateExpression() {
    const displayValue = document.getElementById("display").value;
    if (displayValue) {
        try {
        const result = evaluate(displayValue);
        document.getElementById("display").value = result;
        } catch (error) {
        document.getElementById("display").value = "Error";
        }
    }
}

function evaluate(expression) {
    const tokens = expression.match(/\d+\.?\d*|\+|\-|\*|\//g);

    if (!tokens) {
        throw "Invalid expression";
    }

    const precedence = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2,
    };

    const applyOperation = (num1, num2, operator) => {
        num1 = parseFloat(num1);
        num2 = parseFloat(num2);
        switch (operator) {
        case "+":
            return num1 + num2;
        case "-":
            return num1 - num2;
        case "*":
            return num1 * num2;
        case "/":
            if (num2 === 0) {
                throw "Division by zero";
            } else {
                return num1 / num2;
            }
        }
    };

    const output = [];
    const operators = [];

    for (let token of tokens) {
        if (!isNaN(token)) {
            output.push(token);
        } else {
            while ( operators.length > 0 && precedence[token] <= precedence[operators[operators.length - 1]] ) {
                const num2 = output.pop();
                const num1 = output.pop();
                const op = operators.pop();
                output.push(applyOperation(num1, num2, op));
            }
            operators.push(token);
        }
    }

    while (operators.length > 0) {
        const num2 = output.pop();
        const num1 = output.pop();
        const op = operators.pop();
        output.push(applyOperation(num1, num2, op));
    }

    return output[0];
}