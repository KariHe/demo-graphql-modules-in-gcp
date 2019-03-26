import 'reflect-metadata';
import Koa from 'koa';
import cors from '@koa/cors';

import dotenv from 'dotenv';
dotenv.config();

import GraphQLApp from './src';

const port = process.env.NODE_PORT || 3000;
const app = new Koa();

app.use(cors());

GraphQLApp.applyMiddleware({ app });

const server = app.listen({ port },  () => {
  console.log('Server listing on', `http://localhost:${port}/graphql`);
});

GraphQLApp.installSubscriptionHandlers(server);
