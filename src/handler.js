const { nanoid } = require("nanoid");
const { loadNotesFile, saveNotesFile } = require("./notes");

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title,
    tags,
    body,
    id,
    createdAt,
    updatedAt,
  };

  // tambahkan data baru ke array notes
  const notes = loadNotesFile();
  notes.push(newNote);

  // ubah isi file notes.json
  saveNotesFile(notes);

  // cek apakah berhasil
  const isSuccess =
    [...loadNotesFile()].filter((note) => note.id === id).length > 0;

  // handle response
  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Catatan berhasil ditambahkan",
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Catatan gagal ditambahkan",
  });
  response.code(500);
  return response;
};

const getAllNotesHandler = (request, h) => {
  const notes = loadNotesFile();
  const response = h.response({
    status: "success",
    message: "Berhasil mendapatkan data catatan.",
    data: { notes },
  });
  response.code(200);
  return response;
};

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  // ambil data notes
  const notes = loadNotesFile();

  //   telurusi yg id nya sesuai request
  const note = notes.filter((note) => note.id === id)[0];

  // handle response
  if (note !== undefined) {
    const response = h.response({
      status: "success",
      message: "Catatan berhasil didapatkan.",
      data: {
        note,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Catatan tidak ditemukan.",
    data: null,
  });
  response.code(404);
  return response;
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const { title, tags, body } = request.payload;

  const updatedAt = new Date().toISOString();

  // ambil data notes.json
  const notes = loadNotesFile();

  // cari index data dengan id yang di request
  const index = notes.findIndex((note) => note.id === id);

  // handle response
  if (index !== -1) {
    // ubah isi data
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    // save ke dalam file notes.json
    saveNotesFile(notes);

    const response = h.response({
      status: "success",
      message: "Berhasil memperbarui data",
      data: {
        note: notes[index],
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui catatan. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  // ambil data notes.json
  const notes = loadNotesFile();

  // cari index data dengan id yang di request
  const index = notes.findIndex((note) => note.id === id);

  // jika index ditemukan
  if (index !== -1) {
    // remove isi array
    notes.splice(index, 1);

    // perbaui isi file notes.json
    saveNotesFile(notes);

    // response sukses
    const response = h.response({
      status: "success",
      message: "Berhasil memperbarui data",
    });
    response.code(200);
    return response;
  }

  // response gagal
  const response = h.response({
    status: "fail",
    message: "Gagal menghapus catatan. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
