import { SchemaDirectiveVisitor, AuthenticationError } from 'apollo-server';

export class AuthorizedFieldDirective extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field) {
    const originalResolve = field.resolve;

    field.resolve = (root, args, context, info) => {
      if (!context.user) {
        throw new AuthenticationError(`Unauthenticated!`);
      }
      return originalResolve(root, args, context, info);
    };
  }
}
