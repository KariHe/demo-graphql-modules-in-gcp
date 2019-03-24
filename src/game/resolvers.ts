import uuid from 'uuid';
import { Game, GameProvider } from './provider';
import { UserProvider, User } from '../user/provider';

export const resolvers = {
  Game: {
    // Map creator user Id to user data
    async creator(obj, args, {injector}): Promise<User> {
      const Users: UserProvider = injector.get(UserProvider);
      return await Users.get(obj.creator);
    },

    // Map owners user Ids to user data
    async owners(obj, args, {injector}) {
      const Users: UserProvider = injector.get(UserProvider);
      return Promise.all( 
        obj.owners.map( id => Users.get(id) )
      );
    },

    // Resolve does user own the game
    async owned(obj, args, {user}) {
      if(!user) {
        return null;
      }

      for (const owner of obj.owners) {
        if(owner === user.id) {
          return true;
        }
      }

      return false;
    }
  },
  Query: {
    async getGame(obj, {gameId}, {injector}): Promise<Game> {
      const Games: GameProvider = injector.get(GameProvider);
      return await Games.get(gameId);
    },

    async listGames(obj, args, {injector}): Promise<Game[]> {
      const Games: GameProvider = injector.get(GameProvider);
      return await Games.list();
    }
  },
  Mutation: {
    async createGame(obj, {input}, {injector, user}): Promise<Game> {
      const Games: GameProvider = injector.get(GameProvider);

      const game: Game = {
        id: '',
        creator: user.id,
        name: input.name,
        description: input.description,
        updatedAt: new Date().toISOString(),
        owners: []
      };

      return await Games.set(game);
    },
    
    async addOwner(obj, {input}, {injector, user}): Promise<Game> {
      const Games: GameProvider = injector.get(GameProvider);
      const game: Game = await Games.get(input.gameId);

      if (input.owned) {
        if (!game.owners.includes(user.id)) {
          game.owners.push(user.id);
        }
      } else {
        game.owners = game.owners.filter( id => user.id !== id); 
      }
      return await Games.set(game);
    }
  }
};
