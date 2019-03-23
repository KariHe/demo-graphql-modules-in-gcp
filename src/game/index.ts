import { GraphQLModule } from '@graphql-modules/core';
import { gql } from 'apollo-server';
import { importSchema } from 'graphql-import';

import UserModule from '../user';
import { resolvers } from './resolvers';
import { GameProvider } from './provider';

export default new GraphQLModule({
  name: 'Games',
  imports: [
    UserModule
  ],
  providers: [
    GameProvider
  ],
  typeDefs: gql(importSchema(__dirname + '/game.graphql')),
  resolvers: [ resolvers ]
});
