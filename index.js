import dotenv from "dotenv";
import express from "express";
import errorsMiddleware from "./src/middleware/errorsMiddleware.js";
import usersRouter from "./src/routes/userRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.use("/", usersRouter);

app.use(errorsMiddleware);

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
