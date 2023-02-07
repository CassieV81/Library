'use strict';

let myLibrary = [{name: 'The Hobbit', author: 'J.R.R. Tolkien', pages: '304'}, {name: 'Harry Potter', author: 'J.K. Rowling', pages: '336'}];
let newBook;
const displayBook = document.getElementById('card');
const addBook = document.getElementById('newBook');
const addBtn = document.querySelector('.formBtn');
const closeBtn = document.querySelector('.close');
const form = document.querySelector('form');


function Book(name, author, pages) {
  this.name = name;
  this.author = author;
  this.pages = pages
}

function createBook(name, author, pages) {
  newBook = new Book(name, author, pages);
}

function addBookToLibrary(book) {
  myLibrary.push(book)
}

function addRemoveBtn(newDiv, index) {
  let removeBtn = document.createElement("button");
  removeBtn.innerText = "Remove";
  removeBtn.setAttribute('class', 'inBtn')
  newDiv.appendChild(removeBtn);
  removeBtn.addEventListener("click", function() {
    displayBook.removeChild(newDiv);
    myLibrary.splice(index, 1);
  });
}

function addReadBtn(newDiv) {
  let readBtn = document.createElement('button');
  let hidden = document.createElement("p");
  readBtn.innerText = 'Not read';
  readBtn.setAttribute('class', 'readBtn');
  hidden.setAttribute('class', 'hiddenInfo');
  newDiv.appendChild(readBtn);
  newDiv.appendChild(hidden);
  readBtn.addEventListener('mouseenter', function() {
    if (readBtn.innerText == 'Not read') {
      hidden.innerText = 'Mark as read';
      hidden.style.display = 'block';
    } else {
      hidden.innerText = 'Mark as not read';
      hidden.style.display = 'block';
    }
    setTimeout(() => {
      hidden.style.display = 'none';
    }, 3000);
  })
  readBtn.addEventListener('mouseleave', function() {
    hidden.style.display = 'none';
  })
  readBtn.addEventListener('click', function() {
    if (readBtn.innerText == 'Not read') {
      readBtn.innerHTML = 'Read &#10004';
    } else {
      readBtn.innerText = 'Not read';
    }
  })
}

function listBooks() {
  let listObjects = myLibrary;
  for (let i = 0; i < listObjects.length; i++) {
    let newDiv = document.createElement("div");
    newDiv.setAttribute('class', 'bookDiv')
    newDiv.innerHTML = '<h3>' + listObjects[i].name + '</h3>' + '<h5>' + listObjects[i].author + '</h5>' + '<h6>' + listObjects[i].pages + ' pages' + '</h6>';
    addRemoveBtn(newDiv, i);
    addReadBtn(newDiv);
    displayBook.appendChild(newDiv);
  }
}
listBooks();

function display() {
  let newDiv = document.createElement("div");
  newDiv.setAttribute('class', 'bookDiv');
  newDiv.innerHTML = '<h3>' + newBook.name + '</h3>' + '<h5>' + newBook.author + '</h5>' + '<h6>' + newBook.pages + ' pages' + '</h6>';
  addRemoveBtn(newDiv, myLibrary.length - 1);
  addReadBtn(newDiv);
  displayBook.appendChild(newDiv);
}


addBook.addEventListener('click', function openForm() {
  document.querySelector('.openForm').style.display = 'block';
})

addBtn.addEventListener('click', function closeForm(e) {
  if (!author.value) {
    author.setCustomValidity('Please fill in this field')
  } else {
    e.preventDefault();
    let title = document.getElementById('title');
    let author = document.getElementById('author');
    let pages = document.getElementById('pages');
    createBook(title.value, author.value, pages.value);
    addBookToLibrary(newBook);
    display();
    document.querySelector('.openForm').style.display = 'none';
    form.reset();
  }
})
closeBtn.addEventListener('mousedown', function closeForm(e) {
  document.querySelector('.openForm').style.display = 'none';
})