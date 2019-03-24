import { Injectable, ProviderScope } from '@graphql-modules/di';
import { ApolloError } from 'apollo-server';
import uuid = require('uuid');
import { Datastore } from '@google-cloud/datastore';

export interface Review {
  id?: string;
  user: string;
  game: string;
  content: string;
  rating: number;
  updatedAt: string;
}

interface ReviewMap { 
  [key: string]: Review; 
}

@Injectable({
  scope: ProviderScope.Application
})
export class ReviewProvider {
  private static KIND = 'Reviews';
  private store = new Datastore();
  
  public async create(review: Review): Promise<Review> {
    const entity = {
      key: this.store.key([ReviewProvider.KIND]),
      data: review
    };
    await this.store.save(entity);

    review.id = entity.key.id as string;
    return review;
  }

  public async getAllFor(gameId: string): Promise<Review[]> {
    const query = this.store
      .createQuery([ReviewProvider.KIND])
      .filter('game', '=', gameId);

    const results = await this.store.runQuery(query);
    const reviews = results[0];

    reviews.forEach(game => {
      game.id = game[this.store.KEY].id;
    });

    return reviews;
  }
}
