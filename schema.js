const { gql } = require('@apollo/server');
// Définir le schéma GraphQL
const typeDefs = `#graphql
type Product {
    id: ID!
    name: String!
    price: String!
  }
  input ProductInput {
    name: String!
    price: String!
  }
  
  type CartItem {
    productId: ID!
    quantity: Int!
  }
  
  type Cart {
    items: [CartItem]!
  }

  input ProductToAdd {
    id: ID!
    quantity: Int!
  }

  input ProductToDelete {
    id: ID!
  }

  input OrderInput {
    id: ID!
    name: String!
    price: String!
  }
  
  type Order {
    id: ID!
    totalAmount: Float!
  }
  
  type Query {
    readProduct(id: ID!): Product
    allProducts: [Product]
    getOrder(id: ID!): Order
  }
  
  type Mutation {
    deleteProduct(id: ID!): [Product]
    createProduct(input: ProductInput!): [Product]
    updateProduct(id: ID!, name: String!, price: String!): Product
    addProductToCart(input: ProductToAdd): String
    deleteProductFromCart(input: ProductToDelete): String
    createOrder(products: [OrderInput]!): Order
  }
`;
module.exports = typeDefs