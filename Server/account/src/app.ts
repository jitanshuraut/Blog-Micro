import 'dotenv/config';
import express from 'express';
const app = express();
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes";
const port = process.env.PORT;

app.use(bodyParser.json());
app.use("/auth", authRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
