<template>
  <view class="home">
    <view class="nav">
      <view class="brand">
        <text class="brand-mark">止</text>
        <text class="brand-name">山止川行</text>
      </view>
      <view class="nav-links">
        <text>札记</text>
        <text>项目</text>
        <text>书单</text>
        <text>关于</text>
      </view>
    </view>

    <view class="hero">
      <view class="hero-copy">
        <text class="kicker">写作 / 代码 / 长路</text>
        <text class="headline">把日常里的问题，写成可以反复抵达的地图。</text>
        <text class="intro">这里收集技术复盘、产品观察、阅读笔记和一点点生活侧影。文章不追热点，只记录那些愿意慢下来解释清楚的东西。</text>

        <view class="filters" aria-label="文章主题筛选">
          <button
            v-for="topic in topics"
            :key="topic"
            class="filter"
            :class="{ active: activeTopic === topic }"
            @click="activeTopic = topic"
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

    <view class="content-grid">
      <view class="article-section">
        <view class="section-heading">
          <text class="section-kicker">{{ activeTopic === '全部' ? '精选文章' : activeTopic }}</text>
          <text class="section-title">最近写下的几条线索</text>
        </view>

        <button
          v-for="post in filteredPosts"
          :key="post.id"
          class="post-row"
          :class="{ selected: post.id === selectedPost.id }"
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
          </view>
          <view class="post-arrow">↗</view>
        </button>
      </view>

      <view class="aside">
        <view class="aside-block reading">
          <text class="aside-label">阅读队列</text>
          <view v-for="item in queue" :key="item" class="queue-item">
            <text>{{ item }}</text>
          </view>
        </view>

        <view class="aside-block">
          <text class="aside-label">常写主题</text>
          <view class="tag-cloud">
            <text v-for="tag in tags" :key="tag">{{ tag }}</text>
          </view>
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
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { posts, queue, tags, topics } from '../../data/posts'

const activeTopic = ref('全部')
const selectedId = ref(1)
const email = ref('')
const subscribed = ref(false)

const filteredPosts = computed(() => {
  if (activeTopic.value === '全部') return posts
  return posts.filter((post) => post.topic === activeTopic.value)
})

const selectedPost = computed(() => {
  return posts.find((post) => post.id === selectedId.value) || filteredPosts.value[0] || posts[0]
})

function subscribe() {
  if (!email.value.trim()) return
  subscribed.value = true
}

function openPost(id) {
  selectedId.value = id
  uni.navigateTo({
    url: `/pages/post/detail?id=${id}`
  })
}
</script>

<style lang="scss" scoped>
.home {
  width: min(1180px, calc(100vw - 40px));
  margin: 0 auto;
  padding: clamp(24px, 4vw, 52px) 0 72px;
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
.subscribe-row {
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
  color: var(--ink-muted);
  font-size: 15px;
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

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 36px;
}

.filter,
.post-row,
.subscribe-row button,
.queue-action {
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
}

.desk-image {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  display: block;
  filter: saturate(0.88) contrast(1.04);
  box-shadow: var(--shadow);
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
  transition: color 220ms var(--ease-out), transform 220ms var(--ease-out);
}

.post-row:last-child {
  border-bottom: 1px solid var(--line);
}

.post-row.selected {
  color: var(--mineral);
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
}

.post-desc {
  display: block;
  max-width: 68ch;
  margin-top: 12px;
  color: var(--ink-muted);
  font-size: 15px;
  line-height: 1.85;
}

.post-arrow {
  align-self: start;
  color: var(--seal);
  font-size: 20px;
}

.aside {
  position: sticky;
  top: 28px;
  display: grid;
  gap: 22px;
}

.aside-block,
.subscribe {
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: oklch(94% 0.017 88 / 0.72);
}

.reading {
  background: var(--mineral-soft);
}

.queue-item {
  padding: 14px 0;
  border-bottom: 1px solid oklch(72% 0.031 138 / 0.52);
  color: var(--ink-muted);
  line-height: 1.55;
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

.tag-cloud text {
  padding: 8px 10px;
  border: 1px solid oklch(75% 0.026 88);
  border-radius: 999px;
  color: var(--ink-muted);
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

@media (hover: hover) {
  .filter:hover,
  .post-row:hover {
    transform: translateY(-2px);
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
  .content-grid {
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

  .aside {
    position: static;
    grid-template-columns: 1fr;
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
}
</style>
