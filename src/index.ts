import { GraphQLModule } from '@graphql-modules/core';
import { ApolloServer } from 'apollo-server-koa';

import GameModule from './game';
import ReviewModule from './review';

const { schema, context } =  new GraphQLModule({
  name: 'App',
  imports: [
    GameModule,
    ReviewModule
  ]
});

export default new ApolloServer({
  schema,
  context
});
