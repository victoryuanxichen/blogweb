<template>
  <view class="detail-page">
    <view class="reader-nav">
      <button class="back-button" @click="goBack">返回</button>
      <view class="reader-brand">
        <text class="brand-mark">止</text>
        <text>山止川行</text>
      </view>
    </view>

    <article class="article-shell">
      <view class="article-meta">
        <text>{{ post.topic }}</text>
        <text>{{ post.date }}</text>
        <text>{{ post.minutes }} 分钟</text>
      </view>

      <text class="article-title">{{ post.title }}</text>
      <text class="article-desc">{{ post.desc }}</text>
      <view class="article-tags">
        <button v-for="tag in post.tags" :key="tag" @click="openTag(tag)">{{ tag }}</button>
      </view>

      <view class="article-grid">
        <aside class="article-aside">
          <text class="aside-label">本文线索</text>
          <view class="toc-list">
            <button v-for="(section, index) in post.sections" :key="section.heading" @click="jumpToSection(index)">
              {{ section.heading }}
            </button>
          </view>
          <view class="action-list">
            <button v-for="action in post.actions" :key="action" @click="markAction(action)">
              {{ action }}
            </button>
          </view>
          <text v-if="lastAction" class="action-feedback">已执行：{{ lastAction }}</text>
        </aside>

        <view class="article-body">
          <blockquote class="pullquote">
            <text>{{ post.pullquote }}</text>
          </blockquote>

          <section
            v-for="(section, index) in post.sections"
            :id="`section-${index}`"
            :key="section.heading"
            class="article-section"
          >
            <text class="section-title">{{ section.heading }}</text>
            <text class="section-body">{{ section.body }}</text>
          </section>

          <view class="reading-nav">
            <button @click="openPost(previousPost.id)">
              <text>上一篇</text>
              <text>{{ previousPost.title }}</text>
            </button>
            <button @click="openPost(nextPost.id)">
              <text>下一篇</text>
              <text>{{ nextPost.title }}</text>
            </button>
          </view>
        </view>
      </view>
    </article>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { findPostById, posts } from '../../data/posts'

const postId = ref(posts[0].id)
const lastAction = ref('')

const post = computed(() => findPostById(postId.value))
const currentIndex = computed(() => posts.findIndex((item) => item.id === post.value.id))
const nextPost = computed(() => {
  return posts[(currentIndex.value + 1) % posts.length]
})
const previousPost = computed(() => {
  return posts[(currentIndex.value - 1 + posts.length) % posts.length]
})

onLoad((query) => {
  if (query?.id) {
    postId.value = query.id
  }
})

function goBack() {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
    return
  }

  uni.reLaunch({
    url: '/pages/index/index'
  })
}

function openPost(id) {
  postId.value = id
  lastAction.value = ''
  uni.redirectTo({
    url: `/pages/post/detail?id=${id}`,
    fail: () => {
      if (typeof window !== 'undefined') {
        const targetHash = `#/pages/post/detail?id=${id}`
        const targetUrl = `${window.location.origin}${window.location.pathname}${targetHash}`

        if (window.location.hash === targetHash) {
          window.location.reload()
          return
        }

        window.location.assign(targetUrl)
      }
    }
  })
}

function jumpToSection(index) {
  uni.pageScrollTo({
    selector: `#section-${index}`,
    duration: 240
  })
}

function markAction(action) {
  lastAction.value = action
}

function openTag(tag) {
  uni.reLaunch({
    url: `/pages/index/index?tag=${encodeURIComponent(tag)}`
  })
}
</script>

<style lang="scss" scoped>
.detail-page {
  width: min(1120px, calc(100vw - 40px));
  margin: 0 auto;
  padding: clamp(22px, 4vw, 48px) 0 82px;
}

.reader-nav,
.reader-brand,
.article-meta,
.article-grid {
  display: flex;
  align-items: center;
}

.reader-nav {
  justify-content: space-between;
  gap: 18px;
  margin-bottom: clamp(44px, 7vw, 82px);
}

.back-button,
.reading-nav button,
.toc-list button,
.action-list button,
.article-tags button {
  border: 0;
  cursor: pointer;
}

.back-button {
  min-width: 72px;
  height: 38px;
  border-radius: 999px;
  background: oklch(91% 0.025 88);
  color: var(--ink-muted);
}

.reader-brand {
  gap: 10px;
  color: var(--ink-muted);
  font-family: var(--font-display);
  font-size: 18px;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 7px;
  background: var(--seal);
  color: oklch(96% 0.014 71);
}

.article-shell {
  display: block;
}

.article-meta {
  flex-wrap: wrap;
  gap: 10px 18px;
  color: var(--seal);
  font-size: 13px;
  font-weight: 700;
}

.article-title {
  display: block;
  max-width: 880px;
  margin-top: 22px;
  font-family: var(--font-display);
  font-size: clamp(42px, 7vw, 82px);
  line-height: 1.02;
  letter-spacing: 0;
}

.article-desc {
  display: block;
  max-width: 760px;
  margin-top: 24px;
  color: var(--ink-muted);
  font-size: clamp(17px, 2vw, 21px);
  line-height: 1.85;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 26px;
}

.article-tags button {
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid oklch(75% 0.026 88);
  border-radius: 999px;
  background: oklch(92% 0.023 88 / 0.78);
  color: var(--ink-muted);
}

.article-grid {
  align-items: flex-start;
  gap: clamp(34px, 6vw, 78px);
  margin-top: clamp(48px, 8vw, 86px);
}

.article-aside {
  position: sticky;
  top: 28px;
  width: 260px;
  flex: 0 0 260px;
  padding-top: 8px;
}

.aside-label {
  display: block;
  color: var(--seal);
  font-size: 13px;
  font-weight: 700;
}

.toc-list {
  display: grid;
  gap: 14px;
  margin-top: 18px;
  line-height: 1.55;
}

.toc-list button {
  padding: 0;
  background: transparent;
  color: var(--ink-muted);
  line-height: 1.55;
  text-align: left;
}

.action-list {
  display: grid;
  gap: 10px;
  margin-top: 28px;
}

.action-list button {
  min-height: 38px;
  padding: 0 12px;
  border-radius: 7px;
  background: var(--mineral-soft);
  color: var(--mineral);
  text-align: left;
}

.action-feedback {
  display: block;
  margin-top: 14px;
  color: var(--seal);
  font-size: 13px;
}

.article-body {
  min-width: 0;
  flex: 1;
  max-width: 760px;
}

.pullquote {
  margin: 0 0 42px;
  padding: clamp(22px, 4vw, 34px);
  border: 1px solid oklch(75% 0.03 86);
  border-radius: 8px;
  background: oklch(94% 0.018 86 / 0.76);
}

.pullquote text {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(25px, 3.2vw, 34px);
  line-height: 1.42;
}

.article-section {
  display: block;
  padding: 36px 0;
  border-top: 1px solid var(--line);
}

.section-title {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(26px, 3vw, 34px);
  line-height: 1.22;
}

.section-body {
  display: block;
  margin-top: 18px;
  color: var(--ink-muted);
  font-size: 18px;
  line-height: 2;
}

.reading-nav {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 22px;
}

.reading-nav button {
  width: 100%;
  min-height: 128px;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--mineral-soft);
  color: var(--ink);
  text-align: left;
}

.reading-nav button text:first-child {
  display: block;
  color: var(--seal);
  font-size: 13px;
  font-weight: 700;
}

.reading-nav button text:last-child {
  display: block;
  margin-top: 12px;
  font-family: var(--font-display);
  font-size: clamp(21px, 2.8vw, 29px);
  line-height: 1.3;
}

@media (hover: hover) {
  .back-button:hover,
  .reading-nav button:hover,
  .toc-list button:hover,
  .article-tags button:hover {
    transform: translateY(-1px);
  }
}

@media (max-width: 820px) {
  .detail-page {
    width: min(100% - 28px, 680px);
  }

  .article-grid {
    display: block;
  }

  .article-aside {
    position: static;
    width: auto;
    margin-bottom: 32px;
    padding: 18px 0;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
  }

  .toc-list {
    grid-template-columns: 1fr;
  }

  .action-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .section-body {
    font-size: 17px;
  }
}

@media (max-width: 520px) {
  .detail-page {
    width: calc(100% - 24px);
    padding-top: 18px;
  }

  .reader-brand text:last-child {
    display: none;
  }

  .article-title {
    font-size: clamp(38px, 13vw, 58px);
  }

  .article-desc,
  .section-body {
    font-size: 16px;
  }

  .action-list,
  .reading-nav {
    grid-template-columns: 1fr;
  }
}
</style>
