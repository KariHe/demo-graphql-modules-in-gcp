import { UserProvider, User } from '../user/provider';
import { ReviewProvider, Review } from './provider';
import { GameProvider, Game } from '../game/provider';
import { withFilter, PubSub } from 'apollo-server';

const pubsub = new PubSub();
const ADD_REVIEW = 'ADD_REVIEW';

export const resolvers = {
  Review: {
    async user(review: Review, args, {injector}): Promise<User> {
      const Users: UserProvider = injector.get(UserProvider);
      return await Users.get(review.user);
    },

    async game(review: Review, args, {injector}): Promise<Game> {
      const Games = injector.get(GameProvider);
      return Games.get(review.game);
    }
  },

  Game: {
    async reviews(game: Game, args, {injector}): Promise<Review[]> {
      const Reviews: ReviewProvider = injector.get(ReviewProvider);
      return await Reviews.getAllFor(game.id);
    }
  },

  Mutation: {
    async createReview(obj, {input}, {injector, user}): Promise<Review> {
      const Reviews: ReviewProvider = injector.get(ReviewProvider);
      const { gameId, content, rating } = input;
       const review =  await Reviews.create({
        game: gameId,
        content,
        rating,
        user: user.id,
        updatedAt: new Date().toISOString()
      });

      pubsub.publish(ADD_REVIEW, {addReview: review });
      return review;
    }
  },
  Subscription: {
    addReview: {
      subscribe: withFilter(
          () => pubsub.asyncIterator([ADD_REVIEW]),
          (payload, args) => {
            if(args.input) {
              // tslint:disable-next-line:triple-equals
              return payload.addReview.gameId == args.input;
            } else {
              return true;
            }
          }
        )
    }
  }
};
