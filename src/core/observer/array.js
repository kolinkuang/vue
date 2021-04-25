/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

// TODO 获取数组原型
const arrayProto = Array.prototype

// TODO 复制一份
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  // TODO 获取数组中的原始方法
  const original = arrayProto[method]
  // TODO 覆盖：给复制的原型定义新的方法（装饰器模式）
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    // TODO 变更通知逻辑：找到数组关联的 Ob，它内部有个 dep，dep 通知更新
    const ob = this.__ob__
    // TODO 如果有新增项
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    // TODO 新加入项也需要做响应式处理
    if (inserted) ob.observeArray(inserted)
    // notify change
    // TODO 变更通知
    ob.dep.notify()
    return result
  })
})
