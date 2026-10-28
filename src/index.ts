import dotenv from "dotenv";
import { crearApp } from "./app";

dotenv.config();

const port = process.env.PORT || 3000;
const app = crearApp();

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
