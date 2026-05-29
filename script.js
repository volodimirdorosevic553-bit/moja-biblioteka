import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  update,
  remove,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// WAŻNE: tutaj trzeba wkleić konfigurację z Firebase.
// Instrukcja jest w pliku README.md.
const firebaseConfig = {
  apiKey: "WKLEJ_TUTAJ_API_KEY",
  authDomain: "WKLEJ_TUTAJ_AUTH_DOMAIN",
  databaseURL: "WKLEJ_TUTAJ_DATABASE_URL",
  projectId: "WKLEJ_TUTAJ_PROJECT_ID",
  storageBucket: "WKLEJ_TUTAJ_STORAGE_BUCKET",
  messagingSenderId: "WKLEJ_TUTAJ_MESSAGING_SENDER_ID",
  appId: "WKLEJ_TUTAJ_APP_ID"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const booksRef = ref(database, "books");

const form = document.getElementById("book-form");
const bookIdInput = document.getElementById("book-id");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const yearInput = document.getElementById("year");
const genreInput = document.getElementById("genre");
const ratingInput = document.getElementById("rating");
const descriptionInput = document.getElementById("description");
const booksList = document.getElementById("books-list");
const statusBox = document.getElementById("status");
const searchInput = document.getElementById("search");
const formTitle = document.getElementById("form-title");
const submitButton = document.getElementById("submit-button");
const cancelEditButton = document.getElementById("cancel-edit");
const modal = document.getElementById("details-modal");
const closeModalButton = document.getElementById("close-modal");
const detailsContainer = document.getElementById("book-details");

let books = [];

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const book = {
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    year: yearInput.value.trim(),
    genre: genreInput.value.trim(),
    rating: ratingInput.value,
    description: descriptionInput.value.trim(),
    updatedAt: new Date().toISOString()
  };

  if (!book.title || !book.author || !book.description) {
    alert("Uzupełnij tytuł, autora i opis książki.");
    return;
  }

  try {
    const editingId = bookIdInput.value;

    if (editingId) {
      await update(ref(database, `books/${editingId}`), book);
    } else {
      const newBookRef = push(booksRef);
      await set(newBookRef, {
        ...book,
        createdAt: new Date().toISOString()
      });
    }

    resetForm();
  } catch (error) {
    console.error(error);
    alert("Nie udało się zapisać książki. Sprawdź konfigurację Firebase.");
  }
});

onValue(booksRef, (snapshot) => {
  const data = snapshot.val();

  books = data
    ? Object.entries(data).map(([id, book]) => ({ id, ...book }))
    : [];

  renderBooks();
}, (error) => {
  console.error(error);
  statusBox.textContent = "Błąd połączenia z bazą danych. Sprawdź konfigurację Firebase.";
});

searchInput.addEventListener("input", renderBooks);

cancelEditButton.addEventListener("click", resetForm);

closeModalButton.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

function renderBooks() {
  const searchText = searchInput.value.toLowerCase().trim();

  const filteredBooks = books.filter((book) => {
    const title = (book.title || "").toLowerCase();
    const author = (book.author || "").toLowerCase();
    return title.includes(searchText) || author.includes(searchText);
  });

  booksList.innerHTML = "";

  if (books.length === 0) {
    statusBox.classList.remove("hidden");
    statusBox.textContent = "Brak książek w bazie. Dodaj pierwszą książkę.";
    return;
  }

  if (filteredBooks.length === 0) {
    statusBox.classList.remove("hidden");
    statusBox.textContent = "Nie znaleziono książek pasujących do wyszukiwania.";
    return;
  }

  statusBox.classList.add("hidden");

  filteredBooks.forEach((book) => {
    const card = document.createElement("article");
    card.className = "book-card";

    card.innerHTML = `
      <div>
        <h3>${escapeHTML(book.title)}</h3>
        <div class="book-meta">
          <span><strong>Autor:</strong> ${escapeHTML(book.author)}</span>
          <span><strong>Gatunek:</strong> ${escapeHTML(book.genre || "brak")}</span>
          <span><strong>Ocena:</strong> ${book.rating ? `${escapeHTML(book.rating)} / 5` : "brak"}</span>
        </div>
      </div>
      <p class="book-description">${escapeHTML(shortenText(book.description, 120))}</p>
      <div class="card-actions">
        <button class="button details" data-action="details" data-id="${book.id}">Szczegóły</button>
        <button class="button secondary" data-action="edit" data-id="${book.id}">Edytuj</button>
        <button class="button danger" data-action="delete" data-id="${book.id}">Usuń</button>
      </div>
    `;

    booksList.appendChild(card);
  });

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", handleBookAction);
  });
}

function handleBookAction(event) {
  const action = event.currentTarget.dataset.action;
  const id = event.currentTarget.dataset.id;
  const book = books.find((item) => item.id === id);

  if (!book) return;

  if (action === "details") {
    showDetails(book);
  }

  if (action === "edit") {
    startEdit(book);
  }

  if (action === "delete") {
    deleteBook(book);
  }
}

function showDetails(book) {
  detailsContainer.innerHTML = `
    <p class="eyebrow">Szczegóły książki</p>
    <h2>${escapeHTML(book.title)}</h2>
    <div class="details-list">
      <div class="details-item"><strong>Autor:</strong> ${escapeHTML(book.author)}</div>
      <div class="details-item"><strong>Rok wydania:</strong> ${escapeHTML(book.year || "brak")}</div>
      <div class="details-item"><strong>Gatunek:</strong> ${escapeHTML(book.genre || "brak")}</div>
      <div class="details-item"><strong>Ocena:</strong> ${book.rating ? `${escapeHTML(book.rating)} / 5` : "brak"}</div>
      <div class="details-item"><strong>Opis:</strong><br>${escapeHTML(book.description)}</div>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

function startEdit(book) {
  bookIdInput.value = book.id;
  titleInput.value = book.title || "";
  authorInput.value = book.author || "";
  yearInput.value = book.year || "";
  genreInput.value = book.genre || "";
  ratingInput.value = book.rating || "";
  descriptionInput.value = book.description || "";

  formTitle.textContent = "Edytuj książkę";
  submitButton.textContent = "Zapisz zmiany";
  cancelEditButton.classList.remove("hidden");
  document.getElementById("form-section").scrollIntoView({ behavior: "smooth" });
}

async function deleteBook(book) {
  const confirmed = confirm(`Czy na pewno chcesz usunąć książkę „${book.title}”?`);

  if (!confirmed) return;

  try {
    await remove(ref(database, `books/${book.id}`));
  } catch (error) {
    console.error(error);
    alert("Nie udało się usunąć książki.");
  }
}

function resetForm() {
  form.reset();
  bookIdInput.value = "";
  formTitle.textContent = "Dodaj nową książkę";
  submitButton.textContent = "Zapisz książkę";
  cancelEditButton.classList.add("hidden");
}

function shortenText(text, limit) {
  if (!text) return "";
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
}

function escapeHTML(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
