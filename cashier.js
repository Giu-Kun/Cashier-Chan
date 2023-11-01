const consoleTextArea = document.getElementById('console');
const inputElement = document.getElementById('input');

let quantities = []; // Initialize quantities array
let moneyInWallet = 0;
let products = []; // Initialize products array

function printToConsole(text) {
    consoleTextArea.value += text + '\n';
    consoleTextArea.scrollTop = consoleTextArea.scrollHeight;
}

// Fetch the JSON file with products
fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data.products;
        // Initialize quantities array based on the number of products
        quantities = new Array(products.length).fill(0);
    })
    .catch(error => {
        console.error('Error loading products.json:', error);
    });

// Fetch the JSON file with messages
fetch('messages.json')
    .then(response => response.json())
    .then(data => {
        messages = data;
        // Print the initial greeting
        printToConsole(messages.welcome);
    })
    .catch(error => {
        console.error('Error loading messages.json:', error);
    });

// Function to print product names, prices, and descriptions to the console
function printProducts() {
    printToConsole('Available Products:');
    for (const product of products) {
        printToConsole(`Name: ${product.name}`);
        printToConsole(`Price: ${product.price.toFixed(2)} Euro`);
        printToConsole(`Description: ${product.description}`);
        printToConsole(`Character: ${product.character}`);
        printToConsole('-------------------');
    }
}

// Function to handle the "stock" command
function handleStock() {
    let stockList = '';

    for (let i = 0; i < products.length; i++) {
        const productName = products[i].name;
        const quantityInStock = products[i].stock;
        stockList += `${productName}: ${quantityInStock}\n`;
    }

    if (stockList !== '') {
        const stockMessage = messages.stockMessage.replace('{stockList}', stockList);
        printToConsole(stockMessage);
    } else {
        printToConsole('No products available in stock.');
    }
}

function handleInput() {
    const input = inputElement.value.trim();
    printToConsole(`> ${input}`);

    if (input.toLowerCase() === 'exit') {
        printToConsole(messages.exitMessage);
        inputElement.disabled = true;
        return;
    }

    if (input.toLowerCase() === 'reset') {
        resetCashier();
        clearConsole(); // Clear the console
        printToConsole(messages.resetMessage);
        inputElement.value = '';
        return;
    }


    const commandParts = input.split(' ');
    const command = commandParts[0].toLowerCase();

    if (command === 'help') {
        if (commandParts.length === 1) {
            // Display general help message
            printToConsole(messages.helpMessage);
        } else if (commandParts.length === 2) {
            // Display detailed help for a specific command
            const helpCommand = commandParts[1].toLowerCase();
            switch (helpCommand) {
                case 'buy':
                    printToConsole(messages.helpBuyMessage);
                    break;
                case 'wallet':
                    printToConsole(messages.helpWalletMessage);
                    break;
                case 'checkout':
                    printToConsole(messages.helpCheckoutMessage);
                    break;
                case 'reset':
                    printToConsole(messages.helpResetMessage);
                    break;
                case 'exit':
                    printToConsole(messages.helpExitMessage);
                    break;
                case 'stock':
                    printToConsole(messages.helpStockMessage);
                    break;
                default:
                    printToConsole(`No detailed help available for command: ${helpCommand}`);
            }
        } else {
            printToConsole(messages.invalidHelpCommand);
        }
        inputElement.value = '';
        return;
    }



    switch (command) {
        case 'buy':
            if (commandParts.length < 3) {
                printToConsole(messages.invalidBuyCommand);
                break;
            }

            const product = commandParts.slice(1, -1).join(' '); // Join all parts except the last as the product name
            const quantity = parseInt(commandParts[commandParts.length - 1], 10);

            if (isNaN(quantity)) {
                printToConsole(messages.invalidQuantity);
                break;
            }

            const productIndex = products.findIndex(p => p.name.toLowerCase() === product.toLowerCase());

            if (productIndex === -1) {
                printToConsole(messages.productNotFound.replace('{product}', product));
                break;
            }

            quantities[productIndex] += quantity;
            printToConsole(messages.addedToCart.replace('{quantity}', quantity).replace('{product}', product));
            break;

        case 'stock':
            handleStock();
            break;

        case 'wallet':
            if (commandParts.length < 2) {
                printToConsole(messages.invalidWalletCommand);
                break;
            }

            const subcommand = commandParts[1].toLowerCase();

            switch (subcommand) {
                case 'add':
                    if (commandParts.length !== 3) {
                        printToConsole(messages.invalidAddCommand);
                        break;
                    }

                    const amountToAdd = parseFloat(commandParts[2]);

                    if (isNaN(amountToAdd)) {
                        printToConsole(messages.invalidAmount);
                        break;
                    }

                    moneyInWallet += amountToAdd;
                    printToConsole(messages.walletUpdated.replace('{action}', 'Added').replace('{amount}', amountToAdd.toFixed(2)));
                    break;

                case 'remove':
                    if (commandParts.length !== 3) {
                        printToConsole(messages.invalidRemoveCommand);
                        break;
                    }

                    const amountToRemove = parseFloat(commandParts[2]);

                    if (isNaN(amountToRemove)) {
                        printToConsole(messages.invalidAmount);
                        break;
                    }

                    if (amountToRemove > moneyInWallet) {
                        printToConsole(messages.insufficientBalance);
                        break;
                    }

                    moneyInWallet -= amountToRemove;
                    printToConsole(messages.walletUpdated.replace('{action}', 'Removed').replace('{amount}', amountToRemove.toFixed(2)));
                    break;

                case 'balance':
                    printToConsole(messages.currentBalance.replace('{balance}', moneyInWallet.toFixed(2)));
                    break;

                case 'help':
                    printToConsole(messages.walletHelpMessage);
                    break;

                default:
                    printToConsole(messages.invalidWalletSubcommand);
            }
            break;

        case 'checkout':
            const totalPrice = calculateTotalPrice();
            if (moneyInWallet >= totalPrice) {
                printToConsole(messages.cashReceiptHeader);
                printToConsole(messages.checkoutHeader);
                for (let i = 0; i < products.length; i++) {
                    if (quantities[i] > 0) {
                        const productName = products[i].name;
                        const quantity = quantities[i];
                        const price = products[i].price;
                        const productTotal = quantity * price;
                        printToConsole(`${quantity}x ${productName}: ${productTotal.toFixed(2)} Euro`);
                    }
                }
                printToConsole(messages.checkoutHeader);
                printToConsole(messages.checkoutTotalPrice.replace('{totalPrice}', totalPrice.toFixed(2)));
                const change = moneyInWallet - totalPrice;
                printToConsole(messages.checkoutChange.replace('{change}', change.toFixed(2)));
                resetCashier();
            } else {
                printToConsole(messages.notEnoughMoney);
            }
            break;


case 'product':
    if (commandParts.length < 2) {
        printToConsole(messages.invalidCommand);
        break;
    }

    const productSubcommand = commandParts[1].toLowerCase();

    switch (productSubcommand) {
        case 'list':
            printProductList();
            break;

        default:
            const productName = commandParts.slice(1).join(' ');
            getProductInfo(productName);
            break;
    }
    break;


        default:
            printToConsole(messages.invalidCommand);
    }

    inputElement.value = '';
}


function printProductList() {
    printToConsole('Product Prices:');
    for (const product of products) {
        printToConsole(`${product.name}: ${product.price.toFixed(2)} Enchanted Euro`);
    }
}

function getProductInfo(productName) {
    const productIndex = products.findIndex(p => p.name.toLowerCase() === productName.toLowerCase());

    if (productIndex === -1) {
        printToConsole(messages.productNotFound.replace('{product}', productName));
    } else {
        const product = products[productIndex];
        printToConsole(`Product: ${product.name}`);
        printToConsole(`Price: ${product.price.toFixed(2)} Enchanted Euro`);
        printToConsole(`Description: ${product.description}`);
    }
}


function calculateTotalPrice() {
    let totalPrice = 0;
    for (let i = 0; i < products.length; i++) {
        totalPrice += quantities[i] * products[i].price;
    }
    return totalPrice;
}

function resetCashier() {
    quantities = new Array(products.length).fill(0);
    moneyInWallet = 0;
    printToConsole(messages.resetMessage); // Send the welcome message after resetting
}

function clearConsole() {
    consoleTextArea.value = '';
}

// Function to handle the "Reset" button click
document.getElementById('reset-button').addEventListener('click', () => {
    resetCashier();
    clearConsole(); // Call the clearConsole function when the Reset button is clicked
});
const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', () => {
    clearConsole(); // Call the clearConsole function when the Reset button is clicked
});

inputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleInput();
    }
});
