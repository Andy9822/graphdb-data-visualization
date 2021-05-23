const parse = require('csv-parse/lib/sync')
const { gql } = require('@apollo/client')
const fs = require('fs')
const path = require('path')

export const getMutations = () => {
  let mutations = [...getSeedMutations(), getEnvironmentMutations()]
  return mutations
}

const getSeedMutations = () => {
  try {
    const filePath = path.resolve(__dirname, 'clicks_hour_000.csv')
    const data = fs.readFileSync(filePath, 'utf8')
    const clicks = parse(data, { columns: true })
    const mutations = generateInstancesMutations(clicks)
    return mutations
  } catch (err) {
    console.error(err)
  }
}

const generateInstancesMutations = (clicks) => {
  return clicks.map((click) => {
    return {
      mutation: gql`
        mutation mergeReviews(
          $user_id: ID!
          $session_id: ID!
          $session_start: String
        ) {
          usuario: mergeUsuario(userId: $user_id) {
            userId
          }
          session: mergeSession(
            sessionId: $session_id
            sessionStart: $session_start
          ) {
            sessionId
          }
          sessionUsuario: mergeSessionUsuario(
            sessionId: $session_id
            userId: $user_id
          ) {
            userId
          }
        }
      `,
      variables: click,
    }
  })
}

const getEnvironmentMutations = () => {
  return {
    mutation: gql`
      mutation mergeEnvironments($click_environment: ID!, $name: String) {
        environment: mergeEnvironment(
          environmentId: $click_environment
          name: $name
        ) {
          environmentId
          name
        }
      }
    `,
    variables: {
      click_environment: '4',
      name: 'Web',
    },
  }
}
