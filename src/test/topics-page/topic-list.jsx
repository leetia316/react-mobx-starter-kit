import React, { Component } from 'react'
import { Card, ActivityIndicator } from 'antd-mobile'
import { Link } from 'react-router-dom'
import { ScrollView } from '@component'
import { observer } from "@store"
import { TopicsStore } from "./topics-store"

@observer
export default class TopicList extends Component {
  props: {
    tab: string,
  }

  topicsStore: TopicsStore = TopicsStore.findOrCreate(this.props.tab)

  componentWillMount() {
    this.topicsStore.isFulfilled || this.topicsStore.fetchData()
  }

  render() {
    return this.topicsStore.isFulfilled ? (
      <ScrollView
        id={this.props.tab}
        onRefresh={this.topicsStore.fetchData}
        onEndReached={this.topicsStore.loadMore}
      >
        {
          this.topicsStore.data.map(rowData => (
            <Link to={`/topics/${rowData.id}`} key={rowData.id}>
              <Card full className="topic-card">
                <Card.Header
                  title={<span>{rowData.title}</span>}
                  thumb={rowData.author.avatar_url}
                />
                <Card.Footer
                  content={`${rowData.reply_count}条回复 / ${rowData.visit_count}次查看`}
                  extra={<div>{rowData.last_reply_at.split('T')[0]}</div>}
                />
              </Card>
            </Link>
          ))
        }
      </ScrollView>
    ) : (
      <ActivityIndicator text="正在加载"/>
    )
  }
}
