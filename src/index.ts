import { GraphQLModule } from '@graphql-modules/core';
import { ApolloServer } from 'apollo-server-koa';

import UserModule from './user';
import GameModule from './game';
import ReviewModule from './review';

import admin from 'firebase-admin';
admin.initializeApp();

const { schema, context, subscriptions } =  new GraphQLModule({
  name: 'App',
  imports: [
    UserModule,
    GameModule,
    ReviewModule
  ]
});

export default new ApolloServer({
  schema,
  context,
  subscriptions,
  introspection: true,
  playground: true
});
