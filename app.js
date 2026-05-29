const bookForm = document.getElementById("bookForm");
const booksList = document.getElementById("booksList");
const bookDetails = document.getElementById("bookDetails");
const emptyMessage = document.getElementById("emptyMessage");
const bookCounter = document.getElementById("bookCounter");
const searchInput = document.getElementById("searchInput");
const genreFilter = document.getElementById("genreFilter");

let books = loadBooksFromStorage();

renderBooks();

bookForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const genre = document.getElementById("genre").value;
  const rating = document.getElementById("rating").value;
  const description = document.getElementById("description").value.trim();

  if (!title || !author || !genre || !rating || !description) {
    alert("Uzupełnij wszystkie pola formularza.");
    return;
  }

  const newBook = {
    id: Date.now(),
    title: title,
    author: author,
    genre: genre,
    rating: Number(rating),
    description: description,
    createdAt: new Date().toLocaleDateString("pl-PL")
  };

  books.unshift(newBook);
  saveBooksToStorage();
  renderBooks();
  bookForm.reset();
});

searchInput.addEventListener("input", renderBooks);
genreFilter.addEventListener("change", renderBooks);

function renderBooks() {
  booksList.innerHTML = "";

  const searchText = searchInput.value.toLowerCase();
  const selectedGenre = genreFilter.value;

  const filteredBooks = books.filter(function (book) {
    const matchesSearch =
      book.title.toLowerCase().includes(searchText) ||
      book.author.toLowerCase().includes(searchText);

    const matchesGenre =
      selectedGenre === "all" || book.genre === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  bookCounter.textContent = books.length;

  if (filteredBooks.length === 0) {
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";

  filteredBooks.forEach(function (book) {
    const bookCard = document.createElement("article");
    bookCard.classList.add("book-card");

    bookCard.innerHTML = `
      <div class="book-card-header">
        <div>
          <h3>${book.title}</h3>
          <p class="author">Autor: ${book.author}</p>
        </div>
      </div>

      <div class="badges">
        <span class="badge">${book.genre}</span>
        <span class="badge rating">Ocena: ${book.rating}/5 ⭐</span>
      </div>

      <div class="card-actions">
        <button class="secondary-button" onclick="showBookDetails(${book.id})">
          Szczegóły
        </button>

        <button class="danger-button" onclick="deleteBook(${book.id})">
          Usuń
        </button>
      </div>
    `;

    booksList.appendChild(bookCard);
  });
}

function showBookDetails(bookId) {
  const selectedBook = books.find(function (book) {
    return book.id === bookId;
  });

  if (!selectedBook) {
    return;
  }

  bookDetails.classList.remove("empty-details");

  bookDetails.innerHTML = `
    <h3>${selectedBook.title}</h3>
    <p class="details-author">Autor: ${selectedBook.author}</p>

    <div class="badges">
      <span class="badge">${selectedBook.genre}</span>
      <span class="badge rating">Ocena: ${selectedBook.rating}/5 ⭐</span>
    </div>

    <p><strong>Dodano:</strong> ${selectedBook.createdAt}</p>

    <p class="details-description">
      ${selectedBook.description}
    </p>
  `;
}

function deleteBook(bookId) {
  const confirmDelete = confirm("Czy na pewno chcesz usunąć tę książkę?");

  if (!confirmDelete) {
    return;
  }

  books = books.filter(function (book) {
    return book.id !== bookId;
  });

  saveBooksToStorage();
  renderBooks();

  bookDetails.classList.add("empty-details");
  bookDetails.innerHTML = `
    <span class="details-icon">🔎</span>
    <p>Brak wybranej książki.</p>
  `;
}

function saveBooksToStorage() {
  localStorage.setItem("books", JSON.stringify(books));
}

function loadBooksFromStorage() {
  const savedBooks = localStorage.getItem("books");

  if (savedBooks) {
    return JSON.parse(savedBooks);
  }

  return [
    {
      id: 1,
      title: "Lalka",
      author: "Bolesław Prus",
      genre: "Powieść",
      rating: 5,
      description:
        "Klasyczna polska powieść przedstawiająca historię Stanisława Wokulskiego, jego ambicji, pracy oraz nieszczęśliwej miłości.",
      createdAt: new Date().toLocaleDateString("pl-PL")
    },
    {
      id: 2,
      title: "Hobbit",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
      rating: 5,
      description:
        "Opowieść fantasy o wyprawie Bilba Bagginsa, krasnoludów i czarodzieja Gandalfa do Samotnej Góry.",
      createdAt: new Date().toLocaleDateString("pl-PL")
    }
  ];
}
