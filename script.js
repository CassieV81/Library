'use strict';

// let myLibrary = [{name: 'The Hobbit', author: 'J.R.R. Tolkien', pages: '304'}, {name: 'Harry Potter', author: 'J.K. Rowling', pages: '336'}];

let newBook;
const displayBook = document.getElementById('card');
const addBook = document.getElementById('newBook');
const addBtn = document.querySelector('.formBtn');
const closeBtn = document.querySelector('.close');
const form = document.querySelector('form');

let myLibrary;

function openLibrary() {
  const request = indexedDB.open('library', 1);

  request.oneerror = function(event) {
    console.log('Error opening library', event.target.error);
  };

  request.onsuccess = function (event) {
    myLibrary = event.target.result;
    console.log("Successfully opened the database.");
    listBooks();
  };

  request.onupgradeneeded = function (event) {
    myLibrary = event.target.result;
    const objectStore = myLibrary.createObjectStore('books', {keypath: 'id', autoIncrement: true});
    objectStore.createIndex('name', 'name', { unique: false });
    objectStore.createIndex('author', 'author', { unique: false });
    objectStore.createIndex('pages', 'pages', { unique: false });
  };

  request.onblocked = function(event) {
    console.log("The database is blocked by another tab or window.");
  };

}

openLibrary();

function Book(name, author, pages) {
  this.name = name;
  this.author = author;
  this.pages = pages
}

function createBook(name, author, pages) {
  newBook = new Book(name, author, pages);
}

function addBookToLibrary(book) {
  const transaction = myLibrary.transaction('books', 'readwrite');
  const objectStore = transaction.objectStore('books');
  const request = objectStore.add(book);
  request.onsuccess = function() {
    console.log('Book added to database');
  };
  request.onerror = function() {
    console.error('Could not add book to database');
  };
}
function deleteBookFromLibrary(id) {
  const transaction = myLibrary.transaction('books', 'readwrite');
  const objectStore = transaction.objectStore('books');
  const request = objectStore.delete(id);
  request.onsuccess = function() {
    console.log('Book deleted from database');
  };
  request.onerror = function() {
    console.error('Could not delete book from database');
  };
}

function addRemoveBtn(newDiv, id) {
  let removeBtn = document.createElement('button');
  removeBtn.innerText = 'Remove';
  removeBtn.setAttribute('class', 'inBtn');
  newDiv.appendChild(removeBtn);
  removeBtn.addEventListener('click', function() {
    displayBook.removeChild(newDiv);
    deleteBookFromLibrary(id);
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
  const transaction = myLibrary.transaction('books', 'readonly');
  const objectStore = transaction.objectStore('books');
  const request = objectStore.getAll();
  request.onsuccess = function() {
    const books = request.result;
    for (let i = 0; i < books.length; i++) {
      let newDiv = document.createElement('div');
      newDiv.setAttribute('class', 'bookDiv');
      newDiv.innerHTML = '<h3>' + books[i].name + '</h3>' + '<h5>' + books[i].author + '</h5>' + '<h6>' + books[i].pages + ' pages' + '</h6>';
      addRemoveBtn(newDiv, books[i].id);
      addReadBtn(newDiv, books[i]);
      displayBook.appendChild(newDiv);
    }
  };
  request.onerror = function() {
    console.error('Could not list books from database');
  };
}

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

