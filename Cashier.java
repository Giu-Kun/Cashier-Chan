import java.util.Scanner;

public class CashReceipt {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Greet the Customer as "Senpai" with program name "UwU Chan your Cashier Waifu"
        System.out.println("Welcome, Senpai, to UwU Chan your Cashier Waifu!");

        // Define variables

        // Product names
        String product1Name = "Apple";
        String product2Name = "Banana";
        String product3Name = "Orange";
        String product4Name = "Strawberry";

        // Set the quantity with "UwU Girl" style
        System.out.print("Senpai, how many " + product1Name + "s are you buying? UwU: ");
        int quantityProduct1 = scanner.nextInt();

        System.out.print("Senpai, how many " + product2Name + "s are you buying? UwU: ");
        int quantityProduct2 = scanner.nextInt();

        System.out.print("Senpai, how many " + product3Name + "s are you buying? UwU: ");
        int quantityProduct3 = scanner.nextInt();

        System.out.print("Senpai, how many " + product4Name + "s are you buying? UwU: ");
        int quantityProduct4 = scanner.nextInt();

        // Set prices
        double priceProduct1 = 1.99;
        double priceProduct2 = 2.49;
        double priceProduct3 = 1.79;
        double priceProduct4 = 3.29;

        // Ask for the amount of money in the wallet
        System.out.print("Senpai, how much money do you have in your wallet? UwU: ");
        double moneyInWallet = scanner.nextDouble();

        // Calculate the total price
        double totalPrice = (quantityProduct1 * priceProduct1) +
                            (quantityProduct2 * priceProduct2) +
                            (quantityProduct3 * priceProduct3) +
                            (quantityProduct4 * priceProduct4);

        // Do I have enough?
        if (moneyInWallet >= totalPrice) {

            // Print the cash receipt because you're rich and you have money... Well done :-)
            System.out.println("Cash Receipt:");
            System.out.println("-------------");

            // List the products
            System.out.println(quantityProduct1 + "x " + product1Name + ": " + (quantityProduct1 * priceProduct1) + " Euro");
            System.out.println(quantityProduct2 + "x " + product2Name + ": " + (quantityProduct2 * priceProduct2) + " Euro");
            System.out.println(quantityProduct3 + "x " + product3Name + ": " + (quantityProduct3 * priceProduct3) + " Euro");
            System.out.println(quantityProduct4 + "x " + product4Name + ": " + (quantityProduct4 * priceProduct4) + " Euro");

            // Print the total price
            System.out.println("-------------");
            System.out.println("Total Price: " + totalPrice + " Euro");

            // Calculate and print the change
            double change = moneyInWallet - totalPrice;
            System.out.println("Change: " + change + " Euro");
        } else {

            // If you're broke... lol
            System.out.println("Nyan~ Senpai, you don't have enough money in your wallet for this purchase. OwO");
        }

        // Close the scanner
        scanner.close();
    }
}
