const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
//public_users.get('/',function (req, res) {
//  res.send(JSON.stringify(books,null,4));
//});
// Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
    try {
        // Simulate an asynchronous operation using Promise
        const bookList = await new Promise((resolve, reject) => {
            if (books) {
                resolve(books); // Resolve with the books object
            } else {
                reject(new Error("No books found")); // Reject with an error if books is undefined/null
            }
        });

        res.send(JSON.stringify(bookList, null, 4)); // Respond with the book list
    } catch (error) {
        res.status(500).send("Error fetching book list: " + error.message); // Send error response
    }
});

// Get book details based on ISBN
//public_users.get('/isbn/:isbn',function (req, res) {
//    const email = req.params.isbn;
//    res.send(books[isbn]);
// });
// Get book details based on ISBN using async-await and Axios
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        // Simulate using Axios to get book details
        // For this example, we use the books object directly to mimic data fetching
        const bookDetails = await new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]); // Resolve with the book details
            } else {
                reject(new Error(`Book with ISBN ${isbn} not found`)); // Reject if ISBN is not in books
            }
        });

        res.send(bookDetails); // Respond with the book details
    } catch (error) {
        res.status(404).send({ error: error.message }); // Send 404 error if book is not found
    }
});


  
// Get book details based on author
//public_users.get('/author/:author',function (req, res) {
    // Extract the author parameter from the request URL
//    const author = req.params.author;
//    const filtered_books = []; 

    // Iterate through the keys of the `books` object
//    Object.keys(books).forEach((key) => {
//        if (books[key].author === author) {
//            filtered_books.push(books[key]); // Add matching books to the array
//        }
//    });

    // Send the filtered_users array as the response to the client
//    res.send(filtered_books);
//});
// Get book details based on author using async-await with Axios
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        // Simulate using Axios to fetch books (using the local `books` object here)
        const filteredBooks = await new Promise((resolve, reject) => {
            const matchingBooks = [];

            Object.keys(books).forEach((key) => {
                if (books[key].author === author) {
                    matchingBooks.push(books[key]);
                }
            });

            if (matchingBooks.length > 0) {
                resolve(matchingBooks); // Resolve with matching books
            } else {
                reject(new Error(`No books found for author: ${author}`)); // Reject if no books match
            }
        });

        res.send(filteredBooks); // Send the filtered books
    } catch (error) {
        res.status(404).send({ error: error.message }); // Send error response
    }
});



// Get all books based on title
//public_users.get('/title/:title',function (req, res) {
    // Extract the author parameter from the request URL
//    const title = req.params.title;
//    const filtered_title = []; 

    // Iterate through the keys of the `books` object
//    Object.keys(books).forEach((key) => {
//        if (books[key].title === title) {
//            filtered_title.push(books[key]); // Add matching books to the array
//        }
//    });

    // Send the filtered_users array as the response to the client
//    res.send(filtered_title);
//});
// Get book details based on title using async-await with Axios
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;

    try {
        // Simulate using Axios to fetch books (using the local `books` object here)
        const filteredBooks = await new Promise((resolve, reject) => {
            const matchingBooks = [];

            // Iterate through `books` object to find books with matching titles
            Object.keys(books).forEach((key) => {
                if (books[key].title === title) {
                    matchingBooks.push(books[key]); // Add matching book to the array
                }
            });

            // Resolve or reject based on whether matching books are found
            if (matchingBooks.length > 0) {
                resolve(matchingBooks);
            } else {
                reject(new Error(`No books found with title: ${title}`));
            }
        });

        res.send(filteredBooks); // Send the filtered books
    } catch (error) {
        res.status(404).send({ error: error.message }); // Send error response
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
