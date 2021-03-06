import { Game, GameProvider } from './provider';
import { UserProvider, User } from '../user/provider';
import { PubSub } from 'apollo-server';

const pubsub = new PubSub();
const GAME_ADDED = 'GAME_ADDED';

export const resolvers = {
  Game: {
    // Map creator user Id to user data
    async creator(obj: Game, args: unknown, {injector}): Promise<User> {
      console.info('Game.creator', obj);
      const Users: UserProvider = injector.get(UserProvider);
      return await Users.get(obj.creator);
    },

    // Map owners user Ids to user data
    async owners(obj: Game, args: unknown, {injector}) {
      console.info('Game.owners', obj);
      const Users: UserProvider = injector.get(UserProvider);
      return Promise.all( 
        obj.owners.map( id => Users.get(id) )
      );
    },

    // Resolve does user own the game
    async owned(obj: Game, args: unknown, {user}) {
      console.info('Game.owned', obj);
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
      console.info('Query.getGame');
      const Games: GameProvider = injector.get(GameProvider);
      return await Games.get(gameId);
    },

    async listGames(obj, args, {injector}): Promise<Game[]> {
      console.info('Query.listGames');
      const Games: GameProvider = injector.get(GameProvider);
      return await Games.list();
    }
  },
  Mutation: {
    async createGame(obj, {input}, {injector, user}): Promise<Game> {
      console.info('Query.createGame', input);
      const Games: GameProvider = injector.get(GameProvider);

      const game: Game = {
        id: '',
        creator: user.id,
        name: input.name,
        description: input.description,
        updatedAt: new Date().toISOString(),
        owners: []
      };

      const result = await Games.set(game);
      pubsub.publish(GAME_ADDED, { addGame: result });
      
      return result;
    },
    
    async addOwner(obj: unknown, {input}, {injector, user}): Promise<Game> {
      console.info('Query.addOwner', input);
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
  },
  Subscription: {
    addGame: {
      subscribe: () => {
        console.info('Subscription.addGame');
        return pubsub.asyncIterator([GAME_ADDED]);
      }
    }
  }
};
