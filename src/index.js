const express = require('express');
const { nanoid } = require('nanoid');

const app = express();
const port = 9000;

// Middleware
app.use(express.json());

// Data buku
let books = [];

// Menyimpan buku
app.post('/books', (req, res) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.body;

  // Client tidak melampirkan properti name
  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
  }

  // Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
  if (readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }

  const id = nanoid(10);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  return res.status(201).json({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
});

// Menampilkan seluruh buku
app.get('/books', (req, res) => {
  const formattedBooks = books.map(({ id, name, publisher }) => ({
    id,
    name,
    publisher,
  }));

  return res.status(200).json({
    status: 'success',
    data: {
      books: formattedBooks,
    },
  });
});

// Menampilkan detail buku
app.get('/books/:bookId', (req, res) => {
  const { bookId } = req.params;

  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return res.status(404).json({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
  }

  return res.status(200).json({
    status: 'success',
    data: {
      book,
    },
  });
});

// Mengubah data buku
app.put('/books/:bookId', (req, res) => {
  const { bookId } = req.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.body;

  // Client tidak melampirkan properti name
  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
  }

  // Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
  if (readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }

  const bookIndex = books.findIndex((b) => b.id === bookId);

  // Id yang dilampirkan tidak ditemukan
  if (bookIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
  }

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  const updatedBook = {
    ...books[bookIndex],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    updatedAt,
  };

  books[bookIndex] = updatedBook;

  return res.status(200).json({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
});

// Menghapus buku
app.delete('/books/:bookId', (req, res) => {
  const { bookId } = req.params;

  const bookIndex = books.findIndex((b) => b.id === bookId);

  // Id yang dilampirkan tidak ditemukan
  if (bookIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
  }

  books.splice(bookIndex, 1);

  return res.status(200).json({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
