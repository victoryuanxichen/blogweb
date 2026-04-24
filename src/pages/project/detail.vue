<template>
  <view class="project-page">
    <view class="project-nav">
      <button class="back-button" @click="goBack">返回</button>
      <view class="reader-brand">
        <text class="brand-mark">止</text>
        <text>项目记录</text>
      </view>
    </view>

    <view class="project-hero">
      <view>
        <view class="project-meta">
          <text>{{ project.status }}</text>
          <text>{{ project.period }}</text>
          <text>{{ project.role }}</text>
        </view>
        <text class="project-title">{{ project.name }}</text>
        <text class="project-desc">{{ project.cover }}</text>
      </view>

      <view class="stack-panel">
        <text class="panel-label">技术栈</text>
        <view class="stack-list">
          <text v-for="item in project.stack" :key="item">{{ item }}</text>
        </view>
      </view>
    </view>

    <view class="project-grid">
      <view class="project-main">
        <view class="case-section">
          <text class="case-label">问题背景</text>
          <text class="case-copy">{{ project.problem }}</text>
        </view>

        <view class="case-section">
          <text class="case-label">解决思路</text>
          <text class="case-copy">{{ project.solution }}</text>
        </view>

        <view class="case-section">
          <text class="case-label">项目亮点</text>
          <view class="highlight-list">
            <text v-for="highlight in project.highlights" :key="highlight">{{ highlight }}</text>
          </view>
        </view>
      </view>

      <view class="project-side">
        <view class="side-block">
          <text class="panel-label">阶段结果</text>
          <view class="result-list">
            <text v-for="result in project.results" :key="result">{{ result }}</text>
          </view>
        </view>

        <view class="side-block action-block">
          <text class="panel-label">可以继续做</text>
          <button @click="markInterest('补充截图')">补充截图</button>
          <button @click="markInterest('写技术复盘')">写技术复盘</button>
          <button @click="openNextProject">看下一个项目</button>
          <text v-if="interest" class="inline-feedback">已加入计划：{{ interest }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { findProjectById, projects } from '../../data/posts'

const projectId = ref(projects[0].id)
const interest = ref('')

const project = computed(() => findProjectById(projectId.value))
const currentIndex = computed(() => projects.findIndex((item) => item.id === project.value.id))
const nextProject = computed(() => projects[(currentIndex.value + 1) % projects.length])

onLoad((query) => {
  if (query?.id) {
    projectId.value = query.id
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

function markInterest(action) {
  interest.value = action
}

function openNextProject() {
  interest.value = ''
  projectId.value = nextProject.value.id
  uni.redirectTo({
    url: `/pages/project/detail?id=${nextProject.value.id}`,
    fail: () => {
      if (typeof window !== 'undefined') {
        const targetHash = `#/pages/project/detail?id=${nextProject.value.id}`
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
</script>

<style lang="scss" scoped>
.project-page {
  width: min(1120px, calc(100vw - 40px));
  margin: 0 auto;
  padding: clamp(22px, 4vw, 48px) 0 82px;
}

.project-nav,
.reader-brand,
.project-meta,
.project-hero {
  display: flex;
  align-items: center;
}

.project-nav {
  justify-content: space-between;
  gap: 18px;
  margin-bottom: clamp(44px, 7vw, 82px);
}

.back-button,
.action-block button {
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

.project-hero {
  justify-content: space-between;
  gap: clamp(30px, 6vw, 80px);
  align-items: flex-end;
}

.project-meta {
  flex-wrap: wrap;
  gap: 10px 18px;
  color: var(--seal);
  font-size: 13px;
  font-weight: 700;
}

.project-title {
  display: block;
  max-width: 820px;
  margin-top: 22px;
  font-family: var(--font-display);
  font-size: clamp(44px, 7vw, 84px);
  line-height: 1.02;
}

.project-desc {
  display: block;
  max-width: 760px;
  margin-top: 24px;
  color: var(--ink-muted);
  font-size: clamp(17px, 2vw, 21px);
  line-height: 1.85;
}

.stack-panel,
.side-block {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: oklch(94% 0.017 88 / 0.72);
}

.stack-panel {
  width: min(320px, 100%);
  padding: 24px;
}

.panel-label,
.case-label {
  display: block;
  color: var(--seal);
  font-size: 13px;
  font-weight: 700;
}

.stack-list {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 16px;
}

.stack-list text {
  padding: 7px 10px;
  border-radius: 999px;
  background: var(--mineral-soft);
  color: var(--mineral);
  font-size: 13px;
}

.project-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: clamp(34px, 6vw, 72px);
  margin-top: clamp(54px, 8vw, 90px);
  align-items: start;
}

.case-section {
  padding: 34px 0;
  border-top: 1px solid var(--line);
}

.case-copy {
  display: block;
  margin-top: 16px;
  max-width: 74ch;
  color: var(--ink-muted);
  font-size: 18px;
  line-height: 1.95;
}

.highlight-list,
.result-list {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}

.highlight-list text {
  padding: 16px 18px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: oklch(94% 0.017 88 / 0.72);
  color: var(--ink);
  line-height: 1.55;
}

.project-side {
  position: sticky;
  top: 28px;
  display: grid;
  gap: 18px;
}

.side-block {
  padding: 24px;
}

.result-list text {
  color: var(--ink-muted);
  line-height: 1.65;
}

.action-block button {
  display: block;
  width: 100%;
  min-height: 40px;
  margin-top: 12px;
  border-radius: 7px;
  background: var(--ink);
  color: var(--paper-soft);
}

.action-block button:nth-of-type(2) {
  background: var(--seal);
}

.action-block button:nth-of-type(3) {
  border: 1px solid var(--ink);
  background: transparent;
  color: var(--ink);
}

.inline-feedback {
  display: block;
  margin-top: 14px;
  color: var(--ink-muted);
  font-size: 14px;
}

@media (hover: hover) {
  .back-button:hover,
  .action-block button:hover {
    transform: translateY(-1px);
  }
}

@media (max-width: 860px) {
  .project-page {
    width: min(100% - 28px, 680px);
  }

  .project-hero,
  .project-grid {
    display: block;
  }

  .stack-panel {
    width: 100%;
    margin-top: 30px;
  }

  .project-side {
    position: static;
    margin-top: 28px;
  }
}

@media (max-width: 520px) {
  .project-page {
    width: calc(100% - 24px);
    padding-top: 18px;
  }

  .reader-brand text:last-child {
    display: none;
  }

  .project-title {
    font-size: clamp(38px, 13vw, 58px);
  }

  .project-desc,
  .case-copy {
    font-size: 16px;
  }
}
</style>
