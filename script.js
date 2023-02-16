'use strict';

// let myLibrary = [{name: 'The Hobbit', author: 'J.R.R. Tolkien', pages: '304'}, {name: 'Harry Potter', author: 'J.K. Rowling', pages: '336'}];

let newBook;
const displayBook = document.getElementById('card');
const addBook = document.getElementById('newBook');
const addBtn = document.querySelector('.formBtn');
const closeBtn = document.querySelector('.close');
const form = document.querySelector('form');
let isEditing = false

let myLibrary;

const request = indexedDB.open('library', 1);

request.onerror = function(event) {
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
  location.reload();
}
function updateBookInDatabase(book) {
  const transaction = myLibrary.transaction('books', 'readwrite');
  const objectStore = transaction.objectStore('books');
  const request = objectStore.put(book);
  request.onsuccess = function(event) {
    console.log('Book updated in the library');
  };
  request.onerror = function(event) {
    console.log('Error updating book in the library: ' + event.target.errorCode);
  };
  location.reload();
}
let currentId;
function addEditBtn(newDiv, id, book) {
  let editBtn = document.createElement('button');
  editBtn.innerHTML = 'Edit';
  editBtn.setAttribute('class', 'inBtn');
  newDiv.appendChild(editBtn);
  editBtn.addEventListener('click', function() {
    isEditing = true; 

    document.getElementById('title').value = book.name;
    document.getElementById('author').value = book.author;
    document.getElementById('pages').value = book.pages;
    id = book.id;
    currentId = id;
    
    document.querySelector('.openForm').style.display = 'block';
  });
}

function deleteBookFromLibrary(id) {
  const transaction = myLibrary.transaction('books', 'readwrite');
  const objectStore = transaction.objectStore('books');
  const request = objectStore.delete(Number(id));
  request.onsuccess = function() {
    console.log('Book deleted from database');
  };
  request.onerror = function() {
    console.error('Could not delete book from database');
  };
}

function addRemoveBtn(newDiv, id) {
  let removeBtn = document.createElement('div');
  let hidden = document.createElement("p");
  hidden.setAttribute('class', 'hiddenInfo2');
  removeBtn.innerHTML = '+';
  removeBtn.setAttribute('class', 'inBtn1');
  removeBtn.setAttribute('data-id', id);
  newDiv.appendChild(removeBtn);
  newDiv.appendChild(hidden);
  removeBtn.addEventListener('mouseenter', function() {
    hidden.innerText = 'Delete Book';
    hidden.style.display = 'block';
    setTimeout(() => {
      hidden.style.display = 'none';
    }, 5000);
  })
  removeBtn.addEventListener('mouseleave', function() {
    hidden.style.display = 'none';
  })
  removeBtn.addEventListener('click', function(e) {
    const id = e.target.getAttribute('data-id');
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
      addEditBtn(newDiv, books[i].id, books[i]);
      displayBook.appendChild(newDiv);
    }
  };
  request.onerror = function() {
    console.error('Could not list books from database');
  };
}

function display(book) {
  let newDiv = document.createElement("div");
  newDiv.setAttribute('class', 'bookDiv');
  newDiv.innerHTML = '<h3>' + book.name + '</h3>' + '<h5>' + book.author + '</h5>' + '<h6>' + book.pages + ' pages' + '</h6>';
  addRemoveBtn(newDiv, book.id);
  addReadBtn(newDiv, book);
  addEditBtn(newDiv, book.id, book);
  displayBook.appendChild(newDiv);
}



addBook.addEventListener('click', function openForm() {
  document.querySelector('.openForm').style.display = 'block';
})

addBtn.addEventListener('click', function closeForm(e) {
  e.preventDefault();
  if (!author.value) {
    author.setCustomValidity('Please fill in this field');
  } else {
    const bookData = {
      name: title.value,
      author: author.value,
      pages: pages.value,
    };
    if (isEditing) {
      deleteBookFromLibrary(currentId);
      updateBookInDatabase(bookData);
    } else {
      createBook(title.value, author.value, pages.value);
      addBookToLibrary(newBook);
    }
    form.reset();
    document.querySelector('.openForm').style.display = 'none';
    isEditing = false; // reset flag to false
  }
})
closeBtn.addEventListener('mousedown', function closeForm(e) {
  form.reset();
  document.querySelector('.openForm').style.display = 'none';
})

