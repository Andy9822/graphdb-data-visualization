const parse = require('csv-parse/lib/sync')
const { gql } = require('@apollo/client')
const fs = require('fs')
const path = require('path')
import { envs, devices, os } from './constants'

export const getMutations = () => {
  let mutations = []
  mutations = [...getArticlesMutations()]
  mutations = [...mutations, ...getClicksMutations()]
  mutations = [...mutations, ...getEnvironmentMutations()]
  mutations = [...mutations, ...getDevicesMutations()]
  mutations = [...mutations, ...getOSMutations()]
  return mutations
}

const getClicksMutations = () => {
  try {
    const filePath = path.resolve(__dirname, 'merged_cliks.csv')
    const data = fs.readFileSync(filePath, 'utf8')
    const clicks = parse(data, { columns: true })
    const mutations = generateInstancesMutations(clicks)
    return mutations
  } catch (err) {
    console.error(err)
  }
}

const getArticlesMutations = () => {
  try {
    const filePath = path.resolve(__dirname, 'articles_metadata.csv')
    const data = fs.readFileSync(filePath, 'utf8')
    const articles = parse(data, { columns: true })
    const mutations = generateMetadataMutations(articles)
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
          $click_article_id: ID!
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
              article: { connect: { where: { articleId: $click_article_id } } }
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

const generateMetadataMutations = (articles) => {
  return articles.map((article) => {
    article['words_count'] = parseInt(article['words_count'])
    console.log('article:', article)
    return {
      mutation: gql`
        mutation mergeReviews(
          $article_id: ID!
          $category_id: ID!
          $words_count: Int
        ) {
          article: mergeDetailedArticle(
            articleId: $article_id
            wordsCount: $words_count
          ) {
            articleId
          }

          category: mergeCategory(categoryId: $category_id) {
            categoryId
          }

          articleCategory: mergeArticleCategory(
            articleId: $article_id
            categoryId: $category_id
          ) {
            articleId
          }
        }
      `,
      variables: article,
    }
  })
}

const getEnvironmentMutations = () => {
  return envs.map(({ index, name }) => {
    return {
      mutation: gql`
        mutation updateEnvironment($index: ID!, $name: String) {
          environment: detailEnvironment(environmentId: $index, name: $name) {
            environmentId
            name
          }
        }
      `,
      variables: {
        index,
        name,
      },
    }
  })
}

const getDevicesMutations = () => {
  return devices.map(({ index, name }) => {
    return {
      mutation: gql`
        mutation updateDevice($index: ID!, $name: String) {
          device: detailDevice(deviceId: $index, name: $name) {
            deviceId
            name
          }
        }
      `,
      variables: {
        index,
        name,
      },
    }
  })
}

const getOSMutations = () => {
  return os.map(({ index, name }) => {
    return {
      mutation: gql`
        mutation updateOS($index: ID!, $name: String) {
          os: detailOS(osId: $index, name: $name) {
            osId
            name
          }
        }
      `,
      variables: {
        index,
        name,
      },
    }
  })
}
