/*
 * @Author: senze.fan
 * @Date: 2017-09-10 15:14:48
 * @desc: radio list
 */
import React, { Component } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  PixelRatio,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native'
import PropTypes from 'prop-types'
import Item from './item'

const borderWidth = 1 / PixelRatio.get()
const s = StyleSheet.create({
  cancelBtn: {
    height: 44,
    marginTop: 10,
    backgroundColor: '#fff',
    borderTopWidth: borderWidth,
    borderColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelText: {
    fontSize: 17,
    color: '#021D33'
  },
  flatList: {
    flex: 1
  }
})

export default class RadioList extends Component {
  static propTypes = {
    dataSource: PropTypes.array.isRequired, // data source, 数据源, 默认数组单元格式 { label: '', value: '' }
    labelName: PropTypes.string.isRequired, // 指定数据源每个数据单元对应的label的key名
    valName: PropTypes.string.isRequired, // 指定数据源每个数据单元对应的value的key名
    isRemoveWhileSelected: PropTypes.bool.isRequired, // 选中的单元是否从列表中删除，多选模式时无效
    numColumns: PropTypes.number, // 与 React-Native 原生组件 Flat 的 numColumns 相同
    btnContainerStyle: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
      PropTypes.number
    ]), // 按钮容器 自定义样式
    onSubmit: PropTypes.func.isRequired, // 提交触发的函数
    onCancel: PropTypes.func.isRequired, // 取消触发的函数
    showCancelBtn: PropTypes.bool.isRequired, // 是否显示取消按钮, 若已自定义渲染，则该项无效
    cancelBtn: PropTypes.element, // 自定义渲染取消按钮
    position: PropTypes.oneOf(['top', 'bottom']), // 选择框的定位, 默认: top
    checkedColor: PropTypes.string.isRequired, // 选中的颜字体颜色
    itemStyle: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
      PropTypes.number
    ]), // 每一个选项的样式
    listStyle: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
      PropTypes.number
    ]) // flatList的样式
  }

  shouldComponentUpdate (nextProps, nextState) {
    return false
  }

  /**
   * @desc 渲染列表
   */
  renderList = () => {
    const { dataSource, numColumns, labelName, valName, itemStyle, listStyle } = this.props
    // 计算行高
    const height = (Number.isFinite(itemStyle.height) ? itemStyle.height : 44) / numColumns - 5
    const checkedIndex = ~~(dataSource.findIndex(e => e.isChecked) / numColumns)
    const initialScrollIndex = checkedIndex > 2 ? checkedIndex - (checkedIndex >= dataSource.length - 2 ? 2 : 1) : 0
    return (
      <FlatList
        getItemLayout={(data, index) => ({ length: height, offset: height * index, index })}
        initialScrollIndex={initialScrollIndex}
        style={[s.flatList, listStyle]}
        data={dataSource}
        renderItem={this.renderItem}
        numColumns={numColumns}
        keyExtractor={(item, index) => item[labelName] + item[valName]}
      />
    )
  }

  /**
   * @desc 渲染列表单元
   */
  renderItem = ({ item }) => {
    const { labelName, valName, onSubmit, checkedColor, itemStyle } = this.props
    return (
      <Item
        labelName={labelName}
        valName={valName}
        onSubmit={onSubmit}
        checkedColor={checkedColor}
        itemStyle={itemStyle}
        dataSource={item}
      />
    )
  }

  /**
   * @desc 渲染取消按钮
   */
  renderCancelBtn = () => {
    const { showCancelBtn, cancelBtn, onCancel, btnContainerStyle } = this.props
    if (cancelBtn) return <TouchableOpacity onPress={onCancel}>{cancelBtn}</TouchableOpacity>
    if (!showCancelBtn) return null
    return (
      <TouchableHighlight
        underlayColor='#F7F7FA'
        style={[s.cancelBtn, btnContainerStyle]}
        onPress={onCancel}
        activeOpacity={0.7}
      >
        <Text style={s.cancelText} allowFontScaling={false}>取消</Text>
      </TouchableHighlight>
    )
  }

  render () {
    return (
      <View style={{ flex: 1 }}>
        {this.renderList()}
        {this.renderCancelBtn()}
      </View>
    )
  }
}
