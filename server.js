const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

// Use the /tmp directory for storing files on Vercel
const filesPath = "/tmp/files";

// Set the views directory
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure the /tmp/files directory exists
if (!fs.existsSync(filesPath)) {
  fs.mkdirSync(filesPath);
}

// Home route to list files
app.get("/", (req, res) => {
  fs.readdir(filesPath, (err, files) => {
    if (err) {
      console.error("Error reading files directory:", err);
      res.status(500).send("Server Error");
      return;
    }
    res.render("files", { data: files });
  });
});

// Create a new file
app.post("/create", (req, res) => {
  const { name, message } = req.body;
  fs.writeFile(path.join(filesPath, `${name}.txt`), message, (err) => {
    if (err) {
      console.error("Error creating file:", err);
      res.status(500).send("Server Error");
      return;
    }
    res.redirect("/");
  });
});

// Form route
app.get("/form", (req, res) => {
  res.render("form");
});

// Delete a file
app.get("/delete/:name", (req, res) => {
  const name = req.params.name;
  fs.unlink(path.join(filesPath, name), (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      res.status(500).send("Server Error");
      return;
    }
    res.redirect("/");
  });
});

// Edit a file
app.get("/edit/:name", (req, res) => {
  const name = req.params.name;
  fs.readFile(path.join(filesPath, name), (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Server Error");
      return;
    }
    res.render("editForm", { name, message: data.toString() });
  });
});

// Fallback route
app.get("*", (req, res) => {
  res.send("This page is not available");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
