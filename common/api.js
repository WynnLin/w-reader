import utils from './utils'
import moment from 'moment';
export default class api {
  constructor () {
    this.baseURL = `http://api.zhuishushenqi.com/`
    this.chapterURL = `http://chapter2.zhuishushenqi.com`
  }

  async ajax (url, method) {
    try {
      let response = await fetch(url, {
        method: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      let data = await response.json();
      return data;
    } catch (e) {
      console.log('error', {
        url: url,
        error: e
      })
    }
  }

  async get (url) {
    const data = await this.ajax(url, 'GET')
    return data
  }

  async autoComplete (value) {
    let data = await this.get(`${this.baseURL}book/auto-complete?query=${value}`)
    return data
  }

  async searchResult (params) {
    let data = await this.get(`${this.baseURL}book/fuzzy-search?${utils.formatQueryString(params)}`)
    data.books.map(item => {
      let cover = decodeURIComponent(item.cover)
      if (cover.indexOf('http') !== 0) {
        item.cover = cover.slice(cover.indexOf('http'))
      }
      if (item.latelyFollower > 10000) {
        item.latelyFollower = `${(item.latelyFollower / 10000).toFixed(2)}万`
      }
      return item
    })
    return data
  }

  async bookDetail (bookId) {
    let json = await this.get(`${this.baseURL}book/${bookId}`)
    let cover = decodeURIComponent(json.cover)
    json.cover = cover.indexOf('http') !== 0 ? cover.slice(cover.indexOf('http')) : cover
    json.latelyFollower = json.latelyFollower > 10000 ? `${(json.latelyFollower / 10000).toFixed(2)}万` : json.latelyFollower
    json.wordCount = json.wordCount > 10000 ? `${(json.wordCount / 10000).toFixed(2)}万` : json.wordCount
    let diff = moment().diff(moment(json.updated))
    json.updateTime = `${utils.formatTime(diff)} 前更新`
    return json
  }

  async getBookSource (bookId) {
    let data = await this.get(`${this.baseURL}toc?view=summary&book=${bookId}`)
    return data
  }

  async getChapters (sourceId) {
    let data = await this.get(`${this.baseURL}toc/${sourceId}?view=chapters`)
    return data
  }

  async bookContent (link) {
    let data = await this.get(`${this.chapterURL}chapter/${encodeURIComponent(link)}?k=2124b73d7e2e1945&t=1468223717`)
    return data
  }
}