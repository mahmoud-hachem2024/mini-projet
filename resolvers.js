const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load gRPC protobufs
const productsProto = grpc.loadPackageDefinition(
  protoLoader.loadSync('product.proto')
).product;

const cartProto = grpc.loadPackageDefinition(
  protoLoader.loadSync('cart.proto')
).cart;

const orderProto = grpc.loadPackageDefinition(
  protoLoader.loadSync('order.proto')
).order;

// gRPC Clients
const productsClient = new productsProto.Product('localhost:6000', grpc.credentials.createInsecure());
const cartClient = new cartProto.CartService('localhost:5000', grpc.credentials.createInsecure());
const orderClient = new orderProto.OrderService('localhost:7000', grpc.credentials.createInsecure());

const resolvers = {
  Query: {
    allProducts: () => {
      const client = new productsProto.Product('localhost:6000',
        grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.allProducts({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.products);
          }
        });
      });
    },
    readProduct: async (_, { id }) => {
      return new Promise((resolve, reject) => {
        productsClient.readProduct({ id }, (err, response) => {
          if (err) reject(err);
          resolve(response.product);
        });
      });
    },
    getOrder: async (_, { id }) => {
      return new Promise((resolve, reject) => {
        orderClient.getOrder({ id }, (err, response) => {
          if (err) reject(err);
          resolve(response);
        });
      });
    },
  },
  Mutation: {
    createProduct: async (_, { name, price }) => {
      return new Promise((resolve, reject) => {
        productsClient.createProduct({ name, price }, (err, response) => {
          if (err) reject(err);
          resolve(response.products);
        });
      });
    },
    updateProduct: async (_, { id, name, price }) => {
      return new Promise((resolve, reject) => {
        productsClient.updateProduct({ id, name, price }, (err, response) => {
          if (err) reject(err);
          resolve(response.product);
        });
      });
    },
    deleteProduct: async (_, { id }) => {
      return new Promise((resolve, reject) => {
        productsClient.deleteProduct({ id }, (err, response) => {
          if (err) reject(err);
          resolve(response.products);
        });
      });
    },
    addProductToCart: async (_, { id, quantity }) => {
      return new Promise((resolve, reject) => {
        cartClient.addProductToCart({ id, quantity }, (err, response) => {
          if (err) reject(err);
          resolve(response.message);
        });
      });
    },
    deleteProductFromCart: async (_, { id }) => {
        return new Promise((resolve, reject) => {
          cartClient.deleteProductFromCart({ id }, (err, response) => {
            if (err) reject(err);
            resolve(response.message);
          });
        });
    },
    createOrder: async (_, {products}) => {
      return new Promise((resolve, reject) => {
        orderClient.createOrder({products}, (err, response) => {
          console.log('response', response);
          if (err) reject(err);
          resolve(response);
        });
      });
    },
  },
};

module.exports = resolvers;
