const parse = require('csv-parse/lib/sync')
const { gql } = require('@apollo/client')
const fs = require('fs')
const path = require('path')

export const getMutations = () => {
  let mutations = [...getSeedMutations()]
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
          $click_environment: ID!
          $click_os: ID!
          $click_country: ID!
          $click_deviceGroup: ID!
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
          os: mergeOS(osId: $click_os) {
            osId
          }
          country: mergeCountry(countryId: $click_country) {
            countryId
          }
          device: mergeDevice(deviceId: $click_deviceGroup) {
            deviceId
          }
          environment: mergeEnvironment(environmentId: $click_environment) {
            environmentId
          }
          sessionUsuario: mergeSessionUsuario(
            sessionId: $session_id
            userId: $user_id
          ) {
            userId
          }
          clicks: createClicks(
            input: {
              environment: {
                connect: { where: { environmentId: $click_environment } }
              }
              os: { connect: { where: { osId: $click_os } } }
              session: { connect: { where: { sessionId: $session_id } } }
              country: { connect: { where: { countryId: $click_country } } }
              device: { connect: { where: { deviceId: $click_deviceGroup } } }
            }
          ) {
            clicks {
              os {
                name
              }
            }
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
