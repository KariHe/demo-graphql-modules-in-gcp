import { GraphQLModule } from '@graphql-modules/core';
import { gql } from 'apollo-server';
import { importSchema } from 'graphql-import';
import admin from 'firebase-admin';

import { resolvers } from './resolvers';
import { UserProvider } from './provider';
import { Context } from 'koa';
import { AuthorizedFieldDirective } from './directives';

interface AuthSession {
  ctx: Context;
}

interface UserContext {
  user: { id: string } | null;
}

async function context(session: AuthSession): Promise<UserContext> {
  if(!session || !session.ctx) {
    return { user: null };
  }
  
  const req = session.ctx.req;
  if(!req.headers.authorization) {
    return { user: null };
  }

  try {
    const idToken = req.headers.authorization.replace(/^Bearer (.*)$/, '$1');
    const tokenData = await admin.auth().verifyIdToken(idToken);
    return {
      user: {
        id: tokenData.uid
      }
    };
  } catch ( err ) {
    console.info(err instanceof Error ? err.message: err);
    return { user: null };
  }
}

export default new GraphQLModule<any, AuthSession, UserContext>({
  name: 'User',
  typeDefs: gql(importSchema(__dirname + '/user.graphql')),
  resolvers: [ resolvers ],
  providers: [
    UserProvider
  ],
  schemaDirectives: {
    auth: AuthorizedFieldDirective
  },
  context
});
