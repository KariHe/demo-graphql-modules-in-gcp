import { Injectable, ProviderScope } from '@graphql-modules/di';
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { KeyValueCache, InMemoryLRUCache } from 'apollo-server-caching';
import { ApolloError } from 'apollo-server';

import { Datastore } from '@google-cloud/datastore';

export interface Game {
  id: string;
  creator: string;
  name: string;
  description?: string;
  updatedAt: string;
  owners: string[];
}

interface GamesMap { 
  [key: string]: Game; 
}

@Injectable({
  scope: ProviderScope.Application
})
export class GameProvider extends DataSource {
  private static CACHE_TIME = 30 * 60; // 30 min storage time
  private static KIND = 'Games';

  private store = new Datastore();
  private cache!: KeyValueCache;

  constructor() {
    super();
  }

  public initialize(config: DataSourceConfig<{}>): void {
    this.cache = config.cache || new InMemoryLRUCache();
  }

  public async set(game: Game): Promise<Game> {
    const key = game.id ? [GameProvider.KIND,  parseInt(game.id, 10)] : [GameProvider.KIND];
    const entity = {
      key: this.store.key(key),
      data: game
    };
    await this.store.save(entity);
    game.id = entity.key.id as string;
    
    await this.cache.set(game.id, JSON.stringify(game), { ttl: GameProvider.CACHE_TIME });
    return game;
  }

  public async get(id): Promise<Game> {
    // Check from cache
    const json: string | undefined = await this.cache.get(id);
    if(json) {
      return JSON.parse(json) as Game;
    }

    // Fetch from datastore
    const gameKey = this.store.key([GameProvider.KIND, Number(id)]);
    const results = await this.store.get(gameKey);

    if(results.length !== 1) {
        throw new RangeError('Not found');
    }

    const game = results[0];
    game.id = id;

    // Store to cache
    await this.cache.set(game.id, JSON.stringify(game), { ttl: GameProvider.CACHE_TIME });

    return game;
  }

  public async list(): Promise<Game[]> {
    const query = this.store.createQuery(GameProvider.KIND);
    const results = await this.store.runQuery(query);
    const games = results[0];
    console.log(results);

    if(!games) {
      return [];
    }

    games.forEach(user => {
        user.id = user[this.store.KEY].id;
    });

    return games;
  }
}
