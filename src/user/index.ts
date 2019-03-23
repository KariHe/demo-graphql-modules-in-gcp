import { GraphQLModule } from '@graphql-modules/core';
import { gql } from 'apollo-server';
import { importSchema } from 'graphql-import';

import { resolvers } from './resolvers';
import { UserProvider } from './provider';

export default new GraphQLModule({
  name: 'Games',
  typeDefs: gql(importSchema(__dirname + '/user.graphql')),
  resolvers: [ resolvers ],
  providers: [
    UserProvider
  ],
  context() {
    return {
      user: {
        id: 'test'
      }
    }
  }
});
