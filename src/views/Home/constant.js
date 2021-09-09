/**
 * @enum 活动状态
 */
export const STATUS = {
  NotStarted: 0, // 未开始
  Processing: 1, // 进行中
  Over: 2 // 已结束
}

/**
 * @enum 事件
 */
export const NOTIFY_EVENT = {
  MakeEmoticon: 'makeEmoticon', // 制造表情
  InviteMakeEmoticon: 'inviteMakeEmoticon', // 邀请
  ViewFullVideo: 'viewFullVideo' // 完整观看视频
}

/**
 * 礼品区间
 */
export const GIFT_RANGE = [
  { range: [1, 5], name: 'iPhone11 pro' },
  { range: [6, 20], name: '洛斐键盘' },
  { range: [21, 50], name: '罗技G213' },
  { range: [51, 150], name: '罗技K375s' },
  { range: [151, 300], name: '罗技MK245' },
  { range: [301, 500], name: '罗技M280' },
  { range: [501, 700], name: 'KACO国风套' },
  { range: [701, 1000], name: '锐途钢笔' },
  { range: [1001, 2000], name: '7天会员卡' },
]
