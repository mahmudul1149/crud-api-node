const express = require("express");
const cors = require("cors");
const app = express();
const client = require("./connect-mogodb");

app.use(cors());
app.use(express.json());
app.get("/todo/all", async (req, res) => {
  try {
    await client.connect();
    const todos = await client
      .db("todos-collection")
      .collection("todos")
      .find({})
      .toArray();
    res.send({
      success: true,
      todos,
    });
  } catch (error) {
    console.error("Error in /todo/all:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
});

app.post("/todo", async (req, res) => {
  try {
    await client.connect();

    const maxIdTodo = await client
      .db("todos-collection")
      .collection("todos")
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();

    const maxId = maxIdTodo.length > 0 ? maxIdTodo[0].id : 0;

    const todo = req.body;
    todo.id = maxId + 1;

    await client.db("todos-collection").collection("todos").insertOne(todo);

    res.send({
      success: true,
      todo,
    });
  } catch (error) {
    console.error("Error in /todo:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
});

app.put("/todo/:id", async (req, res) => {
  try {
    await client.connect();

    const todo = req.body;
    const id = parseInt(req.params.id);

    const updated = await client
      .db("todos-collection")
      .collection("todos")
      .updateOne({ id }, { $set: todo });

    if (updated.modifiedCount === 0) {
      res.send({
        success: false,
        message: "Could not update todo",
      });
    } else {
      res.send({
        success: true,
        todo,
      });
    }
  } catch (error) {
    console.error("Error in /todo/:id:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
});

app.delete("/todo/:id", async (req, res) => {
  try {
    await client.connect();
    const todoIdToDelete = parseInt(req.params.id);

    const deleted = await client
      .db("todos-collection")
      .collection("todos")
      .deleteOne({ id: todoIdToDelete });

    if (deleted.deletedCount === 0) {
      res.status(404).send({
        success: false,
        message: "Todo not found",
      });
    } else {
      res.send({
        success: true,
        message: "Todo deleted successfully",
      });
    }
  } catch (error) {
    console.error("Error in /todo/:id (DELETE):", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  } finally {
    // Close the MongoDB connection to release resources
    await client.close();
  }
});

const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
