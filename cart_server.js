const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
// Charger le fichier cart.proto
const cartProtoPath = 'cart.proto';
const cartProtoDefinition = protoLoader.loadSync(cartProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const cartProto = grpc.loadPackageDefinition(cartProtoDefinition).cart;
const cartService = {
    addProductToCart: (call, callback) => {
        const product = call.request;
        console.log('product added to cart:', product);
        callback(null, { message: 'product added to cart successfully' });
    },
    deleteProductFromCart: (call, callback) => {
        const product = call.request;
        console.log('product sdeleted of cart:', product);
        callback(null, { message: 'product deleted from cart successfully' });
    },
};
// Créer et démarrer le serveur gRPC
const server = new grpc.Server();
server.addService(cartProto.CartService.service, cartService);
const port = 5000;
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
console.log(`Microservice de panier en cours d'exécution sur le port ${port}`);