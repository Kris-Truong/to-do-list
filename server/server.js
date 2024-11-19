import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from 'cors';


const app = express();
const port = 4000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Magic761",
  port: 5432,
})

db.connect();

//This middleware looks at the body of incoming requests and, if it's in JSON format, it parses that data into a JavaScript object that you can access on req.body
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());

let items = [];

app.get("/", async (req, res)=> {
    try{
        const response = await db.query("SELECT * FROM items ORDER BY id ASC");
        items = response.rows;
        res.json(items);
    }
    catch (error) {
        console.error("Error: ", error.message);
        res.send(error);
    }
})

app.post("/add", async (req, res) => {
    try {
        console.log("Request body:", req.body);  // Log the request body to check if 'title' is present
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }
        const response = await db.query("INSERT INTO items (title) VALUES ($1) RETURNING *", [title]);
        const newItem = response.rows[0];
        res.json(newItem);
    } catch (error) {
        console.error("Error: ", error.message);
        res.status(500).send(error);
    }
});

app.patch("/edit/:id", async (req, res) => {
    const {id} = req.params;
    const editTitle = req.body.title;
    try {
        const response = await db.query("UPDATE items SET title = $1 WHERE id = $2 RETURNING *", [editTitle, id]);
        const result = response.rows[0];
        res.json(result);
    }catch (error) {
        console.error("Error: ", error.message);
        res.status(500).send(error);
    }
})

app.delete("/delete/:id", async (req, res) => {
    const {id} = req.params;
    try{
        const response = await db.query("DELETE FROM items WHERE id = $1 RETURNING *", [id]);
        if (response.rows.length > 0) {
        res.json("Item has been successfully deleted!");
        } else {
            res.status(404).json({ message: "Item not found" });
          }
    }
    catch (error) {
        console.error("Error: ", error.message);
        res.status(500).send(error);
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

export default app;