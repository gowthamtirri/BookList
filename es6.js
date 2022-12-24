// USING  ES6  CLASES

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById("book-list");

    // Create table row
    const row = document.createElement("tr");

    // append hmtl to tr
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete" >X</a></td>
        `;

    // Append book to list
    list.appendChild(row);
  }
  // Alert
  showAlert(message, className) {
    // create div element
    const div = document.createElement("div");
    div.className = `alert ${className}`;

    // append alert message
    div.appendChild(document.createTextNode(message));
    // get parent
    const container = document.querySelector(".container");
    // get form from ui
    const form = document.getElementById("book-form");

    // insert in UI
    container.insertBefore(div, form);

    // Set Timeout for Alert
    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  removeBook(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
    this.showAlert("Book Removed", "remove");
  }
  clearInput() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }
}

// Local Storage class
class Store {
  static getBooks(book) {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function (book) {
      const ui = new UI();

      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static deleteBook(isbn) {
    const books = Store.getBooks();

    books.forEach(function (book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Dom load event
document.addEventListener("DOMContentLoaded", Store.displayBooks);

// event listeners
document.getElementById("book-form").addEventListener("submit", function (e) {
  // get form values
  const title = document.getElementById("title").value,
    author = document.getElementById("author").value,
    isbn = document.getElementById("isbn").value;

  // instantiate book
  const book = new Book(title, author, isbn);

  // instantiate UI
  const ui = new UI();

  //Validate
  if (title === "" || author === "" || isbn === "") {
    ui.showAlert("Please fill all details", "error");
  } else {
    //add book to list
    ui.addBookToList(book);

    // Add to local storage
    Store.addBook(book);

    // Sucess message
    ui.showAlert("Book Added", "sucess");

    // clear inputs after submit
    ui.clearInput();
  }

  e.preventDefault();
});

// Remove Book Event listener
document.getElementById("book-list").addEventListener("click", function (e) {
  // instantiate UI
  const ui = new UI();

  ui.removeBook(e.target);

  Store.deleteBook(e.target.parentElement.previousElementSibling.textContent);
});
