import { View, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.less'
import {
  AtButton,
  AtAvatar,
  AtIcon,
  AtDrawer,
  AtForm,
  AtInput,
  AtSwipeAction,
  AtRadio,
  AtFab,
  AtCheckbox,
  AtMessage,
  AtModal,
} from 'taro-ui'
import { useCallback, useRef, useState } from 'react'

export default function Index() {
  const [list, setList] = useState([]) //, {}, {}, {}, {}, {}, {}, {}, {}
  const [status, setStatus] = useState('add')
  const [resultList, setResultList] = useState([])
  const [visible, setVisible] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const [form, setForm] = useState({ name: '', role: '' })
  const count = useRef(0)
  const imgs = {
    sx: require('@/assets/sx.png'),
    sw: require('@/assets/sw.png'),
    sm: require('@/assets/sm.png'),
    ty: require('@/assets/ty.png'),
    xh: require('@/assets/xh.png'),
    jl: require('@/assets/jl.png'),
  }

  const roleMap = {
    sx: '神相',
    sw: '素问',
    sm: '碎梦',
    ty: '铁衣',
    xh: '血河',
    jl: '九灵',
  }

  const [checkboxOption, setCheckboxOption] = useState([])
  const [checkedList, setCheckedList] = useState([])
  const [isOpened, setIsOpened] = useState(false)

  const setListFilter = (_list) => {
    const tempList = []
    _list.forEach((item) => {
      if (list.every((item2) => item2.name !== item.name || item2.role !== item.role)) {
        tempList.push(item)
      }
    })
    setList([...list, ...tempList])
  }

  const handleAdd = useCallback(() => {
    setVisible(true)
  }, [])

  const handleClose = useCallback(() => {
    setForm({ name: '', role: '' })
    setVisible(false)
  }, [])

  const handleClose2 = useCallback(() => {
    setVisible2(false)
    setCheckedList([])
  }, [list, checkedList])

  const handleSubmit2 = useCallback(() => {
    const checkeds = checkedList.map((item) => checkboxOption[item])
    setListFilter([...list, ...checkeds])
    setVisible2(false)
    setCheckedList([])
  }, [list, checkedList, checkboxOption])

  const handleSubmit = useCallback(() => {
    if (!form.name) {
      Taro.atMessage({ message: '请输入姓名', type: 'error' })
      return
    }
    if (!form.role) {
      Taro.atMessage({ message: '请选择该账号对应职业', type: 'error' })
      return
    }
    // 历史换成不存在，加入缓存
    const historyList = Taro.getStorageSync('historyList') || []
    if (historyList.every((item) => item.name !== form.name || item.role !== form.role)) {
      Taro.setStorageSync('historyList', [...historyList, { ...form }])
    }
    setListFilter([...list, { ...form }])
    setIsOpened(true)
  }, [list, form])

  // flag: 是否不分配重复职业
  const handleRandom = useCallback(
    (flag) => {
      if (list.length === 0) {
        return
      }
      if (list.length === 1) {
        setStatus('result')
        setResultList(list)
        return
      }
      const temp = shuffle(list)
      count.current++
      if (count.current > 200) return
      if (flag) {
        if (temp.some((item, index) => item.name === list[index].name || item.role === list[index].role)) {
          // 100次没有找到答案视为不存在
          if (count.current < 100) {
            handleRandom(true)
          } else {
            handleRandom(false)
          }
        } else {
          count.current = 0
          setResultList(temp)
          setStatus('result')
        }
      } else {
        if (temp.some((item, index) => item.name === list[index].name)) {
          handleRandom(false)
        } else {
          count.current = 0
          setResultList(temp)
          setStatus('result')
        }
      }
    },
    [list],
  )

  const handleReAdd = useCallback(() => {
    setStatus('add')
    handleAdd()
  }, [])

  const handleShow = useCallback(() => {
    setVisible2(true)
    const historyList = Taro.getStorageSync('historyList') || []
    console.log('historyList', historyList)
    setCheckboxOption(
      historyList.map((item, index) => ({ ...item, label: item.name, desc: roleMap[item.role], value: index })),
    )
  }, [])

  const handleCancelModal = useCallback(() => {
    setIsOpened(false)
    setVisible(false)
  }, [])

  const handleConfirmModal = useCallback(() => {
    setIsOpened(false)
    setForm({ name: '', role: '' })
  }, [])

  const shuffle = (_list) => {
    const arr = [...list]
    let temp = []
    for (let i = arr.length; i > 0; i--) {
      let temRandom = Math.floor(Math.random() * i)
      temp.push(arr[temRandom])
      arr.splice(temRandom, 1) //抽取一张后，要除去这张牌，然后在剩下的牌中继续抽
    }
    return temp
  }

  return (
    <View className="page">
      <AtMessage />
      {status === 'add' && (
        <View className="AtFab-wrap">
          <AtFab onClick={handleShow}>
            <Text className="at-fab__icon at-icon">快</Text>
          </AtFab>
        </View>
      )}
      <AtDrawer width="80%" show={visible2} right mask onClose={handleClose2}>
        <View className="drawer-content">
          <View className="form">
            <View className="form-label">勾选要添加的账号</View>
            <AtCheckbox
              options={checkboxOption}
              selectedList={checkedList}
              onChange={(value) => setCheckedList(value)}
            />
          </View>
          <View className="form-btn-wrap">
            <AtButton className="btn" onClick={handleClose2}>
              关闭
            </AtButton>
            <AtButton className="btn" type="primary" onClick={handleSubmit2}>
              提交
            </AtButton>
          </View>
        </View>
      </AtDrawer>
      <AtDrawer width="80%" show={visible} right mask onClose={handleClose}>
        <View className="drawer-content">
          <AtForm className="form">
            <AtInput
              name="value"
              title="姓名"
              type="text"
              placeholder="请输入姓名"
              value={form.name}
              onChange={(value) => setForm({ ...form, name: value.toString() })}
            />
            <View className="form-label">请选择该账号对应职业</View>
            <AtRadio
              options={[
                { label: '素问', value: 'sw' },
                { label: '神相', value: 'sx' },
                { label: '碎梦', value: 'sm' },
                { label: '铁衣', value: 'ty' },
                { label: '九灵', value: 'jl' },
                { label: '血河', value: 'xh' },
              ]}
              value={form.role}
              onClick={(value) => setForm({ ...form, role: value.toString() })}
            />
          </AtForm>
          <View className="form-btn-wrap">
            <AtButton className="btn" onClick={handleClose}>
              关闭
            </AtButton>
            <AtButton className="btn" type="primary" onClick={handleSubmit}>
              提交
            </AtButton>
          </View>
        </View>
      </AtDrawer>
      <AtModal
        isOpened={isOpened}
        // title="标题"
        cancelText="取消"
        confirmText="确认"
        onClose={handleCancelModal}
        onCancel={handleCancelModal}
        onConfirm={handleConfirmModal}
        content="添加成功，是否继续添加"
      />
      <View className="content">
        {list.map((item, index) => {
          return (
            <AtSwipeAction
              disabled={status !== 'add'}
              onClick={(option, btnIndex) => {
                const index = option.index
                if (btnIndex === 0) {
                  // 删除
                  setList(list.filter((item, i) => i !== index))
                } else {
                  // 编辑
                  setForm({ name: list[index].name, role: list[index].role })
                  setVisible(true)
                }
              }}
              options={[
                {
                  index,
                  text: '删除',
                  className: 'action-btn',
                  style: {
                    backgroundColor: '#FF4949',
                  },
                },
                {
                  index,
                  text: '编辑',
                  className: 'action-btn',
                  style: {
                    backgroundColor: '#6190E8',
                  },
                },
              ]}
            >
              <View className="card">
                <View className="left">
                  <AtAvatar circle image={imgs[item.role]}></AtAvatar>
                  <Text>{item.name}</Text>
                </View>
                {status === 'result' && (
                  <>
                    <View className="arrow">
                      <AtIcon value="arrow-right" size="60" color="#4ed7c2"></AtIcon>
                    </View>
                    <View className="right">
                      <AtAvatar circle image={imgs[resultList[index].role]}></AtAvatar>
                      <Text>{resultList[index].name}</Text>
                    </View>
                  </>
                )}
              </View>
            </AtSwipeAction>
          )
        })}
      </View>
      <View className="footer">
        <AtButton className="btn" type="secondary" onClick={() => handleRandom(true)}>
          开始随机分配
        </AtButton>
        {status === 'add' && (
          <AtButton className="btn" type="primary" onClick={handleAdd}>
            新增
          </AtButton>
        )}
        {status === 'result' && (
          <AtButton className="btn" type="primary" onClick={handleReAdd}>
            继续新增
          </AtButton>
        )}
      </View>
    </View>
  )
}
