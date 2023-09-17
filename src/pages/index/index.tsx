import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.less'
import { AtGrid } from 'taro-ui'
import Taro from '@tarojs/taro'

export default function Index() {
  useLoad(() => {
    // console.log('Page loaded.')
    Taro.navigateTo({ url: '/pages/random/index' })
  })

  return (
    <View className="index">
      <AtGrid
        data={[
          {
            image:
              'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
            value: '随机换号',
          },
          {
            image:
              'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
            value: '敬请期待',
          },
          {
            image:
              'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
            value: '敬请期待',
          },
          {
            image:
              'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
            value: '敬请期待',
          },
          {
            image:
              'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
            value: '敬请期待',
          },
          {
            image:
              'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
            value: '敬请期待',
          },
        ]}
      />
    </View>
  )
}
