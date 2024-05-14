const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
// Charger les fichiers proto pour les films et les séries TV
const productProtoPath = 'product.proto';
const cartProtoPath = 'cart.proto';
const orderProtoPath = 'order.proto';

const resolvers = require('./resolvers');
const typeDefs = require('./schema');
// Créer une nouvelle application Express
const app = express();
app.use(express.json());
const productProtoDefinition = protoLoader.loadSync(productProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const cartProtoDefinition = protoLoader.loadSync(cartProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const orderProtoDefinition = protoLoader.loadSync(orderProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const productProto = grpc.loadPackageDefinition(productProtoDefinition).product;
const cartProto = grpc.loadPackageDefinition(cartProtoDefinition).cart;
const orderProto = grpc.loadPackageDefinition(orderProtoDefinition).order;

// Créer une instance ApolloServer avec le schéma et les résolveurs importés
const server = new ApolloServer({ typeDefs, resolvers });
// Appliquer le middleware ApolloServer à l'application Express
server.start().then(() => {
    app.use(
        cors(),
        bodyParser.urlencoded({ extended: true }),
        bodyParser.json(),
        expressMiddleware(server),
    )
})

app.get('/products', (req, res) => {
    const client = new productProto.Product('localhost:6000',
        grpc.credentials.createInsecure());
    client.allProducts({}, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.products);
        }
    });
});
app.get('/products/:id', (req, res) => {
    const client = new productProto.Product('localhost:6000',
        grpc.credentials.createInsecure());
    const id = req.params.id;
    console.log(id);
    client.readProduct({ id }, (err, response) => {
        console.log('response', response);
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.product);
        }
    });
});
app.post('/products', (req, res) => {
    const client = new productProto.Product('localhost:6000',
        grpc.credentials.createInsecure());
    client.createProduct({ name: req.body.name, price: req.body.price }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.products);
        }
    });
});
app.put('/products/:id', (req, res) => {
    const client = new productProto.Product('localhost:6000',
        grpc.credentials.createInsecure());
    const id = req.params.id;
    console.log(id);
    client.updateProduct({ id, name: req.body.name, price: req.body.price }, (err, response) => {
        console.log('response', response);
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.product);
        }
    });
});
app.delete('/products/:id', (req, res) => {
    const client = new productProto.Product('localhost:6000',
        grpc.credentials.createInsecure());
    const id = req.params.id;
    console.log(id);
    client.deleteProduct({ id }, (err, response) => {
        console.log('response', response);
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.products);
        }
    });
});
app.post('/cart/product', (req, res) => {
    const client = new cartProto.CartService('localhost:5000',
        grpc.credentials.createInsecure());
    client.addProductToCart({ id: req.body.id, quantity: req.body.quantity }, (err, response) => {
        console.log('messsage', response);
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.message);
        }
    });
});
app.delete('/cart/product', (req, res) => {
    const client = new cartProto.CartService('localhost:5000',
        grpc.credentials.createInsecure());
    client.deleteProductFromCart({ id: req.body.id }, (err, response) => {
        console.log('messsage', response);
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.message);
        }
    });
});
app.get('/order/:id', (req, res) => {
    const client = new orderProto.OrderService('localhost:7000',
        grpc.credentials.createInsecure());
    const id = req.params.id;
    console.log(id);
    client.getOrder({ id }, (err, response) => {
        console.log('response', response);
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response);
        }
    });
});
app.post('/order', (req, res) => {
    const client = new orderProto.OrderService('localhost:7000',
        grpc.credentials.createInsecure());
        console.log('req.body.products', req.body.products);
    client.createOrder({ products: req.body.products }, (err, response) => {
        console.log('messsage', response);
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response);
        }
    });
});

// Démarrer l'application Express
const port = 3000;
app.listen(port, () => {
    console.log(`API Gateway en cours d'exécution sur le port ${port}`);
});