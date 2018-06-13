import { WebAPIStore, IObservableArray, fetchAction, computed, observable } from '@store/helper'
import { CRequest } from '@utils'

const urls = ['https://cnodejs.org/api/v1/topics', { credentials: 'same-origin' }]

export class TopicsStore extends WebAPIStore {
  tab = this.instanceKey

  page = 1

  @observable data: IObservableArray<{
    id: string,
    title: string,
    last_reply_at: string,
    reply_count: string,
    visit_count: string,
    author: { avatar_url: string, loginname: string },
  }> = []

  @fetchAction.merge
  fetchData() {
    return CRequest.get(...urls).query({ page: this.page, limit: 10, tab: this.tab })
  }

  @fetchAction.flow
  async* fetchMoreData() {
    this.page++
    const res = yield CRequest.get(...urls).query({ page: this.page, limit: 10, tab: this.tab })
    this.data.push(...res.data.data)
  }

  @fetchAction.merge
  async reFetchData() {
    const res = await CRequest.get(...urls).query({ page: 1, limit: 10, tab: this.tab })
    this.page = 1
    return res
  }

  @computed
  get isComplete() {
    return this.isFulfilled && this.data.length >= 100
  }

  @computed
  get loadMore() {
    const { isComplete, isFulfilled, fetchMoreData } = this
    return !isComplete && isFulfilled ? fetchMoreData : null
  }
}
