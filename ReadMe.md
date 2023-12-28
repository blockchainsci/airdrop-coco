此脚本用于 Core 链 coco 铭文的多地址空投
https://corescriptions.com/

使用说明

## 一、安装依赖
```
npm i
```

## 二、配置私钥和地址
参考 `assets/address.txt` 和 `assets/private.key` 文件

## 三、空投配置
参考 `main.js`文件
```javascript
/**
 * @description 空投数量区间
 * 1. [a,b] 表示在 [a,b]闭区间内随机一个数量进行空投
 * 2. a=b时则等价于空投固定数量
 */
const drop_cnt_per_address = [1, 3];

// 空投地址最大数量，超过了则不空投了
const address_max_count = 100;

// 总最大空投数量，超过了则不空投了
const max_drop_cnt = 10000;
```

## 四、执行脚本
```
node main.js
```

## 五、执行结果
执行结果保存在 `drop/时间` 目录下

![效果图]("./effect.jpg")
