import 'reflect-metadata';
import Koa from 'koa';
import cors from '@koa/cors';

import dotenv from 'dotenv';
dotenv.config();

import GraphQLApp from './src';

const port = process.env.PORT || 8080;
const app = new Koa();

app.proxy = true;
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error(err);
    // will only respond with JSON
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      message: err.message
    };
  }
});

app.use(cors({
  origin: '*'
}));

GraphQLApp.applyMiddleware({ app });

const server = app.listen({ port },  () => {
  console.log('Server listing on', `http://localhost:${port}/graphql`);
});

GraphQLApp.installSubscriptionHandlers(server);
