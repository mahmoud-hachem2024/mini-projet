const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
// Charger le fichier tvShow.proto
const productProtoPath = 'product.proto';
const productProtoDefinition = protoLoader.loadSync(productProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const productProto = grpc.loadPackageDefinition(productProtoDefinition).product;

let products = [
  { id: 1, name: 'Product 1', price: 10.5 },
  { id: 2, name: 'Product 2', price: 15 },
  { id: 3, name: 'Product 3', price: 14.5 },
  { id: 4, name: 'Product 4', price: 10.9 },
  { id: 5, name: 'Product 5', price: 12.3 },
  { id: 6, name: 'Product 6', price: 18.65 }
]

const productService = {
  allProducts: (call, callback) => {
    // Récupérer les détails de la série TV à partir de la base de données
    console.log('helloooo');
    callback(null, { products });
  },
  readProduct: (call, callback) => {
    const product = products.find(n => n.id == call.request.id);
    if (product) {
      callback(null, { product });
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found"
      });
    }
  },
  createProduct: (call, callback) => {
    const product = call.request;
    product.id = products.length + 1;
    products.push(product);
    callback(null, { products });
  },
  updateProduct: (call, callback) => {
    const existingProduct = products.find(n => n.id == call.request.id);
    if (existingProduct) {
      existingProduct.id = call.request.id;
      existingProduct.name = call.request.name;
      existingProduct.price = call.request.price;
      callback(null, { product: existingProduct });
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found"
      });
    }
  },
  deleteProduct: (call, callback) => {
    const existingProductIndex = products.findIndex((n) => n.id == call.request.id)
    if (existingProductIndex != -1) {
      products.splice(existingProductIndex, 1)
      callback(null, { products })
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Product not found"
      })
    }
  },
};
// Créer et démarrer le serveur gRPC
const server = new grpc.Server();
server.addService(productProto.Product.service, productService);
const port = 6000;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error('Échec de la liaison du serveur:', err);
      return;
    }
    console.log(`Le serveur s'exécute sur le port ${port}`);
    server.start();
    7
  });

  console.log(`Microservice de produit en cours d'exécution sur le port ${port}`);