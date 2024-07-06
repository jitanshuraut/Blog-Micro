import express from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/account", proxy("http://localhost:8001"));
app.listen(8000, () => {
    console.log("Gateway is listening to Port 8000");
});
