const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    let filtered_books_by_isbn = books[isbn];

    if(filtered_books_by_isbn){
        let reviews = req.body.reviews

        if(reviews){
            filtered_books_by_isbn["reviews"] = reviews
        }

        books[isbn] = filtered_books_by_isbn;
        res.send(`The review was added to ${books[isbn].title}`)
    }else{
        res.send("Unable to find that book!")
    }

});

regd_users.delete("/auth/review/:isbn",(req,res)=>{
    const isbn = req.params.isbn;

    if(isbn){
        delete books[isbn].reviews
    }

    res.send(`The reviews of ${books[isbn].title} has been deleted!.`)
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
