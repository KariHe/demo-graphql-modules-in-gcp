import { Injectable, ProviderScope } from '@graphql-modules/di';

import { Datastore } from '@google-cloud/datastore';

export interface Game {
  id: string;
  creator: string;
  name: string;
  description?: string;
  updatedAt: string;
  owners: string[];
}

@Injectable({
  scope: ProviderScope.Application
})
export class GameProvider {
  private static KIND = 'Games';
  private store = new Datastore();

  public async set(game: Game): Promise<Game> {
    const key = game.id ? [GameProvider.KIND,  parseInt(game.id, 10)] : [GameProvider.KIND];
    const entity = {
      key: this.store.key(key),
      data: game
    };
    await this.store.save(entity);
    game.id = entity.key.id as string;
    
    return game;
  }

  public async get(id): Promise<Game> {
    const gameKey = this.store.key([GameProvider.KIND, Number(id)]);
    const results = await this.store.get(gameKey);

    if(results.length !== 1) {
        throw new RangeError('Not found');
    }

    const game = results[0];
    game.id = id;

    return game;
  }

  public async list(): Promise<Game[]> {
    const query = this.store.createQuery(GameProvider.KIND);
    const results = await this.store.runQuery(query);
    const games = results[0];

    if(!games) {
      return [];
    }

    games.forEach(game => {
        game.id = game[this.store.KEY].id;
    });

    return games;
  }
}
