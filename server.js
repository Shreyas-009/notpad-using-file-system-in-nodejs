const express = require("express");
const app = express();
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    if (err) console.log(err);
    res.render("files", { data: files });
  });
});

app.post("/create", (req, res) => {
  const { name, message } = req.body;
  fs.writeFile(`./files/${name}.txt`, message, (err) => {
    if (err) console.log(err);
    else res.redirect("/");
  });
});

app.get("/form", (req, res) => {
  res.render("form");
});

app.get("/delete/:name", (req, res) => {
  const name = req.params.name;
  fs.unlink(`./files/${name}`, (err) => {
    if (err) console.log(err);
    else res.redirect("/");
  });
});

app.get("/edit/:name", (req, res) => {
  const name = req.params.name;
  fs.readFile(`./files/${name}`, (err, data) => {
    if (err) console.log(err);
    else res.render("editForm", { name, message: data.toString() });
  });
});

app.get("*", (req, res) => {
  res.send("This page is not availablee");
});

app.listen(3000);
