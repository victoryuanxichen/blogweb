<template>
  <view class="detail-page">
    <view class="reader-nav">
      <button class="back-button" @click="goBack">返回</button>
      <view class="reader-brand">
        <text class="brand-mark">YX</text>
        <text>YX AI LAB</text>
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
.article-meta,
.article-title,
.article-desc,
.article-tags,
.article-grid {
  animation: article-rise var(--motion-slow) var(--ease-out) both;
}

.article-meta {
  animation-delay: 80ms;
}

.article-title {
  animation-delay: 140ms;
}

.article-desc {
  animation-delay: 200ms;
}

.article-tags {
  animation-delay: 260ms;
}

.article-grid {
  animation-delay: 340ms;
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
  background: oklch(18% 0.045 246);
  color: var(--ink-muted);
  border: 1px solid oklch(72% 0.14 194 / 0.32);
  transition: transform var(--motion-fast) var(--ease-out), background var(--motion-fast) var(--ease-out);
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
  width: 38px;
  height: 32px;
  border: 1px solid oklch(72% 0.14 194 / 0.48);
  border-radius: 6px;
  background: oklch(12% 0.035 260);
  color: oklch(91% 0.025 230);
  font-size: 12px;
  box-shadow: 0 0 18px oklch(72% 0.14 194 / 0.2);
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
  border: 1px solid oklch(72% 0.14 194 / 0.3);
  border-radius: 999px;
  background: oklch(18% 0.045 246 / 0.78);
  color: var(--ink-muted);
  transition: transform var(--motion-fast) var(--ease-out), background var(--motion-fast) var(--ease-out), color var(--motion-fast) var(--ease-out);
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
  animation: side-slip 720ms var(--ease-out) 420ms both;
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
  transition: color var(--motion-fast) var(--ease-out), transform var(--motion-fast) var(--ease-out);
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
  transition: transform var(--motion-fast) var(--ease-out), background var(--motion-fast) var(--ease-out);
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
  border: 1px solid oklch(72% 0.14 194 / 0.3);
  border-radius: 8px;
  background:
    radial-gradient(circle at 100% 0%, oklch(72% 0.18 332 / 0.14), transparent 36%),
    oklch(16% 0.04 252 / 0.86);
  animation: paper-tilt 780ms var(--ease-out) 440ms both;
  transition: transform var(--motion-mid) var(--ease-out), box-shadow var(--motion-mid) var(--ease-out);
}

.pullquote text {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(25px, 3.2vw, 34px);
  line-height: 1.42;
}

.article-section {
  position: relative;
  display: block;
  padding: 36px 0;
  border-top: 1px solid var(--line);
  animation: article-rise 620ms var(--ease-out) both;
}

.article-section:nth-of-type(2) {
  animation-delay: 80ms;
}

.article-section:nth-of-type(3) {
  animation-delay: 160ms;
}

.article-section:nth-of-type(4) {
  animation-delay: 240ms;
}

.article-section::before {
  content: "";
  position: absolute;
  left: 0;
  top: -1px;
  width: 0;
  height: 2px;
  background: var(--seal);
  transition: width var(--motion-mid) var(--ease-out);
}

.section-title {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(26px, 3vw, 34px);
  line-height: 1.22;
  transition: transform var(--motion-fast) var(--ease-out);
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
  transition: transform var(--motion-mid) var(--ease-out), box-shadow var(--motion-mid) var(--ease-out), background var(--motion-mid) var(--ease-out);
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

  .back-button:hover {
    background: oklch(24% 0.06 236);
  }

  .article-tags button:hover {
    background: var(--mineral-soft);
    color: var(--mineral);
  }

  .toc-list button:hover {
    color: var(--seal);
    transform: translateX(6px);
  }

  .action-list button:hover {
    background: oklch(24% 0.08 194);
    transform: translateX(4px);
  }

  .pullquote:hover {
    transform: rotate(-0.35deg) translateY(-3px);
    box-shadow: 0 18px 36px oklch(28% 0.03 92 / 0.11);
  }

  .article-section:hover::before {
    width: 100%;
  }

  .article-section:hover .section-title {
    transform: translateX(8px);
  }

  .reading-nav button:hover {
    background: oklch(24% 0.08 194);
    box-shadow: 0 18px 34px oklch(28% 0.032 92 / 0.12);
  }
}

@keyframes article-rise {
  from {
    opacity: 0;
    transform: translateY(24px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes side-slip {
  from {
    opacity: 0;
    transform: translateX(-18px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes paper-tilt {
  from {
    opacity: 0;
    transform: translateY(18px) rotate(0.8deg);
  }

  to {
    opacity: 1;
    transform: translateY(0) rotate(-0.25deg);
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
    width: calc(100% - 20px);
    padding-top: 18px;
    padding-bottom: 54px;
  }

  .reader-nav {
    margin-bottom: 34px;
  }

  .reader-brand text:last-child {
    display: none;
  }

  .article-title {
    font-size: clamp(36px, 11.5vw, 52px);
    line-height: 1.06;
  }

  .article-desc,
  .section-body {
    font-size: 16px;
  }

  .article-desc {
    line-height: 1.72;
  }

  .article-tags {
    gap: 8px;
    margin-top: 20px;
  }

  .article-tags button {
    min-height: 32px;
    font-size: 12px;
  }

  .article-grid {
    margin-top: 34px;
  }

  .article-aside {
    margin-bottom: 24px;
  }

  .pullquote {
    margin-bottom: 26px;
    padding: 20px;
  }

  .pullquote text {
    font-size: clamp(22px, 7vw, 29px);
  }

  .article-section {
    padding: 28px 0;
  }

  .section-title {
    font-size: clamp(24px, 7.2vw, 31px);
  }

  .action-list,
  .reading-nav {
    grid-template-columns: 1fr;
  }

  .reading-nav button {
    min-height: 108px;
    padding: 18px;
  }
}

@media (orientation: portrait) and (max-width: 760px) {
  .toc-list {
    gap: 10px;
  }

  .article-body {
    max-width: 100%;
  }
}
</style>
