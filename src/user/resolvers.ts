import { UserProvider, User } from './provider';

export const resolvers = {
  Query: {
    async me(obj, args, {injector, user}): Promise<User> {
      const Users: UserProvider = injector.get(UserProvider);
      return await Users.get(user.id);
    }
  }
};
