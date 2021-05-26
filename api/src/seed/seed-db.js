import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { getMutations } from './seed-mutations'

dotenv.config()

const {
  GRAPHQL_SERVER_HOST: host,
  GRAPHQL_SERVER_PORT: port,
  GRAPHQL_SERVER_PATH: path,
} = process.env

const uri = `http://${host}:${port}${path}`

const client = new ApolloClient({
  link: new HttpLink({ uri, fetch }),
  cache: new InMemoryCache(),
})

const runMutations = async () => {
  const mutations = getMutations()

  mutations.map(async ({ mutation, variables }) => {
    try {
      await client.mutate({ mutation, variables })
    } catch (error) {
      console.log('SEJA FELIZ')
      console.log(JSON.stringify(error, null, 2))
      throw new Error(error)
    }
  })
}

runMutations()
  .then(() => {
    console.log('Database seeded!')
  })
  .catch((e) => console.error(e))
