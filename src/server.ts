import express from "express";
import path from "path";
import {
  readBooks,
  addBook,
  deleteBook,
  searchBooks
} from "./services/bookFileDb";

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

app.get("/books", (req, res) => {
  res.json(readBooks());
});

app.post("/books/add", (req, res) => {
  const { bookName } = req.body;

  if (!bookName || bookName.trim() === "") {
    return res.status(400).send("Book name is required");
  }

  addBook(bookName);
  res.redirect("/");
});

app.post("/books/delete/:bookNo", (req, res) => {
  const bookNo = parseInt(req.params.bookNo);

  deleteBook(bookNo);
  res.redirect("/");
});

app.get("/books/search", (req, res) => {
  const keyword = String(req.query.q || "");
  res.json(searchBooks(keyword));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
