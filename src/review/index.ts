import { GraphQLModule } from '@graphql-modules/core';
import { gql } from 'apollo-server';
import { importSchema } from 'graphql-import';

import UserModule from '../user';
import GameModule from '../game';
import { resolvers } from './resolvers';
import { ReviewProvider } from './provider';

export default new GraphQLModule({
  name: 'Games',
  imports: [
    UserModule,
    GameModule
  ],
  providers: [
    ReviewProvider
  ],
  typeDefs: gql(importSchema(__dirname + '/review.graphql')),
  resolvers: [ resolvers ]
});
