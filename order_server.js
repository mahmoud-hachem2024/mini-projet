const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
// Charger le fichier cart.proto
const orderProtoPath = 'order.proto';
const orderProtoDefinition = protoLoader.loadSync(orderProtoPath, {
keepCase: true,
longs: String,
enums: String,
defaults: true,
oneofs: true,
});
const orderProto = grpc.loadPackageDefinition(orderProtoDefinition).order;

let orders = [
  { id: 1, totalAmount: 15.6 },
  { id: 2, totalAmount: 10.5 },
  { id: 3, totalAmount: 50.5 },
  { id: 4, totalAmount: 30.5 },
  { id: 5, totalAmount: 88.5 },
  { id: 6, totalAmount: 95.5 }
]

const orderService = {
  getOrder: (call, callback) => {
    const order = orders.find(n => n.id == call.request.id);
    if (order) {
      callback(null, order);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found"
      });
    }
  },
    createOrder: (call, callback) => {
        const products = call.request.products;
        console.log('products', products);
        const totalAmount = products.reduce((accumulator ,item) => {
            return accumulator += Number(item.price);
          }, 0);
        const orderId = Math.floor(Math.random() * 10);
    
    
        callback(null, { id: orderId, totalAmount });
}
};
// Créer et démarrer le serveur gRPC
const server = new grpc.Server();
server.addService(orderProto.OrderService.service, orderService);
const port = 7000;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(),
(err, port) => {
if (err) {
console.error('server error', err);
return;
}
console.log(`Le serveur s'exécute sur le port ${port}`);
server.start();
6
});
console.log(`Microservice de commande en cours d'exécution sur le port ${port}`);