import { Injectable, ProviderScope } from '@graphql-modules/di';
import { ApolloError } from 'apollo-server';
import uuid = require('uuid');

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
  private reviews: ReviewMap = {};

  public async create(review: Review): Promise<Review> {
    review.id = uuid();
    this.reviews[review.id] = review;
    return review;
  }

  public async getAllFor(gameId: string): Promise<Review[]> {
    return Object.values(this.reviews)
      .filter( review => review.game === gameId );
  }

  public async get(id): Promise<Review> {
    const review = this.reviews[id];
    if(!review) {
      throw new ApolloError('Not found');
    }

    return review;
  }

}
