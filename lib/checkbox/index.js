/*
 * @Author: senze.fan
 * @Date: 2017-09-10 15:14:57
 * @desc: checkbox list
 */
import React, { Component } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  PixelRatio,
  TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'
import NoSymbolItem from './item'
import SymbolItem from './item_symbol'

const borderWidth = 1 / PixelRatio.get()
const s = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  btnWrapper: {
    paddingTop: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    borderTopWidth: borderWidth,
    borderColor: '#eee'
  },
  btn: {
    height: 44,
    flex: 1,
    marginBottom: 15,
    backgroundColor: '#2296F3',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3
  },
  cancelBtn: {
    backgroundColor: '#fff',
    borderColor: '#021D33',
    borderWidth: borderWidth,
    marginLeft: 15
  },
  text: {
    fontSize: 17,
    color: '#fff'
  },
  flatList: {
    flex: 1
  },
  columnWrapperStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 7.5
  }
})

export default class CheckBoxList extends Component {
  static propTypes = {
    dataSource: PropTypes.array.isRequired, // data source, 数据源, 默认数组单元格式 { label: '', value: '' }
    labelName: PropTypes.string.isRequired, // 指定数据源每个数据单元对应的label的key名
    valName: PropTypes.string.isRequired, // 指定数据源每个数据单元对应的value的key名
    numColumns: PropTypes.number, // 与 React-Native 原生组件 Flat 的 numColumns 相同, 大与1时，每一个列表项icon不存在
    columnWrapperStyle: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
      PropTypes.number
    ]), // 与 React-Native 原生组件 Flat 的 columnWrapperStyle 相同
    btnContainerStyle: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
      PropTypes.number
    ]), // 按钮容器 自定义样式
    onSubmit: PropTypes.func.isRequired, // 提交触发的函数
    onCancel: PropTypes.func.isRequired, // 取消触发的函数
    submitBtn: PropTypes.element, // 自定义渲染提交按钮
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

  constructor (props) {
    super(props)
    this.state = {
      dataSource: this.props.dataSource.slice()
    }
  }

  /**
   * @desc 选中项目
   * @param  {Object} item
   */
  _checkedItem = (item) => {
    const { labelName, valName } = this.props
    this.setState({
      dataSource: this.state.dataSource.map(e => {
        return {
          [labelName]: e[labelName],
          [valName]: e[valName],
          isChecked: e[labelName] === item[labelName] && e[valName] === item[valName] ? !e.isChecked : e.isChecked
        }
      })
    })
  }

  /**
   * @desc 提交函数
   */
  _onSubmit = () => {
    const checkedItems = this.state.dataSource.filter(e => e.isChecked)
    this.props.onSubmit(checkedItems)
  }

  /**
   * @desc 渲染列表
   */
  renderList = () => {
    const { numColumns, labelName, valName, columnWrapperStyle, listStyle } = this.props
    const { dataSource } = this.state
    return (
      <FlatList
        style={[s.flatList, listStyle]}
        data={dataSource}
        renderItem={this.renderItem}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? [s.columnWrapperStyle, columnWrapperStyle] : void 0}
        keyExtractor={(item, index) => item[labelName] + item[valName]}
      />
    )
  }

  /**
   * @desc 渲染列表单元
   */
  renderItem = ({ item }) => {
    const { labelName, valName, checkedColor, itemStyle, numColumns } = this.props
    if (numColumns > 1) {
      return <NoSymbolItem
        labelName={labelName}
        valName={valName}
        checkedColor={checkedColor}
        itemStyle={itemStyle}
        checkedItem={this._checkedItem}
        dataSource={item}
      />
    }
    return <SymbolItem
      labelName={labelName}
      valName={valName}
      checkedColor={checkedColor}
      itemStyle={itemStyle}
      checkedItem={this._checkedItem}
      dataSource={item}
    />
  }

  /**
   * @desc 渲染取消按钮
   */
  renderCancelBtn = () => {
    const { showCancelBtn, cancelBtn, onCancel } = this.props
    if (cancelBtn) return <TouchableOpacity onPress={onCancel}>{cancelBtn}</TouchableOpacity>
    if (!showCancelBtn) return null
    return (
      <TouchableOpacity
        style={[s.btn, s.cancelBtn]}
        onPress={onCancel}
      >
        <Text style={[s.text, { color: '#021D33' }]} allowFontScaling={false}>取消</Text>
      </TouchableOpacity>
    )
  }
  /**
   * @desc 渲染提交按钮
   */
  renderSubmitBtn = () => {
    const { submitBtn } = this.props
    if (submitBtn) return <TouchableOpacity onPress={this._onSubmit}>{submitBtn}</TouchableOpacity>
    return (
      <TouchableOpacity
        style={s.btn}
        onPress={this._onSubmit}
        activeOpacity={0.7}
      >
        <Text style={s.text} allowFontScaling={false}>确认</Text>
      </TouchableOpacity>
    )
  }

  /**
   * @desc 渲染按钮模块
   */
  renderBtn = () => {
    return (
      <View style={[s.btnWrapper, this.props.btnContainerStyle]}>
        {this.renderSubmitBtn()}
        {this.renderCancelBtn()}
      </View>
    )
  }

  render () {
    return (
      <View style={s.container}>
        {this.renderList()}
        {this.renderBtn()}
      </View>
    )
  }
}
