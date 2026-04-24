# 山止川行

基于 uni-app H5 的个人博客前端原型。当前阶段聚焦前端体验：品牌化首页、文章筛选、阅读队列、订阅状态和文章详情页。

## 技术栈

- uni-app
- Vue 3
- Vite
- Sass

## 本地开发

```bash
npm install
npm run dev
```

默认访问地址：

```text
http://127.0.0.1:5173/
```

## 构建

```bash
npm run build
```

构建产物位于 `dist/build/h5`。

## 项目结构

- `src/pages/index/index.vue`：博客首页
- `src/pages/post/detail.vue`：文章详情页
- `src/data/posts.js`：文章 mock 数据
- `src/styles/tokens.scss`：设计 token
- `PRODUCT.md`：产品定位与品牌原则
- `DESIGN.md`：设计系统说明
- `ROADMAP.md`：后续开发路径

## 当前进度

- 首页文章主题筛选
- 首页进入文章详情
- 文章详情阅读版式
- 下一篇跳转
- 订阅输入的本地状态反馈

下一步见 `ROADMAP.md`。
