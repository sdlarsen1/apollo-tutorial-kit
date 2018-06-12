import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import schema from './data/schema';
import compression from 'compression';
import { ApolloEngine } from 'apollo-engine';

const GRAPHQL_PORT = 3000;

// This is a key that we've set up specifically for this tutorial.
// You can put your own key here if you sign up for a free account at
// engine.apollographql.com
const ENGINE_API_KEY = 'service:mdg-private-a-service:EB-LWSjPdZX0ph-Yyn2cxA';

// Apollo Engine configuration for caching and performance monitoring
const engine = new ApolloEngine({
  apiKey: ENGINE_API_KEY,
  stores: [
    {
      name: 'inMemEmbeddedCache',
      inMemory: {
        cacheSize: 20971520 // 20 MB
      }
    }
  ],
  queryCache: {
    publicFullQueryStore: 'inMemEmbeddedCache'
  },
});

const graphQLServer = express();

graphQLServer.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress({ schema, tracing: true, cacheControl: true })
);
graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

graphQLServer.use(compression());

engine.listen({
  port: GRAPHQL_PORT,
  expressApp: graphQLServer,
}, () =>
  console.log(
    `GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql`
  )
);
