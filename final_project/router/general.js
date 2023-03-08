const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesexist = (username) =>{
    let username_existe = users.filter((user)=>{
        return user.username === username;
    });

    if(username_existe.length > 0){
        return true;
    }else{
        return false;
    }
}


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username && password){
        if(!doesexist(username)){
            users.push({"username":username,"password":password});
            return res.status(200).json({message:"User successfuly registered. Now you can login"});
        }else{
            return res.status(404).json({message:"User already exists!"})
        }
    }
    return res.status(404).json({message:"Unable to register user"})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let allbooks = new Promise((resolve, reject)=>{
        resolve(res.send(JSON.stringify(books,null,4)))
    })

//   return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;

    let books_by_isbn = new Promise((resolve,reject)=>{
        resolve(res.send(books[isbn]))
    })
    // res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    // let books_keys = Object.values(books);

    // let filtered_by_author = books_keys.filter((book)=> book.author === author)

    // res.send(filtered_by_author);

    let books_by_author = new Promise((resolve,reject)=>{
        let books_keys = Object.values(books);
        let filtered_by_author = books_keys.filter((book)=>book.author === author)
        resolve(res.send(filtered_by_author))
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    // let books_keys = Object.values(books);

    // let filtered_by_title = books_keys.filter((book)=>book.title === title);

    // res.send(filtered_by_title);

    let by_title = new Promise((resolve,reject)=>{
        let books_keys = Object.values(books);

        let filtered_by_title = books_keys.filter((book)=>book.title === title);
        
        resolve(res.send(filtered_by_title))
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;

    let book_keys = Object.values(books);

    res.send(book_keys[isbn].reviews);
});

module.exports.general = public_users;
