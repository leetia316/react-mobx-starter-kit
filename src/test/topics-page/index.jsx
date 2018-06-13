import React, { Component } from 'react'
import { Tabs } from 'antd-mobile'
import TopicList from './topic-list'
import './index.less'

export default class HomePage extends Component {
  static initialPage = 'all'

  tabs = [
    { title: '全部', key: 'all' },
    { title: '精华', key: 'good' },
    { title: '分享', key: 'share' },
    { title: '问答', key: 'ask' },
    { title: '招聘', key: 'job' },
    { title: '测试', key: 'dev' },
  ]

  onChange = tab => {
    this.constructor.initialPage = tab.key
  }

  render() {
    return (
      <div className="topics-page">
        <Tabs
          tabs={this.tabs}
          prerenderingSiblingsNumber={0}
          swipeable={false}
          useOnPan={false}
          initialPage={this.constructor.initialPage}
          onChange={this.onChange}
        >
          {
            this.tabs.map(tab => <TopicList tab={tab.key} key={tab.key}/>)
          }
        </Tabs>
      </div>
    )
  }
}
