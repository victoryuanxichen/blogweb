<template>
  <view class="home">
    <view class="nav">
      <view class="brand">
        <text class="brand-mark">止</text>
        <text class="brand-name">山止川行</text>
      </view>
      <view class="nav-links">
        <button v-for="item in navItems" :key="item.target" @click="jumpTo(item.target)">
          {{ item.label }}
        </button>
      </view>
    </view>

    <view class="hero">
      <view class="hero-copy">
        <text class="kicker">Full-stack / AI / Product craft</text>
        <text class="headline">把全栈工程和人工智能，写成能落地的工作方法。</text>
        <text class="intro">这里记录 AI Agent、RAG、全栈架构、可观测性和产品体验，也留一点生活笔记。文章不追热点，更关注一个方案如何被设计、验证、维护和交付。</text>

        <view class="hero-actions">
          <button @click="jumpTo('articles')">读最新文章</button>
          <button @click="jumpTo('projects')">看项目方向</button>
        </view>

        <view class="filters" aria-label="文章主题筛选">
          <button
            v-for="topic in topics"
            :key="topic"
            class="filter"
            :class="{ active: activeTopic === topic }"
            @click="setTopic(topic)"
          >
            {{ topic }}
          </button>
        </view>
      </view>

      <view class="hero-media">
        <image
          class="desk-image"
          mode="aspectFill"
          src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1500&q=82"
          alt="打开的笔记本、咖啡和正在整理的写作桌面"
        />
        <view class="signal-stack">
          <button @click="selectTag('AI Agent')">
            <text>01</text>
            <text>Agent loop</text>
          </button>
          <button @click="selectTag('RAG')">
            <text>02</text>
            <text>RAG evidence</text>
          </button>
          <button @click="jumpTo('projects')">
            <text>03</text>
            <text>Full-stack cases</text>
          </button>
        </view>
        <view class="queue-panel">
          <text class="queue-label">正在读</text>
          <text class="queue-title">{{ selectedPost.title }}</text>
          <view class="progress-track">
            <view class="progress-fill" :style="{ width: selectedPost.progress + '%' }" />
          </view>
          <text class="queue-meta">{{ selectedPost.progress }}% · {{ selectedPost.minutes }} 分钟</text>
          <button class="queue-action" @click="openPost(selectedPost.id)">继续阅读</button>
        </view>
      </view>
    </view>

    <view id="articles" class="content-grid">
      <view class="article-section">
        <view class="section-heading">
          <text class="section-kicker">{{ activeTopic === '全部' ? '精选文章' : activeTopic }}</text>
          <text class="section-title">正在展开的工程与 AI 线索</text>
        </view>

        <view
          v-for="post in filteredPosts"
          :key="post.id"
          class="post-row"
          :class="{ selected: post.id === selectedPost.id }"
          role="button"
          tabindex="0"
          @click="openPost(post.id)"
        >
          <view class="post-date">
            <text>{{ post.month }}</text>
            <text>{{ post.day }}</text>
          </view>
          <view class="post-body">
            <view class="post-topline">
              <text>{{ post.topic }}</text>
              <text>{{ post.minutes }} 分钟</text>
            </view>
            <text class="post-title">{{ post.title }}</text>
            <text class="post-desc">{{ post.desc }}</text>
            <view class="post-tags">
              <text v-for="tag in post.tags" :key="tag">{{ tag }}</text>
            </view>
          </view>
          <view class="post-arrow">↗</view>
        </view>

        <view v-if="filteredPosts.length === 0" class="empty-state">
          <text class="empty-title">这个主题还没有文章</text>
          <text class="empty-copy">先回到全部文章，或者换一个更接近全栈与 AI 的标签。</text>
          <button @click="resetFilters">查看全部文章</button>
        </view>
      </view>

      <view class="aside">
        <view class="aside-block reading">
          <text class="aside-label">阅读队列</text>
          <button v-for="item in queue" :key="item" class="queue-item" @click="openQueueItem(item)">
            <text>{{ item }}</text>
          </button>
        </view>

        <view class="aside-block">
          <text class="aside-label">常写主题</text>
          <view class="tag-cloud">
            <button
              v-for="tag in tags"
              :key="tag"
              :class="{ active: activeTag === tag }"
              @click="selectTag(tag)"
            >
              {{ tag }}
            </button>
          </view>
          <button v-if="activeTag" class="clear-tag" @click="activeTag = ''">清除标签筛选</button>
        </view>

        <form class="subscribe" @submit.prevent="subscribe">
          <text class="aside-label">收信</text>
          <text class="subscribe-copy">{{ subscribed ? '已加入下一封更新。' : '每月一封，关于新文章和正在读的书。' }}</text>
          <view class="subscribe-row">
            <input v-model="email" type="email" placeholder="you@example.com" />
            <button form-type="submit">{{ subscribed ? '已订阅' : '订阅' }}</button>
          </view>
        </form>
      </view>
    </view>

    <view id="projects" class="showcase-section">
      <view class="section-heading">
        <text class="section-kicker">Projects</text>
        <text class="section-title">接下来会打磨的三个方向</text>
      </view>
      <view class="project-list">
        <view
          v-for="project in projects"
          :key="project.name"
          class="project-row"
          role="button"
          tabindex="0"
          @click="openProject(project.id)"
        >
          <text class="project-status">{{ project.status }}</text>
          <text class="project-name">{{ project.name }}</text>
          <text class="project-desc">{{ project.desc }}</text>
          <text class="project-arrow">查看详情</text>
        </view>
      </view>
    </view>

    <view class="lower-grid">
      <view id="books" class="books-panel">
        <text class="section-kicker">Reading</text>
        <text class="compact-title">书单和技术笔记</text>
        <button v-for="book in bookNotes" :key="book" class="book-item" @click="selectedBook = book">
          {{ book }}
        </button>
        <text class="inline-feedback">{{ selectedBook ? `已选中：${selectedBook}` : '点击书名，后续会进入对应读书笔记。' }}</text>
      </view>

      <view id="about" class="about-panel">
        <text class="section-kicker">About</text>
        <text class="compact-title">全栈开发者，AI 应用构建者</text>
        <text class="about-copy">我关注从需求到交付的完整链路：前端体验、服务端边界、数据库可靠性、AI 能力嵌入，以及让复杂系统被人理解的界面。</text>
        <view class="about-actions">
          <button @click="jumpTo('articles')">回到文章</button>
          <button @click="subscribeFromAbout">订阅更新</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { bookNotes, navItems, posts, projects, queue, tags, topics } from '../../data/posts'

const activeTopic = ref('全部')
const activeTag = ref('')
const selectedId = ref(1)
const email = ref('')
const subscribed = ref(false)
const selectedBook = ref('')

onLoad((query) => {
  if (query?.tag) {
    activeTag.value = decodeURIComponent(query.tag)
  }
})

const filteredPosts = computed(() => {
  return posts.filter((post) => {
    const matchesTopic = activeTopic.value === '全部' || post.topic === activeTopic.value
    const matchesTag = !activeTag.value || post.tags.includes(activeTag.value)
    return matchesTopic && matchesTag
  })
})

const selectedPost = computed(() => {
  return posts.find((post) => post.id === selectedId.value) || filteredPosts.value[0] || posts[0]
})

function subscribe() {
  if (!email.value.trim()) return
  subscribed.value = true
}

function setTopic(topic) {
  activeTopic.value = topic
  activeTag.value = ''
}

function openPost(id) {
  selectedId.value = id
  navigateTo(`/pages/post/detail?id=${id}`)
}

function jumpTo(target) {
  uni.pageScrollTo({
    selector: `#${target}`,
    duration: 260
  })
}

function selectTag(tag) {
  activeTag.value = tag
  activeTopic.value = '全部'
  jumpTo('articles')
}

function openQueueItem(title) {
  const found = posts.find((post) => post.title.includes(title) || title.includes(post.title.slice(0, 8)))
  openPost(found?.id || posts[0].id)
}

function openProject(id) {
  navigateTo(`/pages/project/detail?id=${id}`)
}

function subscribeFromAbout() {
  subscribed.value = true
  jumpTo('articles')
}

function resetFilters() {
  activeTopic.value = '全部'
  activeTag.value = ''
}

function navigateTo(url) {
  uni.navigateTo({
    url,
    fail: () => {
      if (typeof window !== 'undefined') {
        const targetHash = `#${url}`
        const targetUrl = `${window.location.origin}${window.location.pathname}${targetHash}`

        if (window.location.hash === targetHash) {
          window.location.reload()
          return
        }

        window.location.assign(targetUrl)
        return
      }

      uni.showToast({
        title: '页面暂时打不开',
        icon: 'none'
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.home {
  width: min(1180px, calc(100vw - 40px));
  margin: 0 auto;
  padding: clamp(24px, 4vw, 52px) 0 72px;
}

.nav,
.hero-copy,
.hero-media,
.content-grid,
.showcase-section,
.lower-grid {
  animation: rise-in 780ms var(--ease-out) both;
}

.hero-copy {
  animation-delay: 80ms;
}

.hero-media {
  animation-delay: 160ms;
}

.content-grid {
  animation-delay: 240ms;
}

.showcase-section {
  animation-delay: 320ms;
}

.lower-grid {
  animation-delay: 400ms;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: clamp(42px, 7vw, 86px);
}

.brand,
.nav-links,
.post-topline,
.subscribe-row,
.hero-actions,
.about-actions {
  display: flex;
  align-items: center;
}

.brand {
  gap: 12px;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 7px;
  background: var(--seal);
  color: oklch(96% 0.014 71);
  font-family: var(--font-display);
  font-size: 22px;
  box-shadow: 0 12px 24px oklch(53% 0.16 31 / 0.22);
}

.brand-name {
  font-family: var(--font-display);
  font-size: 22px;
  letter-spacing: 0;
}

.nav-links {
  gap: clamp(16px, 3vw, 34px);
  font-size: 15px;
}

.nav-links button {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--ink-muted);
  cursor: pointer;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(360px, 0.78fr);
  gap: clamp(36px, 6vw, 86px);
  align-items: end;
  min-height: 520px;
}

.hero-copy {
  padding-bottom: clamp(10px, 3vw, 38px);
}

.kicker,
.section-kicker,
.aside-label,
.post-topline {
  color: var(--seal);
  font-size: 13px;
  font-weight: 700;
}

.kicker {
  display: block;
  margin-bottom: 22px;
}

.headline {
  display: block;
  max-width: 760px;
  font-family: var(--font-display);
  font-size: clamp(46px, 8vw, 92px);
  line-height: 0.98;
  letter-spacing: 0;
}

.intro {
  display: block;
  max-width: 640px;
  margin-top: 28px;
  color: var(--ink-muted);
  font-size: clamp(16px, 2vw, 19px);
  line-height: 1.9;
}

.hero-actions {
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.hero-actions button,
.about-actions button {
  min-height: 42px;
  padding: 0 18px;
  border: 1px solid var(--ink);
  border-radius: 7px;
  background: var(--ink);
  color: var(--paper-soft);
  cursor: pointer;
  transition: transform 220ms var(--ease-out), background 220ms var(--ease-out), color 220ms var(--ease-out);
}

.hero-actions button:last-child,
.about-actions button:first-child {
  background: transparent;
  color: var(--ink);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 36px;
}

.filter,
.post-row,
.subscribe-row button,
.queue-action,
.queue-item,
.tag-cloud button,
.clear-tag,
.project-row,
.book-item {
  border: 0;
  cursor: pointer;
}

.filter {
  min-height: 38px;
  padding: 0 16px;
  border-radius: 999px;
  background: oklch(92% 0.023 88 / 0.75);
  color: var(--ink-muted);
  transition: background 220ms var(--ease-out), color 220ms var(--ease-out), transform 220ms var(--ease-out);
}

.filter.active {
  background: var(--mineral);
  color: oklch(96% 0.014 120);
  transform: translateY(-1px);
}

.hero-media {
  position: relative;
  min-height: 560px;
  transform-style: preserve-3d;
}

.desk-image {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  display: block;
  filter: saturate(0.88) contrast(1.04);
  box-shadow: var(--shadow);
  animation: paper-settle 900ms var(--ease-out) both;
}

.signal-stack {
  position: absolute;
  left: clamp(-28px, -3vw, -12px);
  top: 34px;
  display: grid;
  gap: 10px;
  width: min(260px, calc(100% - 38px));
}

.signal-stack button {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  min-height: 54px;
  padding: 0 16px;
  border: 1px solid oklch(72% 0.03 88);
  border-radius: 8px;
  background: oklch(94% 0.018 88 / 0.94);
  color: var(--ink);
  text-align: left;
  box-shadow: 0 14px 26px oklch(28% 0.03 95 / 0.1);
  cursor: pointer;
  animation: stagger-card 640ms var(--ease-out) both;
  transition: transform 260ms var(--ease-out), background 260ms var(--ease-out);
}

.signal-stack button:nth-child(2) {
  margin-left: 28px;
  animation-delay: 120ms;
}

.signal-stack button:nth-child(3) {
  margin-left: 56px;
  animation-delay: 220ms;
}

.signal-stack text:first-child {
  color: var(--seal);
  font-family: var(--font-display);
  font-size: 20px;
}

.signal-stack text:last-child {
  color: var(--ink-muted);
  font-size: 13px;
}

.queue-panel {
  position: absolute;
  right: clamp(14px, 3vw, 34px);
  bottom: 0;
  width: min(330px, calc(100% - 28px));
  padding: 22px;
  border: 1px solid oklch(78% 0.028 96);
  border-radius: 8px;
  background: oklch(93% 0.02 95 / 0.96);
  box-shadow: 0 18px 34px oklch(28% 0.032 100 / 0.14);
  animation: queue-dock 780ms var(--ease-out) 260ms both;
}

.queue-label,
.queue-meta {
  display: block;
  color: var(--ink-faint);
  font-size: 12px;
}

.queue-title {
  display: block;
  margin: 10px 0 18px;
  font-family: var(--font-display);
  font-size: 24px;
  line-height: 1.28;
}

.progress-track {
  height: 7px;
  overflow: hidden;
  border-radius: 999px;
  background: oklch(82% 0.026 91);
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: var(--mineral);
  transition: width 360ms var(--ease-out);
}

.queue-meta {
  margin-top: 10px;
}

.queue-action {
  width: 100%;
  height: 42px;
  margin-top: 18px;
  border-radius: 7px;
  background: var(--ink);
  color: var(--paper-soft);
  transition: background 220ms var(--ease-out), transform 220ms var(--ease-out);
}

.queue-action:active {
  transform: translateY(1px);
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: clamp(34px, 6vw, 78px);
  margin-top: clamp(56px, 9vw, 110px);
  align-items: start;
}

.section-heading {
  margin-bottom: 22px;
}

.section-kicker,
.section-title,
.aside-label,
.subscribe-copy {
  display: block;
}

.section-title {
  margin-top: 8px;
  font-family: var(--font-display);
  font-size: clamp(30px, 4.2vw, 48px);
}

.post-row {
  width: 100%;
  display: grid;
  grid-template-columns: 74px minmax(0, 1fr) 28px;
  gap: clamp(16px, 3vw, 30px);
  padding: 26px 0;
  text-align: left;
  border-top: 1px solid var(--line);
  background: transparent;
  color: var(--ink);
  position: relative;
  transition: color 260ms var(--ease-out), transform 260ms var(--ease-out), padding 260ms var(--ease-out);
  animation: stagger-card 600ms var(--ease-out) both;
}

.post-row:nth-of-type(2n) {
  margin-left: 22px;
}

.post-row:nth-of-type(3n) {
  margin-left: -10px;
}

.post-row::before {
  content: "";
  position: absolute;
  left: 0;
  right: 100%;
  top: -1px;
  height: 2px;
  background: var(--seal);
  transition: right 360ms var(--ease-out);
}

.post-row:nth-of-type(1) {
  animation-delay: 40ms;
}

.post-row:nth-of-type(2) {
  animation-delay: 110ms;
}

.post-row:nth-of-type(3) {
  animation-delay: 180ms;
}

.post-row:nth-of-type(4) {
  animation-delay: 250ms;
}

.post-row:nth-of-type(5) {
  animation-delay: 320ms;
}

.post-row:nth-of-type(6) {
  animation-delay: 390ms;
}

.post-row:last-child {
  border-bottom: 1px solid var(--line);
}

.post-row.selected {
  color: var(--mineral);
}

.post-row.selected::before,
.post-row:hover::before {
  right: 0;
}

.post-row:active {
  transform: translateY(1px);
}

.post-date {
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: var(--ink-faint);
  font-family: var(--font-display);
  line-height: 1;
  transition: transform 260ms var(--ease-out), color 260ms var(--ease-out);
}

.post-date text:first-child {
  font-size: 15px;
}

.post-date text:last-child {
  font-size: 36px;
}

.post-topline {
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 10px;
}

.post-title {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(24px, 3.4vw, 34px);
  line-height: 1.22;
  transition: transform 260ms var(--ease-out);
}

.post-desc {
  display: block;
  max-width: 68ch;
  margin-top: 12px;
  color: var(--ink-muted);
  font-size: 15px;
  line-height: 1.85;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.post-tags text {
  padding: 5px 9px;
  border-radius: 999px;
  background: oklch(90% 0.024 91);
  color: var(--ink-muted);
  font-size: 12px;
  transition: transform 240ms var(--ease-out), background 240ms var(--ease-out);
}

.post-arrow {
  align-self: start;
  color: var(--seal);
  font-size: 20px;
}

.empty-state {
  padding: 30px 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.empty-title,
.empty-copy {
  display: block;
}

.empty-title {
  font-family: var(--font-display);
  font-size: clamp(24px, 3vw, 32px);
}

.empty-copy {
  max-width: 52ch;
  margin-top: 10px;
  color: var(--ink-muted);
  line-height: 1.75;
}

.empty-state button {
  min-height: 38px;
  margin-top: 18px;
  padding: 0 14px;
  border: 0;
  border-radius: 7px;
  background: var(--ink);
  color: var(--paper-soft);
  cursor: pointer;
}

.aside {
  position: sticky;
  top: 28px;
  display: grid;
  gap: 22px;
  perspective: 900px;
}

.aside-block,
.subscribe {
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: oklch(94% 0.017 88 / 0.72);
  transition: transform 260ms var(--ease-out), box-shadow 260ms var(--ease-out);
}

.aside-block:nth-child(2) {
  transform: translateX(16px);
}

.subscribe {
  transform: translateX(-8px);
}

.reading {
  background: var(--mineral-soft);
}

.queue-item {
  display: block;
  width: 100%;
  padding: 14px 0;
  border-bottom: 1px solid oklch(72% 0.031 138 / 0.52);
  background: transparent;
  color: var(--ink-muted);
  line-height: 1.55;
  text-align: left;
}

.queue-item:last-child {
  border-bottom: 0;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.tag-cloud button {
  padding: 8px 10px;
  border: 1px solid oklch(75% 0.026 88);
  border-radius: 999px;
  background: transparent;
  color: var(--ink-muted);
  font-size: 13px;
}

.tag-cloud button.active {
  border-color: var(--mineral);
  background: var(--mineral-soft);
  color: var(--mineral);
}

.clear-tag {
  margin-top: 16px;
  padding: 0;
  background: transparent;
  color: var(--seal);
  font-size: 13px;
}

.subscribe-copy {
  margin: 14px 0 18px;
  color: var(--ink-muted);
  font-size: 14px;
  line-height: 1.7;
}

.subscribe-row {
  gap: 8px;
}

.subscribe-row input {
  min-width: 0;
  flex: 1;
  height: 42px;
  padding: 0 12px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: var(--paper-soft);
  color: var(--ink);
}

.subscribe-row button {
  width: 72px;
  height: 42px;
  border-radius: 7px;
  background: var(--seal);
  color: oklch(96% 0.014 71);
}

.showcase-section,
.lower-grid {
  margin-top: clamp(58px, 9vw, 112px);
}

.project-list {
  display: grid;
  gap: 14px;
  border-top: 0;
  perspective: 1200px;
}

.project-row {
  width: 100%;
  display: grid;
  grid-template-columns: 94px minmax(180px, 0.38fr) minmax(0, 1fr) 80px;
  gap: clamp(14px, 3vw, 30px);
  align-items: start;
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: oklch(94% 0.017 88 / 0.74);
  color: var(--ink);
  text-align: left;
  box-shadow: 0 16px 34px oklch(29% 0.03 90 / 0.08);
  transition: transform 300ms var(--ease-out), color 260ms var(--ease-out), box-shadow 300ms var(--ease-out);
  animation: stagger-card 620ms var(--ease-out) both;
}

.project-row:nth-child(2n) {
  margin-left: clamp(16px, 4vw, 54px);
}

.project-row:nth-child(3n) {
  margin-right: clamp(16px, 5vw, 78px);
}

.project-row:nth-child(1) {
  animation-delay: 80ms;
}

.project-row:nth-child(2) {
  animation-delay: 160ms;
}

.project-row:nth-child(3) {
  animation-delay: 240ms;
}

.project-row:nth-child(4) {
  animation-delay: 320ms;
}

.project-status {
  color: var(--seal);
  font-size: 13px;
  font-weight: 700;
}

.project-name {
  font-family: var(--font-display);
  font-size: clamp(22px, 3vw, 31px);
  line-height: 1.2;
}

.project-desc,
.about-copy,
.inline-feedback {
  color: var(--ink-muted);
  line-height: 1.8;
}

.project-arrow {
  color: var(--seal);
  font-size: 13px;
  font-weight: 700;
  text-align: right;
}

.inline-feedback {
  display: block;
  margin-top: 18px;
  font-size: 14px;
}

.lower-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.86fr) minmax(320px, 1fr);
  gap: clamp(24px, 5vw, 56px);
  align-items: stretch;
}

.books-panel,
.about-panel {
  padding: clamp(24px, 4vw, 34px);
  border: 1px solid var(--line);
  border-radius: 8px;
  background: oklch(94% 0.017 88 / 0.72);
  transition: transform 280ms var(--ease-out), box-shadow 280ms var(--ease-out);
}

.books-panel {
  transform: translateY(22px);
}

.about-panel {
  transform: translateY(-10px);
}

.compact-title {
  display: block;
  margin-top: 10px;
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 40px);
  line-height: 1.15;
}

.book-item {
  display: block;
  width: 100%;
  margin-top: 18px;
  padding: 16px 0;
  border-top: 1px solid var(--line);
  background: transparent;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 22px;
  line-height: 1.3;
  text-align: left;
}

.about-copy {
  display: block;
  margin-top: 18px;
  font-size: 16px;
}

.about-actions {
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

@media (hover: hover) {
  .filter:hover,
  .post-row:hover,
  .project-row:hover,
  .hero-actions button:hover,
  .about-actions button:hover {
    transform: translateY(-2px);
  }

  .signal-stack button:hover {
    background: var(--mineral-soft);
    transform: translateX(8px) rotate(-1deg);
  }

  .post-row:hover {
    padding-left: 14px;
  }

  .post-row:hover .post-date {
    color: var(--seal);
    transform: translateY(-3px);
  }

  .post-row:hover .post-title {
    transform: translateX(8px);
  }

  .post-row:hover .post-tags text:nth-child(1) {
    transform: translateY(-2px);
  }

  .post-row:hover .post-tags text:nth-child(2) {
    transform: translateY(-4px);
  }

  .post-row:hover .post-tags text:nth-child(3) {
    transform: translateY(-6px);
  }

  .aside-block:hover,
  .subscribe:hover,
  .books-panel:hover,
  .about-panel:hover {
    box-shadow: 0 18px 34px oklch(30% 0.03 92 / 0.11);
  }

  .project-row:hover {
    transform: translateY(-6px) rotate(-0.45deg);
    box-shadow: 0 24px 48px oklch(28% 0.032 92 / 0.13);
  }

  .project-row:nth-child(2n):hover {
    transform: translateX(8px) translateY(-6px) rotate(0.45deg);
  }
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(28px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes stagger-card {
  from {
    opacity: 0;
    transform: translateY(18px) rotate(0.5deg);
  }

  to {
    opacity: 1;
    transform: translateY(0) rotate(0deg);
  }
}

@keyframes paper-settle {
  from {
    opacity: 0;
    transform: translateY(22px) rotate(1.2deg);
  }

  to {
    opacity: 1;
    transform: translateY(0) rotate(-0.4deg);
  }
}

@keyframes queue-dock {
  from {
    opacity: 0;
    transform: translate(22px, 18px);
  }

  to {
    opacity: 1;
    transform: translate(0, 0);
  }
}

@media (max-width: 900px) {
  .home {
    width: min(100% - 28px, 680px);
  }

  .nav {
    align-items: flex-start;
  }

  .nav-links {
    flex-wrap: wrap;
    justify-content: flex-end;
    row-gap: 8px;
  }

  .hero,
  .content-grid,
  .lower-grid {
    grid-template-columns: 1fr;
  }

  .hero {
    min-height: 0;
  }

  .hero-media {
    min-height: 440px;
  }

  .desk-image {
    height: 380px;
  }

  .signal-stack {
    left: 12px;
    top: 18px;
  }

  .aside {
    position: static;
    grid-template-columns: 1fr;
  }

  .project-row {
    grid-template-columns: 82px minmax(0, 1fr);
  }

  .project-desc,
  .project-arrow {
    grid-column: 2;
  }

  .project-arrow {
    text-align: left;
  }
}

@media (max-width: 560px) {
  .home {
    width: calc(100% - 24px);
    padding-top: 18px;
  }

  .nav {
    margin-bottom: 44px;
  }

  .brand-name {
    font-size: 19px;
  }

  .nav-links {
    display: none;
  }

  .headline {
    font-size: clamp(42px, 14vw, 64px);
  }

  .intro {
    font-size: 15px;
  }

  .hero-media {
    min-height: 380px;
  }

  .desk-image {
    height: 310px;
  }

  .queue-panel {
    left: 14px;
    right: auto;
    padding: 18px;
  }

  .post-row {
    grid-template-columns: 54px minmax(0, 1fr);
    margin-left: 0;
  }

  .post-arrow {
    display: none;
  }

  .post-date text:last-child {
    font-size: 28px;
  }

  .subscribe-row {
    flex-direction: column;
    align-items: stretch;
  }

  .subscribe-row button {
    width: 100%;
  }

  .project-row {
    grid-template-columns: 1fr;
    gap: 8px;
    margin-left: 0;
    margin-right: 0;
  }

  .project-desc {
    grid-column: auto;
  }

  .project-arrow {
    grid-column: auto;
  }
}
</style>
