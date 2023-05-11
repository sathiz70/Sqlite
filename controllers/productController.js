const sqlite = require("../sqlite");
const productSchema = require("../validators/productValidator");
const updateProductSchema = require("../validators/updateProductValidator");

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { name, price, quantity, status } = req.body;

    const { error } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const result = await sqlite.run(
      "INSERT INTO products(name, price, quantity, status) VALUES (?, ?, ?, ?)",
      [name, price, quantity, status]
    );

    const product = {
      id: result.lastID,
      name,
      price,
      quantity,
      status,
    };

    res.status(201).json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await new Promise((resolve, reject) => {
      sqlite.all("SELECT * FROM products", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

async function getProductById(req, res) {
  const { id } = req.params;

  try {
    const product = await new Promise((resolve, reject) => {
      sqlite.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const { name, price, quantity, status } = req.body;

  const { error } = updateProductSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    await new Promise((resolve, reject) => {
      sqlite.run(
        "UPDATE products SET name = ?, price = ?, quantity = ?, status = ? WHERE id = ?",
        [name, price, quantity, status, id],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });

    const updatedProduct = { id, name, price, quantity, status };
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await new Promise((resolve, reject) => {
      sqlite.run("DELETE FROM products WHERE id = ?", [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
