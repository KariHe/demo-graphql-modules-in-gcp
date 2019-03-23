import { UserProvider } from './provider';

export const resolvers = {
  Query: {
    async me(obj, args, {injector, user}) {
      const Users: UserProvider = injector.get(UserProvider);
      return await Users.get(user.id)
    }
  }
};
