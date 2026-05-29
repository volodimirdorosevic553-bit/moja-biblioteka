const SUPABASE_URL = "WSTAW_TUTAJ_SUPABASE_URL";
const SUPABASE_ANON_KEY = "WSTAW_TUTAJ_SUPABASE_ANON_KEY";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const bookForm = document.getElementById("bookForm");
const booksList = document.getElementById("booksList");
const bookDetails = document.getElementById("bookDetails");
const emptyMessage = document.getElementById("emptyMessage");
const bookCounter = document.getElementById("bookCounter");
const searchInput = document.getElementById("searchInput");
const genreFilter = document.getElementById("genreFilter");

let books = [];

loadBooks();

bookForm.addEventListener("submit", async function (event) {
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
    title: title,
    author: author,
    genre: genre,
    rating: Number(rating),
    description: description
  };

  const { error } = await supabaseClient
    .from("books")
    .insert([newBook]);

  if (error) {
    console.error(error);
    alert("Nie udało się dodać książki do bazy danych.");
    return;
  }

  bookForm.reset();
  await loadBooks();
});

searchInput.addEventListener("input", renderBooks);
genreFilter.addEventListener("change", renderBooks);

async function loadBooks() {
  const { data, error } = await supabaseClient
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    booksList.innerHTML = "";
    emptyMessage.style.display = "block";
    emptyMessage.textContent = "Nie udało się pobrać książek z bazy danych.";
    return;
  }

  books = data || [];
  renderBooks();
}

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
    emptyMessage.textContent = "Nie znaleziono książek.";
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

  const createdAt = selectedBook.created_at
    ? new Date(selectedBook.created_at).toLocaleDateString("pl-PL")
    : "brak daty";

  bookDetails.classList.remove("empty-details");

  bookDetails.innerHTML = `
    <h3>${selectedBook.title}</h3>
    <p class="details-author">Autor: ${selectedBook.author}</p>

    <div class="badges">
      <span class="badge">${selectedBook.genre}</span>
      <span class="badge rating">Ocena: ${selectedBook.rating}/5 ⭐</span>
    </div>

    <p><strong>Dodano:</strong> ${createdAt}</p>

    <p class="details-description">
      ${selectedBook.description}
    </p>
  `;
}

async function deleteBook(bookId) {
  const confirmDelete = confirm("Czy na pewno chcesz usunąć tę książkę?");

  if (!confirmDelete) {
    return;
  }

  const { error } = await supabaseClient
    .from("books")
    .delete()
    .eq("id", bookId);

  if (error) {
    console.error(error);
    alert("Nie udało się usunąć książki z bazy danych.");
    return;
  }

  await loadBooks();

  bookDetails.classList.add("empty-details");
  bookDetails.innerHTML = `
    <span class="details-icon">🔎</span>
    <p>Brak wybranej książki.</p>
  `;
}
