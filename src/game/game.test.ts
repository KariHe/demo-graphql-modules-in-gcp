import 'reflect-metadata';
import { gql } from 'apollo-server';
import { execute } from 'graphql';

import GameModule from './index';
import { UserProvider } from '../user/provider';
import { GameProvider } from './provider';

describe('Game module', () => {

  it('should return game by ID', async () => {
    const { schema, context, injector } = GameModule;

    // Set mock providers
    injector.provide({
      overwrite: true,
      provide: GameProvider,
      useValue: {
        get: id => Promise.resolve({id, name: 'mock', description: 'Mock content', creator: 3456 })
      } as unknown as GameProvider
    });

    injector.provide({
      overwrite: true,
      provide: UserProvider,
      useValue: {
        get: id => Promise.resolve({ id, name: 'test user' })
      } as unknown as UserProvider
    });


    // Execute query
    const result = await execute({
      schema,
      contextValue: context({}),
      document: gql`
        query($input: ID!) {
          getGame(gameId: $input) {
            id
            name
            description
            creator {
              name
            }
          }
        }
      `,
      variableValues: { input: '1234' }
    });

    // Verify response
    expect(result.errors).not.toBeDefined();
    expect(result.data.getGame).toBeDefined();
    expect(result.data.getGame.id).toEqual('1234');
    expect(result.data.getGame.name).toEqual('mock');
    expect(result.data.getGame.creator).toBeDefined();
    expect(result.data.getGame.creator.name).toEqual('test user');
  });
});
