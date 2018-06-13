import { observables, WebAPIStore, fetchAction, computed } from '@store/helper'
import { CRequest } from '@utils'

@observables({
  replies_count: 0,
}, {
  create_at: "",
  title: '',
  tab: '',
  content: '',
  good: false,
  top: false,
  last_reply_at: '',
  reply_count: 0,
  visit_count: 0,
  author: {
    avatar_url: '',
    loginname: '',
  },
  author_id: '',
  is_collect: false,
  replies: [],
})
export class TopicStore extends WebAPIStore {
  id = this.instanceKey

  @fetchAction.merge
  async fetchData() {
    const res = await CRequest.get(`https://cnodejs.org/api/v1/topic/${this.id}`, { credentials: 'same-origin' })
    const { replies, ...data } = res.data.data
    res.data = { ...data, replies: replies.slice(0, 10), replies_count: replies.length }
    return res
  }

  @fetchAction.flow
  async* fetchMoreData() {
    const res = yield CRequest.get(`https://cnodejs.org/api/v1/topic/${this.id}`, { credentials: 'same-origin' })
    const { replies } = res.data.data
    this.replies = replies.slice(0, this.replies.length + 10)
  }

  @computed
  get loadMore() {
    const { replies, replies_count, isFulfilled, fetchMoreData } = this
    return replies.length < replies_count && isFulfilled ? fetchMoreData : null
  }
}
