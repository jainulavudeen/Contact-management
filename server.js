require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Contact Management API is running", endpoints: "/contacts" });
});

app.use("/contacts", contactRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
