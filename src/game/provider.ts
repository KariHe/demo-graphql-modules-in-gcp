import { Injectable, ProviderScope } from '@graphql-modules/di';
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { KeyValueCache, InMemoryLRUCache } from 'apollo-server-caching';
import { ApolloError } from 'apollo-server';

export interface Game {
  id: string;
  creator: string;
  name: string;
  description?: string;
  updatedAt: string
  owners: string[]
}

interface GamesMap { 
  [key: string]: Game; 
}

@Injectable({
  scope: ProviderScope.Application
})
export class GameProvider extends DataSource {
  private static CACHE_TIME = 30 * 60; // 30 min storage time
  private cache!: KeyValueCache;

  private games: GamesMap = {};

  constructor() {
    super();
  }

  public initialize(config: DataSourceConfig<{}>): void {
    this.cache = config.cache || new InMemoryLRUCache();
  }

  public async set(game: Game): Promise<Game> {
    this.games[game.id] = game;
    await this.cache.set(game.id, JSON.stringify(game));
    return game;
  }

  public async get(id): Promise<Game> {
    const json: string | undefined = await this.cache.get(id);
    if(json) {
      return JSON.parse(json) as Game;
    }
    
    const game = this.games[id];
    if(!game) {
      throw new ApolloError('Not found');
    }

    return game;
  }

  public async list(): Promise<Game[]> {
    return Object.values(this.games);
  }
}
