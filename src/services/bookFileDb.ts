import fs from "fs";
import path from "path";

export type Book = {
  bookNo: number;
  bookName: string;
};

type DbShape = { books: Book[] };

const dbPath = path.join(process.cwd(), "data", "books.json");

function readDb(): DbShape {
  if (!fs.existsSync(dbPath)) {
    const dir = path.dirname(dbPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const initialDb: DbShape = { books: [] };
    fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2), "utf-8");
    return initialDb;
  }

  const text = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(text);
}

function writeDb(db: DbShape) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
}

export function readBooks(): Book[] {
  return readDb().books;
}

export function addBook(bookName: string): Book {
  if (!bookName || bookName.trim() === "") {
    throw new Error("Book name is required");
  }

  const db = readDb();

  const maxId =
    db.books.length === 0
      ? 0
      : Math.max(...db.books.map(b => b.bookNo));

  const newBook: Book = {
    bookNo: maxId + 1,
    bookName
  };

  db.books.push(newBook);
  writeDb(db);

  return newBook;
}

export function deleteBook(bookNo: number): boolean {
  const db = readDb();
  const initialLength = db.books.length;

  db.books = db.books.filter(b => b.bookNo !== bookNo);

  writeDb(db);

  return db.books.length < initialLength;
}

export function searchBooks(keyword: string): Book[] {
  const db = readDb();
  return db.books.filter(b =>
    b.bookName.toLowerCase().includes(keyword.toLowerCase())
  );
}
