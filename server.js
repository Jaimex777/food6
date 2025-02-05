
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());

const productsFile = path.join(__dirname, 'products.json');

app.get('/api/products/:restaurant', (req, res) => {
    const restaurant = req.params.restaurant;
    fs.readFile(productsFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer los productos');
        const products = JSON.parse(data);
        res.json(products[restaurant] || []);
    });
});

app.post('/api/products/:restaurant', (req, res) => {
    const restaurant = req.params.restaurant;
    const newProduct = req.body;

    fs.readFile(productsFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer los productos');

        const products = JSON.parse(data);
        if (!products[restaurant]) products[restaurant] = [];
        products[restaurant].push(newProduct);

        fs.writeFile(productsFile, JSON.stringify(products, null, 2), (err) => {
            if (err) return res.status(500).send('Error al guardar el producto');
            res.send('Producto agregado correctamente');
        });
    });
});

app.delete('/api/products/:restaurant/:name', (req, res) => {
    const restaurant = req.params.restaurant;
    const name = req.params.name;

    fs.readFile(productsFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer los productos');

        const products = JSON.parse(data);
        products[restaurant] = products[restaurant].filter(product => product.name !== name);

        fs.writeFile(productsFile, JSON.stringify(products, null, 2), (err) => {
            if (err) return res.status(500).send('Error al guardar el producto');
            res.send('Producto eliminado correctamente');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
