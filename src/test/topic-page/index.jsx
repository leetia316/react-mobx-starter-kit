import React, { Component } from 'react'
import { Card, ActivityIndicator } from 'antd-mobile'
import { paramParser, InnerHTML, ScrollView } from '@component'
import { observer } from '@store'
import { TopicStore } from './topic-store'
import './index.less'

@paramParser()
@observer
export default class TopicPage extends Component {
  props: {
    params: {
      id: string
    }
  }

  topicStore: TopicStore = TopicStore.findOrCreate(this.props.params.id)

  componentWillMount() {
    this.topicStore.fetchData()
  }

  renderHeader() {
    const { title, author, content } = this.topicStore
    return (
      <Card full className="topic-card">
        <Card.Header
          title={<span>{title}</span>}
          thumb={author.avatar_url}
        />
        <Card.Body>
          <InnerHTML html={content}/>
        </Card.Body>
      </Card>
    )
  }

  render() {
    return (
      <div className="topic-page">
        {
          this.topicStore.isFulfilled ? (
            <ScrollView
              onEndReached={this.topicStore.loadMore}
            >
              {this.renderHeader()}
              {
                this.topicStore.replies.map((rowData, index) => (
                  <Card full className="reply-card" key={rowData.id}>
                    <Card.Header
                      title={<span>{index + 1}楼•{rowData.create_at.split('T')[0]}</span>}
                      thumb={rowData.author.avatar_url}
                    />
                    <Card.Body>
                      <InnerHTML html={rowData.content}/>
                    </Card.Body>
                  </Card>
                ))
              }
            </ScrollView>
          ) : (
            <ActivityIndicator text="正在加载"/>
          )
        }
      </div>
    )
  }
}
