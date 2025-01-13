const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
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

const authenticatedUser = (username,password)=>{ //returns boolean
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in. No username or password provided" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 * 6 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // Extract isbn parameter from request URL
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.username; // Get the username from the session

    // Check if review text is provided
    if (!review) {
        return res.status(400).send("Review text is required.");
    }

    let book = books[isbn];  // Retrieve book object associated with isbn
    if (book) {  // Check if book exists
            // Ensure that book.reviews is an array
            if (!Array.isArray(book.reviews)) {
                book.reviews = [];  // Initialize reviews as an empty array if not already an array
            }
        
        let userReview = book.reviews.find((rev) => rev.reviewer === username);
        
        if (userReview) { // If user has already reviewed this book, update the review
            userReview.review = review;
            res.send(`Review updated for book with ISBN: ${isbn}`);
        } else { // If the user has not reviewed the book, add a new review
            book.reviews.push({"reviewer": username, "review": review });
            res.send(`New review added for book with ISBN: ${isbn}`);
        }

        books[isbn] = book;  // Update book details in 'books' object

    } else {
        // Respond if book with specified isbn is not found
        res.send("Unable to find book!");
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username; // Get the username from the session

    let book = books[isbn];  // Retrieve book object associated with ISBN
    if (book) {  // Check if book exists
        // Check if reviews is initialized and filter out the user's review
        if (book.reviews && Array.isArray(book.reviews)) {
            const initialLength = book.reviews.length;
            // Filter reviews to exclude the review by this username
            book.reviews = book.reviews.filter((rev) => rev.reviewer !== username);

            if (book.reviews.length < initialLength) {
                res.status(200).send(`Review has been deleted for book with ISBN: ${isbn}`);
            } else {
                res.status(404).send(`No review found for you on book with ISBN: ${isbn}`);
            }
        } else {
            res.status(404).send("No reviews found for this book.");
        }
    } else {
        // Respond if book with specified ISBN is not found
        res.status(404).send("Unable to find book!");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
