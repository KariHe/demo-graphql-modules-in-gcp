import { Injectable, ProviderScope } from '@graphql-modules/di';
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { KeyValueCache, InMemoryLRUCache } from 'apollo-server-caching';
import admin from 'firebase-admin';
import Dataloader from 'dataloader';

export interface User {
  id: string;
  name: string;
}

@Injectable({
  scope: ProviderScope.Application
})

export class UserProvider extends DataSource {
  private static CACHE_TIME = 30 * 60; // 30 min storage time
  private cache!: KeyValueCache;
  private loader: Dataloader<string, User>;

  constructor() {
    super();
    this.loader = new Dataloader( ids => this.getByIds(ids) );
  }

  // Initialize cache from DataSourceConfig or use in memory cache
  public initialize(config: DataSourceConfig<{}>): void {
    this.cache = config.cache || new InMemoryLRUCache();
  }

  public async get(id): Promise<User> {
    return await this.loader.load(id);
  }

  private async getByIds(ids: string[]) {
    return await Promise.all( 
      ids.map( id => this.fetchOne(id) )
    );
  }

  private async fetchOne(id: string): Promise<User> {
    // Try cache first
    const json: string | undefined = await this.cache.get(id);
    if(json) {
      return JSON.parse(json) as User;
    }

    // Fetch user data from Firebase
    const userData = await admin.auth().getUser(id);
    const user = { id: userData.uid, name: userData.displayName || '' };

    // Store to cache
    this.cache.set(user.id, JSON.stringify(user), { ttl: UserProvider.CACHE_TIME });
    return user;
  }
}
