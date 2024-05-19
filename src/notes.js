const fs = require("fs");

const filepath = "./data/notes.json";

const loadNotesFile = () => {
  const data = fs.readFileSync(filepath, "utf-8");
  console.log(data);
  return JSON.parse(data);
};

const saveNotesFile = (data) => {
  fs.writeFileSync(filepath, JSON.stringify(data), "utf-8");
};

module.exports = { loadNotesFile, saveNotesFile };
