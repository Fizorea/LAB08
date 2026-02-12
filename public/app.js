async function loadBooks() {
  const res = await fetch("/books");
  const books = await res.json();
  renderBooks(books);
}

function renderBooks(books) {
  const el = document.getElementById("book-list");

  el.innerHTML = books.map(b => `
    <div>
      ${b.bookNo}. ${b.bookName}
      <button onclick="deleteBook(${b.bookNo})">Delete</button>
    </div>
  `).join("");
}

async function deleteBook(bookNo) {
  await fetch(`/books/delete/${bookNo}`, {
    method: "POST"
  });

  loadBooks();
}

async function search() {
  const keyword = document.getElementById("searchInput").value;
  const res = await fetch(`/books/search?q=${keyword}`);
  const books = await res.json();
  renderBooks(books);
}

window.addEventListener("DOMContentLoaded", loadBooks);
