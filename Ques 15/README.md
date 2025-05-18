# Product Search & Filter

This project is a simple web application that allows users to search, filter, and sort products fetched from the [Fake Store API](https://fakestoreapi.com/). Users can search products by title, filter by category, and sort by price.

## Features

- **Live Search:** Filter products by typing in the search box.
- **Category Filter:** Select a category to view products from that category.
- **Sort by Price:** Sort products in ascending or descending order by price.
- **Product Count:** Displays the number of products currently shown.

## How It Works

- On page load, the app fetches all products and categories from the Fake Store API.
- The category dropdown is populated dynamically.
- As users interact with the search box, category dropdown, or sort dropdown, the product list updates in real-time.

## Files

- `index.html`: Main HTML structure.
- `styles.css`: Basic styling (not included here).
- `script.js`: JavaScript logic for fetching data and handling UI interactions.

## Usage

1. Clone or download the repository.
2. Ensure all files (`index.html`, `styles.css`, `script.js`) are in the same directory.
3. Open `index.html` in your browser.

## Example

![Screenshot of Product Search & Filter UI](screenshot.png)

## API Reference

- **Products:** `https://fakestoreapi.com/products`
- **Categories:** `https://fakestoreapi.com/products/categories`

