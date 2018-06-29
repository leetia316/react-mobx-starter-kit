import { computed, action } from 'mobx'
import type { IObservableArray } from 'mobx/lib/mobx.js.flow'
import { observables } from './observables'
import { WebAPIStore } from './web-api-store'
import fetchAction from './fetch-action'
import type { apiRes } from '@utils'

@observables({
  meta: {
    total: 0,
    page: 1,
    per_page: 10,
  },
  data: []
})
export class Collection extends WebAPIStore {
  meta: {
    total: number,
    page: number,
    per_page: number,
  }
  data: IObservableArray
  fetchApi: Object => apiRes
  params: Object = {}

  @fetchAction.merge
  fetchData() {
    return this.fetchApi({ page: 1, per_page: this.meta.per_page, ...this.params })
  }

  @fetchAction.flow
  async* fetchMoreData() {
    const res = yield this.fetchApi({
      page: this.meta.page + 1,
      per_page: this.meta.per_page,
      ...this.params,
    })
    const { meta, data } = res.data
    this.meta = meta
    this.data.push(...data)
  }

  @fetchAction.flow
  async* reFetchData() {
    const res = yield this.fetchApi({ page: 1, per_page: this.data.length || this.meta.per_page, ...this.params })
    this.data = res.data.data
  }

  @action.bound
  resetData() {
    this.isFulfilled = false
    this.data.clear()
  }

  findItemById(id: number) {
    return this.data.find(item => item.id === id)
  }

  @computed
  get isComplete() {
    return this.isFulfilled && this.data.length >= this.meta.total
  }

  @computed
  get loadMore() {
    const { isComplete, isFulfilled, fetchMoreData } = this
    return !isComplete && isFulfilled ? fetchMoreData : null
  }

  @computed
  get dataSource() {
    return this.data.slice()
  }
}
