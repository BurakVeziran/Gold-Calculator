# Gold Calculator

This is a currency exchange application that fetches currency rates from an API and calculates exchange rates for different currencies. It provides a table displaying the prices in different currencies and calculates the total amount.

## Installation

To install and run the application locally, follow these steps:

1. Clone the repository:

   ```shell
   git clone https://github.com/BurakVeziran/Gold-Calculator.git
   ```

2. Edit the API Key:
    - Open the `main.js` file.
    - Locate the line 27.
    - Replace `YOUR_API_KEY` with your own API key obtained from the Fixer API (http://data.fixer.io/).


3. Edit the Gold List:
    - Open the `goldList.js.dist` file.
    - Edit the list of gold items by adding or removing objects as needed. Each object should have properties like `name`, `quantity`, and `gram`.
    - Save the file as `goldList.js`.


4. Open the `index.html` file again in your web browser to see the updated gold prices and total amounts.

## Usage

- Upon opening the application, the latest currency rates are fetched from the API using the provided API key.
- The header of the table displays the calculated exchange rates for USD, GAU, XAU, and EUR.
- The table shows the prices for different gold items in grams, along with the calculated prices in TRY and USD.
- The total amount in USD and TRY is displayed at the bottom of the table.

## Technologies Used

- JavaScript
- HTML
- CSS

## API Used

The application utilizes the Fixer API (http://data.fixer.io/) to fetch the latest currency rates. You will need to sign up for an API key and replace `YOUR_API_KEY` in the `main.js` file.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please create a new issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for more details.
