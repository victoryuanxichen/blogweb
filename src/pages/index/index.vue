<template>
  <view class="home" :style="reactiveField" @mousemove="trackPointer" @touchmove="trackTouch">
    <view class="nav">
      <view class="brand">
        <text class="brand-mark">YX</text>
        <text class="brand-name">YX AI LAB</text>
      </view>
      <view class="nav-links">
        <button v-for="item in navItems" :key="item.target" @click="jumpTo(item.target)">
          {{ item.label }}
        </button>
      </view>
    </view>

    <view class="sync-bus" :style="{ '--zone-index': activeZoneIndex }">
      <text class="sync-label">LIVE ORCHESTRATION</text>
      <button
        v-for="zone in zones"
        :key="zone.key"
        :class="{ active: activeZone === zone.key }"
        @click="jumpTo(zone.target)"
      >
        <text>{{ zone.code }}</text>
        <text>{{ zone.label }}</text>
      </button>
      <view class="bus-readout">
        <text>{{ activeSignal.title }}</text>
        <text>{{ activeSignal.copy }}</text>
      </view>
    </view>

    <view id="hero" class="hero" :class="{ engaged: activeZone === 'hero' }">
      <view class="hero-copy">
        <text class="kicker">Full-stack AI systems / interactive lab</text>
        <text class="headline">把模型、接口、数据和界面，压进一个会发光的工作台。</text>
        <text class="intro">这里不是安静的文章墙，而是我的全栈与 AI 实验台：Agent 流程、RAG 证据链、工程可观测性和项目记录会以更强的视觉状态展开。</text>

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
        <view class="lab-stage">
          <image
            class="desk-image"
            mode="aspectFill"
            src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1500&q=82"
            alt="屏幕上的代码编辑器和开发环境"
          />
          <view class="scan-beam" />
          <view class="lab-grid" />
          <view class="code-slab slab-a">
            <text>agent.run(task)</text>
            <text>tools.trace()</text>
            <text>commit(result)</text>
          </view>
          <view class="code-slab slab-b">
            <text>RAG / embeddings / refs</text>
            <text>latency budget: 180ms</text>
          </view>
          <view class="orbit-board">
            <text class="orbit-node node-a">API</text>
            <text class="orbit-node node-b">LLM</text>
            <text class="orbit-node node-c">DB</text>
            <text class="orbit-core">AI</text>
          </view>
        </view>

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
        <view class="queue-panel lab-queue">
          <text class="queue-label">ACTIVE THREAD</text>
          <text class="queue-title">{{ selectedPost.title }}</text>
          <view class="progress-track">
            <view class="progress-fill" :style="{ width: selectedPost.progress + '%' }" />
          </view>
          <text class="queue-meta">{{ selectedPost.progress }}% · {{ selectedPost.minutes }} 分钟</text>
          <button class="queue-action" @click="openPost(selectedPost.id)">OPEN THREAD</button>
        </view>
      </view>
    </view>

    <view class="sync-ribbon" :class="`zone-${activeZone}`">
      <view class="ribbon-core">
        <text>{{ activeSignal.title }}</text>
        <text>{{ activeSignal.copy }}</text>
      </view>
      <view class="ribbon-wave">
        <text v-for="zone in zones" :key="zone.key" :class="{ active: activeZone === zone.key }">
          {{ zone.label }}
        </text>
      </view>
    </view>

    <view class="tech-ticker" :class="`zone-${activeZone}`" aria-hidden="true">
      <text>AGENT PIPELINE</text>
      <text>RAG EVIDENCE</text>
      <text>FULL-STACK TRACE</text>
      <text>UX SYSTEMS</text>
      <text>OBSERVABILITY</text>
      <text>MODEL TOOLING</text>
    </view>

    <view id="articles" class="content-grid lab-content" :class="{ engaged: activeZone === 'articles' }">
      <view class="article-section">
        <view class="section-heading">
          <text class="section-kicker">{{ activeTopic === 'All' ? 'Featured Feed' : activeTopic }}</text>
          <text class="section-title">文章不是列表，是一条正在运行的思考进程</text>
        </view>

        <view class="article-console">
          <view class="console-topbar">
            <view class="console-lights">
              <text />
              <text />
              <text />
            </view>
            <text>runtime://notes.feed</text>
            <text>{{ filteredPosts.length }} jobs</text>
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
              <text>RUN</text>
              <text>{{ String(post.id).padStart(2, '0') }}</text>
            </view>
            <view class="post-body">
              <view class="post-topline">
                <text>{{ post.topic }}</text>
                <text>{{ post.date }} / {{ post.minutes }} min</text>
              </view>
              <text class="post-command">$ open ./writing/{{ post.slug }}.md</text>
              <text class="post-title">{{ post.title }}</text>
              <text class="post-desc">{{ post.desc }}</text>
              <view class="post-tags">
                <text v-for="tag in post.tags" :key="tag">{{ tag }}</text>
              </view>
            </view>
            <view class="post-arrow">↗</view>
          </view>
        </view>

        <view v-if="filteredPosts.length === 0" class="empty-state">
          <text class="empty-title">当前通道暂无输出</text>
          <text class="empty-copy">切回 All，或者换一个更接近全栈与 AI 的标签。</text>
          <button @click="resetFilters">RESET FEED</button>
        </view>
      </view>

      <view class="aside">
        <view class="aside-block reading">
          <text class="aside-label">阅读队列 / hot cache</text>
          <button v-for="item in queue" :key="item" class="queue-item" @click="openQueueItem(item)">
            <text class="queue-prefix">enqueue</text>
            <text>{{ item }}</text>
          </button>
        </view>

        <view class="aside-block">
          <text class="aside-label">主题路由 / tag router</text>
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
          <text class="aside-label">signal channel</text>
          <text class="subscribe-copy">{{ subscribed ? '下一次更新已接入你的信号通道。' : '每月一次，把新文章、项目进展和实验记录推送给你。' }}</text>
          <view class="subscribe-row">
            <input v-model="email" type="email" placeholder="you@example.com" />
            <button form-type="submit">{{ subscribed ? 'SYNCED' : 'JOIN' }}</button>
          </view>
        </form>
      </view>
    </view>

    <view id="projects" class="showcase-section" :class="{ engaged: activeZone === 'projects' }">
      <view class="section-heading">
        <text class="section-kicker">Projects</text>
        <text class="section-title">项目记录要像一组可以被打开的技术卷宗</text>
      </view>
      <view class="project-list">
        <view
          v-for="project in projects"
          :key="project.id"
          class="project-row"
          role="button"
          tabindex="0"
          @click="openProject(project.id)"
        >
          <view class="project-index">
            <text>CASE</text>
            <text>{{ String(project.id).padStart(2, '0') }}</text>
          </view>
          <view class="project-core">
            <text class="project-status">{{ project.status }} / {{ project.period }}</text>
            <text class="project-name">{{ project.name }}</text>
            <text class="project-desc">{{ project.desc }}</text>
          </view>
          <view class="project-stack">
            <text v-for="item in project.stack.slice(0, 4)" :key="item">{{ item }}</text>
          </view>
          <view class="project-arrow">
            <text>查看详情</text>
            <text>deploy dossier</text>
          </view>
        </view>
      </view>
    </view>

    <view class="lower-grid">
      <view id="books" class="books-panel" :class="{ engaged: activeZone === 'books' }">
        <view class="panel-head">
          <text class="section-kicker">Stack</text>
          <text class="panel-code">knowledge.cache()</text>
        </view>
        <text class="compact-title">知识栈和技术笔记，像运行时依赖一样持续加载</text>
        <view class="book-terminal">
          <button v-for="book in bookNotes" :key="book" class="book-item" @click="selectedBook = book">
            <text>import</text>
            <text>{{ book }}</text>
          </button>
        </view>
        <text class="inline-feedback">{{ selectedBook ? `已加载：${selectedBook}` : '点击条目，后续会进入对应技术笔记。' }}</text>
      </view>

      <view id="about" class="about-panel" :class="{ engaged: activeZone === 'about' }">
        <view class="panel-head">
          <text class="section-kicker">About</text>
          <text class="panel-code">profile.matrix</text>
        </view>
        <text class="compact-title">全栈开发者，AI 应用构建者</text>
        <text class="about-copy">我关注从需求到交付的完整链路：前端体验、服务端边界、数据库可靠性、AI 能力嵌入，以及让复杂系统被人理解的界面。</text>
        <view class="capability-grid">
          <view v-for="item in capabilities" :key="item.name" class="capability-item">
            <view>
              <text>{{ item.name }}</text>
              <text>{{ item.value }}%</text>
            </view>
            <view class="capability-track">
              <view :style="{ width: item.value + '%' }" />
            </view>
          </view>
        </view>
        <view class="about-actions">
          <button @click="jumpTo('articles')">OPEN FEED</button>
          <button @click="subscribeFromAbout">SYNC UPDATES</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { bookNotes, navItems, posts, projects, queue, tags, topics } from '../../data/posts'

const activeTopic = ref('All')
const activeTag = ref('')
const selectedId = ref(1)
const email = ref('')
const subscribed = ref(false)
const selectedBook = ref('')
const cursorX = ref(18)
const cursorY = ref(32)
const activeZone = ref('hero')
const crush = ref({
  hero: 0,
  feed: 0,
  cases: 0,
  stack: 0
})
const zones = [
  { key: 'hero', target: 'hero', code: '00', label: 'CORE' },
  { key: 'articles', target: 'articles', code: '01', label: 'FEED' },
  { key: 'projects', target: 'projects', code: '02', label: 'CASES' },
  { key: 'books', target: 'books', code: '03', label: 'STACK' },
  { key: 'about', target: 'about', code: '04', label: 'PROFILE' }
]
const capabilities = [
  { name: 'Frontend systems', value: 94 },
  { name: 'API architecture', value: 88 },
  { name: 'AI Agent design', value: 91 },
  { name: 'RAG evaluation', value: 84 },
  { name: 'Data reliability', value: 82 }
]

onLoad((query) => {
  if (query?.tag) {
    activeTag.value = decodeURIComponent(query.tag)
  }
})

const filteredPosts = computed(() => {
  return posts.filter((post) => {
    const matchesTopic = activeTopic.value === 'All' || post.topic === activeTopic.value
    const matchesTag = !activeTag.value || post.tags.includes(activeTag.value)
    return matchesTopic && matchesTag
  })
})

const selectedPost = computed(() => {
  return posts.find((post) => post.id === selectedId.value) || filteredPosts.value[0] || posts[0]
})

const reactiveField = computed(() => ({
  '--cursor-x': `${cursorX.value}%`,
  '--cursor-y': `${cursorY.value}%`,
  '--zone-index': activeZoneIndex.value,
  '--bus-dot-top': `${50 + activeZoneIndex.value * 46}px`,
  '--hero-crush': crush.value.hero,
  '--hero-y': `${-88 * crush.value.hero}px`,
  '--hero-scale': 1 - crush.value.hero * 0.12,
  '--hero-tilt': `${-9 * crush.value.hero}deg`,
  '--hero-opacity': 1 - crush.value.hero * 0.58,
  '--hero-blur': `${3 * crush.value.hero}px`,
  '--hero-saturate': 1.18 - crush.value.hero * 0.28,
  '--hero-contrast': 1.08 - crush.value.hero * 0.08,
  '--hero-stage-ry': `${-8 + crush.value.hero * 6}deg`,
  '--hero-stage-rx': `${3 - crush.value.hero * 11}deg`,
  '--hero-stage-y': `${28 * crush.value.hero}px`,
  '--hero-stage-scale': 1 - crush.value.hero * 0.08,
  '--hero-panel-y': `${26 * crush.value.hero}px`,
  '--hero-panel-scale': 1 - crush.value.hero * 0.06,
  '--hero-panel-opacity': 1 - crush.value.hero * 0.72,
  '--hero-signal-x': `${-36 * crush.value.hero}px`,
  '--hero-signal-opacity': 1 - crush.value.hero * 0.62,
  '--hero-veil-y': `${-34 * crush.value.hero}px`,
  '--hero-veil-opacity': 0.22 + crush.value.hero * 0.78,
  '--ribbon-y': `${-34 * crush.value.hero}px`,
  '--ribbon-scale': 1 - crush.value.hero * 0.035,
  '--ribbon-opacity': 1 - crush.value.hero * 0.24,
  '--feed-crush': crush.value.feed,
  '--feed-y': `${-62 * crush.value.feed}px`,
  '--feed-scale': 1 - crush.value.feed * 0.075,
  '--feed-tilt': `${-6 * crush.value.feed}deg`,
  '--feed-opacity': 1 - crush.value.feed * 0.48,
  '--feed-blur': `${2.4 * crush.value.feed}px`,
  '--case-crush': crush.value.cases,
  '--case-y': `${-58 * crush.value.cases}px`,
  '--case-scale': 1 - crush.value.cases * 0.072,
  '--case-tilt': `${-6 * crush.value.cases}deg`,
  '--case-opacity': 1 - crush.value.cases * 0.46,
  '--case-blur': `${2.2 * crush.value.cases}px`,
  '--case-veil-opacity': 0.18 + crush.value.cases * 0.82,
  '--case-list-y': `${26 * crush.value.cases}px`,
  '--case-list-opacity': 1 - crush.value.cases * 0.22,
  '--lower-y': `${48 - crush.value.cases * 48}px`,
  '--lower-scale': 0.985 + crush.value.cases * 0.015,
  '--lower-opacity': 0.42 + crush.value.cases * 0.58,
  '--feed-veil-y': `${-28 * crush.value.feed}px`,
  '--feed-veil-opacity': 0.18 + crush.value.feed * 0.82,
  '--stack-crush': crush.value.stack,
  '--books-y': `${44 - crush.value.stack * 22}px`,
  '--books-rotate': `${-0.8 * crush.value.stack}deg`,
  '--about-y': `${14 - crush.value.stack * 30}px`,
  '--about-rotate': `${0.8 * crush.value.stack}deg`
}))

const activeZoneIndex = computed(() => zones.findIndex((zone) => zone.key === activeZone.value))

const activeSignal = computed(() => {
  const signals = {
    hero: {
      title: 'CORE ONLINE',
      copy: '首屏实验台正在聚合模型、接口、数据和界面。'
    },
    articles: {
      title: 'FEED STREAMING',
      copy: `${filteredPosts.value.length} 条文章进程已载入，当前线程：${selectedPost.value.title}`
    },
    projects: {
      title: 'CASE STACK ARMED',
      copy: `${projects.length} 个项目卷宗可展开，点击会进入完整 case file。`
    },
    books: {
      title: 'KNOWLEDGE CACHE',
      copy: selectedBook.value ? `已加载：${selectedBook.value}` : `${bookNotes.length} 个知识依赖等待加载。`
    },
    about: {
      title: 'PROFILE MATRIX',
      copy: '能力矩阵已同步：前端系统、API 架构、Agent、RAG 和数据可靠性。'
    }
  }

  return signals[activeZone.value] || signals.hero
})

onMounted(() => {
  if (typeof window === 'undefined') return
  updateActiveZone()
  window.addEventListener('scroll', updateActiveZone, { passive: true })
  window.addEventListener('resize', updateActiveZone)
})

onBeforeUnmount(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('scroll', updateActiveZone)
  window.removeEventListener('resize', updateActiveZone)
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
  if (target === 'hero') {
    uni.pageScrollTo({
      scrollTop: 0,
      duration: 260
    })
    return
  }

  uni.pageScrollTo({
    selector: `#${target}`,
    duration: 260
  })
}

function selectTag(tag) {
  activeTag.value = tag
  activeTopic.value = 'All'
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
  activeTopic.value = 'All'
  activeTag.value = ''
}

function updateField(clientX, clientY, target) {
  if (!target?.getBoundingClientRect) return
  const rect = target.getBoundingClientRect()
  cursorX.value = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))
  cursorY.value = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100))
}

function trackPointer(event) {
  updateField(event.clientX, event.clientY, event.currentTarget)
}

function trackTouch(event) {
  const touch = event.touches?.[0]
  if (!touch) return
  updateField(touch.clientX, touch.clientY, event.currentTarget)
}

function updateActiveZone() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return
  updateScrollInterlocks()

  const viewportAnchor = window.innerHeight * 0.38
  let nextZone = 'hero'
  let closest = Number.POSITIVE_INFINITY

  zones.forEach((zone) => {
    const element = zone.key === 'hero' ? document.querySelector('.hero') : document.getElementById(zone.target)
    if (!element) return

    const rect = element.getBoundingClientRect()
    const distance = Math.abs(rect.top - viewportAnchor)

    if (rect.top <= window.innerHeight * 0.72 && rect.bottom >= window.innerHeight * 0.18 && distance < closest) {
      closest = distance
      nextZone = zone.key
    }
  })

  activeZone.value = nextZone
}

function getPushProgress(selector) {
  const element = document.querySelector(selector)
  if (!element) return 0

  const rect = element.getBoundingClientRect()
  const start = window.innerHeight * 0.86
  const range = window.innerHeight * 0.62
  return clamp((start - rect.top) / range)
}

function clamp(value) {
  return Math.min(1, Math.max(0, value))
}

function updateScrollInterlocks() {
  crush.value = {
    hero: getPushProgress('#articles'),
    feed: getPushProgress('#projects'),
    cases: getPushProgress('.lower-grid'),
    stack: getPushProgress('#about')
  }
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
@property --ring-angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

@property --scan-depth {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 0%;
}

@property --cursor-x {
  syntax: "<percentage>";
  inherits: true;
  initial-value: 18%;
}

@property --cursor-y {
  syntax: "<percentage>";
  inherits: true;
  initial-value: 32%;
}

.home {
  position: relative;
  width: min(1240px, calc(100vw - 40px));
  margin: 0 auto;
  padding: clamp(24px, 4vw, 52px) 0 72px;
  --lab-ink: oklch(11% 0.028 260);
  --lab-panel: oklch(18% 0.045 246);
  --lab-grid: oklch(72% 0.14 194);
  --lab-flare: oklch(72% 0.18 332);
}

.home::before,
.home::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}

.home::before {
  background:
    conic-gradient(from var(--ring-angle) at 80% 12%, transparent 0 58%, oklch(72% 0.18 332 / 0.22), transparent 72% 100%),
    radial-gradient(circle at var(--cursor-x) var(--cursor-y), oklch(72% 0.14 194 / 0.24), transparent 30rem);
  filter: blur(10px);
  animation: ring-field 11s linear infinite;
  transition: background 220ms var(--ease-out);
}

.home::after {
  background:
    linear-gradient(90deg, oklch(72% 0.14 194 / 0.1) 1px, transparent 1px),
    linear-gradient(0deg, oklch(72% 0.14 194 / 0.08) 1px, transparent 1px),
    linear-gradient(135deg, oklch(10% 0.03 260), oklch(16% 0.045 238));
  background-size: 96px 96px, 96px 96px, auto;
  opacity: 0.82;
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
  width: 44px;
  height: 38px;
  border: 1px solid oklch(72% 0.14 194 / 0.58);
  border-radius: 6px;
  background:
    linear-gradient(135deg, oklch(72% 0.14 194 / 0.18), oklch(72% 0.18 332 / 0.18)),
    oklch(12% 0.035 260);
  color: oklch(91% 0.025 230);
  font-family: var(--font-display);
  font-size: 14px;
  box-shadow:
    0 0 24px oklch(72% 0.14 194 / 0.28),
    inset 0 0 18px oklch(72% 0.18 332 / 0.12);
}

.brand-name {
  font-family: var(--font-display);
  font-size: 18px;
  letter-spacing: 0.08em;
  color: oklch(92% 0.018 238);
}

.nav-links {
  gap: clamp(16px, 3vw, 34px);
  font-size: 15px;
}

.nav-links button {
  padding: 0;
  border: 0;
  background: transparent;
  color: oklch(74% 0.05 236);
  cursor: pointer;
  letter-spacing: 0.08em;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

.sync-bus {
  position: fixed;
  right: max(16px, calc((100vw - 1240px) / 2 - 126px));
  top: 20vh;
  z-index: 12;
  display: grid;
  gap: 8px;
  width: 154px;
  padding: 14px;
  border: 1px solid oklch(72% 0.14 194 / 0.34);
  border-radius: 8px;
  background:
    linear-gradient(135deg, oklch(12% 0.034 260 / 0.94), oklch(18% 0.05 238 / 0.92)),
    var(--lab-ink);
  box-shadow:
    0 26px 58px oklch(6% 0.03 260 / 0.48),
    inset 0 0 0 1px oklch(72% 0.14 194 / 0.08);
}

.sync-bus::before,
.sync-bus::after {
  content: "";
  position: absolute;
  pointer-events: none;
}

.sync-bus::before {
  left: 22px;
  top: 48px;
  bottom: 110px;
  width: 1px;
  background: linear-gradient(to bottom, oklch(72% 0.14 194 / 0.1), oklch(72% 0.14 194 / 0.7), oklch(72% 0.14 194 / 0.1));
}

.sync-bus::after {
  left: 17px;
  top: var(--bus-dot-top);
  width: 11px;
  height: 11px;
  border-radius: 999px;
  background: oklch(72% 0.18 332);
  box-shadow:
    0 0 18px oklch(72% 0.18 332 / 0.7),
    0 0 34px oklch(72% 0.14 194 / 0.42);
  transition: top 420ms var(--ease-snap);
}

.sync-label,
.bus-readout text,
.sync-bus button {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

.sync-label {
  color: oklch(70% 0.09 194);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.sync-bus button {
  position: relative;
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  min-height: 38px;
  padding: 0 8px 0 0;
  border: 0;
  background: transparent;
  color: oklch(68% 0.05 236);
  text-align: left;
  cursor: pointer;
  transition: color 220ms var(--ease-out), transform 220ms var(--ease-out);
}

.sync-bus button text:first-child {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border: 1px solid oklch(72% 0.14 194 / 0.22);
  border-radius: 999px;
  background: oklch(10% 0.03 260);
  color: oklch(74% 0.09 194);
  font-size: 10px;
}

.sync-bus button.active {
  color: oklch(94% 0.018 238);
  transform: translateX(5px);
}

.sync-bus button.active text:first-child {
  border-color: oklch(72% 0.18 332 / 0.7);
  background: oklch(72% 0.18 332);
  color: oklch(10% 0.03 260);
  box-shadow: 0 0 18px oklch(72% 0.18 332 / 0.56);
}

.bus-readout {
  display: grid;
  gap: 8px;
  margin-top: 6px;
  padding-top: 12px;
  border-top: 1px solid oklch(72% 0.14 194 / 0.18);
}

.bus-readout text:first-child {
  color: oklch(72% 0.18 332);
  font-size: 11px;
  letter-spacing: 0.08em;
}

.bus-readout text:last-child {
  color: oklch(76% 0.05 236);
  font-size: 11px;
  line-height: 1.55;
}

.journey-rail {
  position: fixed;
  left: max(18px, calc((100vw - 1180px) / 2 - 76px));
  top: 34vh;
  z-index: 8;
  display: grid;
  gap: 10px;
}

.journey-rail::before {
  content: "";
  position: absolute;
  left: 7px;
  top: 11px;
  bottom: 11px;
  width: 1px;
  background: var(--line);
}

.journey-rail button {
  position: relative;
  display: grid;
  grid-template-columns: 16px auto;
  gap: 9px;
  align-items: center;
  min-height: 28px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--ink-faint);
  font-size: 12px;
  cursor: pointer;
  transition: color var(--motion-fast) var(--ease-out), transform var(--motion-fast) var(--ease-out);
}

.rail-dot {
  width: 15px;
  height: 15px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--paper);
  transition: background var(--motion-fast) var(--ease-out), border-color var(--motion-fast) var(--ease-out), transform var(--motion-fast) var(--ease-out);
}

.journey-rail button.active {
  color: var(--seal);
  transform: translateX(4px);
}

.journey-rail button.active .rail-dot {
  border-color: var(--seal);
  background: var(--seal);
  transform: scale(1.08);
}

.hero {
  position: relative;
  position: sticky;
  top: 18px;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 0.88fr) minmax(420px, 1fr);
  gap: clamp(32px, 5vw, 70px);
  align-items: center;
  min-height: clamp(660px, 86vh, 860px);
  padding: clamp(28px, 5vw, 58px);
  border: 1px solid oklch(72% 0.14 194 / 0.38);
  border-radius: 8px;
  overflow: hidden;
  background:
    linear-gradient(110deg, oklch(11% 0.028 260), oklch(18% 0.05 238) 48%, oklch(13% 0.04 288)),
    var(--lab-ink);
  color: oklch(94% 0.018 238);
  box-shadow:
    0 34px 80px oklch(7% 0.03 260 / 0.54),
    inset 0 0 0 1px oklch(72% 0.14 194 / 0.08);
  transform:
    perspective(1400px)
    translateY(var(--hero-y))
    scale(var(--hero-scale))
    rotateX(var(--hero-tilt));
  transform-origin: center top;
  opacity: var(--hero-opacity);
  filter:
    blur(var(--hero-blur))
    saturate(var(--hero-saturate))
    contrast(var(--hero-contrast));
  will-change: transform, opacity, filter;
}

.hero.engaged {
  box-shadow:
    0 0 0 1px oklch(72% 0.18 332 / 0.42),
    0 36px 90px oklch(72% 0.14 194 / 0.18),
    inset 0 0 70px oklch(72% 0.14 194 / 0.1);
}

.hero.engaged .orbit-core {
  animation: core-pulse 1.8s var(--ease-snap) infinite alternate;
}

.hero .lab-stage,
.hero .queue-panel,
.hero .signal-stack {
  transform-origin: center bottom;
  transition: filter 160ms linear;
}

.hero .lab-stage {
  animation: none;
  transform:
    rotateY(var(--hero-stage-ry))
    rotateX(var(--hero-stage-rx))
    translateY(var(--hero-stage-y))
    scale(var(--hero-stage-scale));
}

.hero .queue-panel {
  opacity: var(--hero-panel-opacity);
  transform: translateY(var(--hero-panel-y)) scale(var(--hero-panel-scale));
}

.hero .signal-stack {
  opacity: var(--hero-signal-opacity);
  transform: translateX(var(--hero-signal-x));
}

.hero::before,
.hero::after {
  content: "";
  position: absolute;
  pointer-events: none;
}

.hero::before {
  inset: 0;
  background:
    linear-gradient(90deg, transparent 0 46%, oklch(75% 0.14 194 / 0.16) 50%, transparent 54% 100%),
    repeating-linear-gradient(0deg, oklch(90% 0.02 238 / 0.045) 0 1px, transparent 1px 7px);
  transform: translateX(-68%);
  animation: lab-scan 4.8s var(--ease-snap) infinite;
}

.hero::after {
  inset: 14px;
  border: 1px solid oklch(76% 0.14 194 / 0.22);
  clip-path: polygon(0 0, 28% 0, 28% 1px, 72% 1px, 72% 0, 100% 0, 100% 100%, 74% 100%, 74% calc(100% - 1px), 26% calc(100% - 1px), 26% 100%, 0 100%);
}

.hero-copy {
  position: relative;
  z-index: 2;
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
  color: var(--lab-grid);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.headline {
  display: block;
  max-width: 820px;
  font-family: var(--font-display);
  font-size: clamp(52px, 8.4vw, 112px);
  line-height: 0.9;
  letter-spacing: 0;
  color: oklch(94% 0.018 238);
  text-shadow:
    2px 0 oklch(62% 0.18 332 / 0.45),
    -2px 0 oklch(71% 0.14 194 / 0.36),
    0 18px 36px oklch(6% 0.02 260 / 0.6);
  animation: title-glitch 6s steps(1, end) infinite;
}

.intro {
  display: block;
  max-width: 640px;
  margin-top: 28px;
  color: oklch(79% 0.05 236);
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
  border: 1px solid oklch(74% 0.12 194 / 0.65);
  border-radius: 7px;
  background: oklch(74% 0.14 194);
  color: var(--lab-ink);
  cursor: pointer;
  box-shadow: 0 0 28px oklch(71% 0.14 194 / 0.22);
  transition: transform 220ms var(--ease-out), background 220ms var(--ease-out), color 220ms var(--ease-out), box-shadow 220ms var(--ease-out);
}

.hero-actions button:last-child,
.about-actions button:first-child {
  background: transparent;
  color: oklch(91% 0.02 238);
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
  border: 1px solid oklch(70% 0.12 194 / 0.4);
  background: oklch(16% 0.04 252 / 0.72);
  color: oklch(78% 0.05 236);
  transition: background 220ms var(--ease-out), color 220ms var(--ease-out), transform 220ms var(--ease-out);
}

.filter.active {
  background: var(--mineral);
  color: oklch(10% 0.03 260);
  transform: translateY(-1px);
}

.hero-media {
  position: relative;
  min-height: 590px;
  transform-style: preserve-3d;
  perspective: 1100px;
}

.lab-stage {
  position: relative;
  min-height: 590px;
  border: 1px solid oklch(66% 0.12 194 / 0.45);
  border-radius: 8px;
  overflow: hidden;
  transform: rotateY(-8deg) rotateX(3deg);
  background:
    radial-gradient(ellipse at 20% 0%, oklch(62% 0.18 332 / 0.2), transparent 34%),
    linear-gradient(135deg, oklch(10% 0.03 260), oklch(20% 0.06 238));
  box-shadow:
    24px 34px 70px oklch(6% 0.02 260 / 0.55),
    inset 0 0 0 1px oklch(92% 0.02 238 / 0.05);
  animation: lab-float 6s var(--ease-snap) infinite alternate;
}

.desk-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 0;
  display: block;
  opacity: 0.34;
  filter: saturate(0.7) contrast(1.22) hue-rotate(44deg);
  mix-blend-mode: screen;
  box-shadow: none;
  animation: paper-settle 900ms var(--ease-out) both;
}

.lab-grid {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, oklch(72% 0.14 194 / 0.16) 1px, transparent 1px),
    linear-gradient(0deg, oklch(72% 0.14 194 / 0.12) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: linear-gradient(to bottom, transparent, rgb(1 1 1) 18%, rgb(1 1 1) 82%, transparent);
  animation: grid-drift 9s linear infinite;
}

.scan-beam {
  position: absolute;
  inset: -20% 44% -20% 44%;
  background: linear-gradient(to right, transparent, oklch(78% 0.13 158 / 0.34), transparent);
  filter: blur(9px);
  animation: beam-sweep 3.6s var(--ease-snap) infinite;
}

.code-slab {
  position: absolute;
  display: grid;
  gap: 10px;
  padding: 18px;
  border: 1px solid oklch(70% 0.14 194 / 0.45);
  border-radius: 8px;
  background: oklch(18% 0.03 122 / 0.86);
  color: oklch(78% 0.13 158);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px;
  box-shadow: 0 18px 38px oklch(8% 0.02 120 / 0.36);
}

.slab-a {
  left: 28px;
  top: 34px;
  width: 240px;
  transform: rotate(-3deg);
  animation: slab-a 5.4s var(--ease-snap) infinite alternate;
}

.slab-b {
  right: 26px;
  bottom: 120px;
  width: 260px;
  transform: rotate(2.5deg);
  color: oklch(71% 0.18 332);
  border-color: oklch(70% 0.18 332 / 0.5);
  animation: slab-b 5s var(--ease-snap) infinite alternate;
}

.orbit-board {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 260px;
  height: 260px;
  transform: translate(-50%, -50%);
  border: 1px dashed oklch(76% 0.14 194 / 0.48);
  border-radius: 999px;
  animation: orbit-spin 18s linear infinite;
}

.orbit-core,
.orbit-node {
  position: absolute;
  display: grid;
  place-items: center;
  border-radius: 999px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

.orbit-core {
  left: 50%;
  top: 50%;
  width: 86px;
  height: 86px;
  transform: translate(-50%, -50%);
  background: oklch(71% 0.14 194);
  color: var(--lab-ink);
  font-size: 28px;
  box-shadow: 0 0 46px oklch(71% 0.14 194 / 0.42);
}

.orbit-node {
  width: 54px;
  height: 54px;
  background: oklch(20% 0.032 118);
  color: oklch(92% 0.02 110);
  border: 1px solid oklch(70% 0.12 194 / 0.5);
  font-size: 12px;
}

.node-a {
  left: 10px;
  top: 38px;
}

.node-b {
  right: 0;
  top: 88px;
}

.node-c {
  left: 90px;
  bottom: -12px;
}

.signal-stack {
  position: absolute;
  left: clamp(-18px, -2vw, -8px);
  bottom: 28px;
  display: grid;
  gap: 10px;
  width: min(260px, calc(100% - 38px));
  z-index: 3;
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
  background: oklch(20% 0.032 120 / 0.92);
  color: oklch(92% 0.02 110);
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
  color: oklch(84% 0.04 120);
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
  background: oklch(21% 0.034 118 / 0.92);
  color: oklch(92% 0.02 110);
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
  color: oklch(94% 0.018 98);
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

.thread-map {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.68fr) minmax(320px, 1fr);
  gap: clamp(24px, 5vw, 60px);
  align-items: center;
  margin-top: clamp(42px, 7vw, 82px);
  padding: clamp(22px, 4vw, 34px);
  border: 1px solid var(--line);
  border-radius: 8px;
  background:
    linear-gradient(110deg, oklch(93% 0.019 88 / 0.92), oklch(88% 0.035 154 / 0.56)),
    var(--paper);
  box-shadow: 0 18px 42px oklch(29% 0.03 90 / 0.08);
  animation: rise-in 780ms var(--ease-out) 220ms both;
}

.thread-map::before {
  content: "";
  position: absolute;
  left: clamp(22px, 4vw, 34px);
  right: clamp(22px, 4vw, 34px);
  top: 50%;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--line), var(--seal), var(--line), transparent);
  pointer-events: none;
}

.thread-copy {
  position: relative;
  z-index: 1;
}

.thread-title,
.thread-desc {
  display: block;
}

.thread-title {
  margin-top: 8px;
  font-family: var(--font-display);
  font-size: clamp(30px, 4vw, 44px);
  line-height: 1.14;
}

.thread-desc {
  max-width: 42ch;
  margin-top: 14px;
  color: var(--ink-muted);
  line-height: 1.75;
}

.thread-lane {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.thread-lane button {
  min-height: 116px;
  padding: 18px;
  border: 1px solid oklch(75% 0.027 88);
  border-radius: 8px;
  background: oklch(95% 0.015 90 / 0.92);
  color: var(--ink);
  text-align: left;
  box-shadow: 0 12px 24px oklch(28% 0.03 92 / 0.08);
  cursor: pointer;
  transition: transform var(--motion-mid) var(--ease-out), background var(--motion-mid) var(--ease-out), box-shadow var(--motion-mid) var(--ease-out);
}

.thread-lane button:nth-child(2) {
  transform: translateY(-16px);
}

.thread-lane button:nth-child(3) {
  transform: translateY(12px);
}

.thread-lane text:first-child {
  display: block;
  color: var(--seal);
  font-size: 12px;
  font-weight: 700;
}

.thread-lane text:last-child {
  display: block;
  margin-top: 12px;
  font-family: var(--font-display);
  font-size: clamp(19px, 2.2vw, 27px);
  line-height: 1.22;
}

.content-grid {
  position: relative;
  z-index: 3;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: clamp(34px, 6vw, 78px);
  margin-top: clamp(-96px, -7vw, -42px);
  padding-top: clamp(82px, 10vw, 132px);
  align-items: start;
  transform:
    perspective(1300px)
    translateY(var(--feed-y))
    scale(var(--feed-scale))
    rotateX(var(--feed-tilt));
  transform-origin: center top;
  opacity: var(--feed-opacity);
  filter: blur(var(--feed-blur));
  will-change: transform, opacity, filter;
}

.content-grid::before {
  content: "";
  position: absolute;
  left: -4vw;
  right: -4vw;
  top: 0;
  height: clamp(120px, 16vw, 190px);
  z-index: -1;
  background:
    linear-gradient(to bottom, transparent, oklch(10% 0.03 260 / 0.96) 42%, oklch(10% 0.03 260 / 0.86)),
    radial-gradient(circle at 50% 16%, oklch(72% 0.18 332 / 0.18), transparent 42%);
  transform: translateY(var(--hero-veil-y));
  opacity: var(--hero-veil-opacity);
  pointer-events: none;
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

.tech-ticker {
  position: relative;
  display: flex;
  gap: clamp(18px, 4vw, 42px);
  margin: clamp(34px, 6vw, 72px) 0 0;
  padding: 12px 0;
  overflow: hidden;
  border-top: 1px solid oklch(24% 0.04 125 / 0.32);
  border-bottom: 1px solid oklch(24% 0.04 125 / 0.32);
  color: oklch(22% 0.035 124);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: clamp(12px, 1.4vw, 15px);
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.sync-ribbon {
  position: relative;
  display: grid;
  grid-template-columns: minmax(220px, 0.42fr) minmax(0, 1fr);
  gap: clamp(16px, 3vw, 32px);
  align-items: center;
  margin: clamp(28px, 5vw, 58px) 0 0;
  padding: clamp(16px, 3vw, 22px);
  border: 1px solid oklch(72% 0.14 194 / 0.32);
  border-radius: 8px;
  overflow: hidden;
  background:
    linear-gradient(100deg, oklch(12% 0.034 260 / 0.9), oklch(18% 0.05 238 / 0.78)),
    var(--lab-panel);
  box-shadow: 0 22px 54px oklch(6% 0.03 260 / 0.28);
}

.sync-ribbon::before,
.sync-ribbon::after {
  content: "";
  position: absolute;
  pointer-events: none;
}

.sync-ribbon::before {
  inset: 0;
  background: linear-gradient(100deg, transparent 0 42%, oklch(72% 0.14 194 / 0.18) 49%, transparent 56% 100%);
  transform: translateX(-88%);
  animation: ribbon-sweep 3.8s var(--ease-snap) infinite;
}

.sync-ribbon::after {
  left: 22px;
  right: 22px;
  top: 50%;
  height: 1px;
  background: linear-gradient(90deg, oklch(72% 0.18 332), oklch(72% 0.14 194), transparent);
  opacity: 0.45;
}

.ribbon-core,
.ribbon-wave {
  position: relative;
  z-index: 1;
}

.ribbon-core {
  display: grid;
  gap: 8px;
}

.ribbon-core text:first-child {
  color: oklch(72% 0.18 332);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px;
  letter-spacing: 0.08em;
}

.ribbon-core text:last-child {
  color: oklch(82% 0.045 236);
  line-height: 1.65;
}

.ribbon-wave {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
}

.ribbon-wave text {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 52px;
  border: 1px solid oklch(72% 0.14 194 / 0.22);
  border-radius: 7px;
  color: oklch(68% 0.05 236);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
  overflow: hidden;
  transition: transform 320ms var(--ease-snap), color 320ms var(--ease-out), border-color 320ms var(--ease-out);
}

.ribbon-wave text::before {
  content: "";
  position: absolute;
  inset: auto 8px 8px;
  height: 3px;
  border-radius: 999px;
  background: oklch(72% 0.14 194);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 360ms var(--ease-snap);
}

.ribbon-wave text.active {
  color: oklch(94% 0.018 238);
  border-color: oklch(72% 0.18 332 / 0.62);
  transform: translateY(-6px);
  box-shadow: 0 0 26px oklch(72% 0.18 332 / 0.18);
}

.ribbon-wave text.active::before {
  transform: scaleX(1);
  background: linear-gradient(90deg, oklch(72% 0.18 332), oklch(72% 0.14 194));
}

.tech-ticker text {
  flex: 0 0 auto;
  animation: ticker-run 16s linear infinite;
}

.tech-ticker text:nth-child(2n) {
  color: var(--seal);
}

.lab-content {
  position: relative;
}

.lab-content.engaged .article-console,
.showcase-section.engaged,
.books-panel.engaged,
.about-panel.engaged {
  border-color: oklch(72% 0.18 332 / 0.58);
  box-shadow:
    0 0 0 1px oklch(72% 0.18 332 / 0.22),
    0 28px 76px oklch(72% 0.14 194 / 0.16),
    inset 0 0 58px oklch(72% 0.18 332 / 0.08);
}

.lab-content.engaged .article-console::before,
.showcase-section.engaged::after,
.books-panel.engaged::after,
.about-panel.engaged::after {
  animation-duration: 2.2s;
}

.article-section {
  position: relative;
}

.article-section::before {
  content: "";
  position: absolute;
  left: -24px;
  top: 82px;
  width: 118px;
  height: 118px;
  border: 1px solid oklch(66% 0.14 194 / 0.34);
  border-radius: 999px;
  background:
    radial-gradient(circle, oklch(72% 0.14 194 / 0.16), transparent 58%),
    conic-gradient(from 20deg, transparent, oklch(72% 0.14 194 / 0.32), transparent 62%);
  animation: dial-spin 12s linear infinite;
  pointer-events: none;
}

.article-console {
  position: relative;
  overflow: hidden;
  border: 1px solid oklch(38% 0.05 132 / 0.72);
  border-radius: 8px;
  background:
    radial-gradient(circle at 0% 0%, oklch(71% 0.18 332 / 0.16), transparent 31%),
    radial-gradient(circle at 90% 12%, oklch(72% 0.14 194 / 0.16), transparent 28%),
    linear-gradient(135deg, oklch(15% 0.03 118), oklch(22% 0.04 142) 58%, oklch(18% 0.032 110));
  color: oklch(92% 0.02 106);
  box-shadow: 0 30px 70px oklch(17% 0.03 115 / 0.28);
}

.article-console::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, transparent, oklch(74% 0.14 194 / 0.12), transparent),
    repeating-linear-gradient(0deg, oklch(92% 0.02 110 / 0.035) 0 1px, transparent 1px 8px);
  transform: translateX(-84%);
  animation: console-scan 5.8s var(--ease-snap) infinite;
  pointer-events: none;
}

.console-topbar {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 80px minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
  min-height: 46px;
  padding: 0 16px;
  border-bottom: 1px solid oklch(72% 0.12 194 / 0.2);
  color: oklch(78% 0.08 150);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
}

.console-lights {
  display: flex;
  gap: 8px;
}

.console-lights text {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: oklch(70% 0.18 332);
  box-shadow: 0 0 16px oklch(70% 0.18 332 / 0.5);
}

.console-lights text:nth-child(2) {
  background: oklch(84% 0.16 82);
  box-shadow: 0 0 16px oklch(84% 0.16 82 / 0.42);
}

.console-lights text:nth-child(3) {
  background: oklch(72% 0.14 194);
  box-shadow: 0 0 16px oklch(72% 0.14 194 / 0.5);
}

.article-console .post-row {
  position: relative;
  z-index: 1;
  grid-template-columns: 76px minmax(0, 1fr) 38px;
  min-height: 154px;
  padding: clamp(18px, 3vw, 26px);
  border-top: 1px solid oklch(72% 0.12 194 / 0.16);
  background: linear-gradient(90deg, oklch(24% 0.04 132 / 0.72), transparent 74%);
  color: oklch(92% 0.018 100);
  overflow: hidden;
  transform-origin: 50% 50%;
}

.article-console .post-row:nth-of-type(2n) {
  margin-left: clamp(0px, 2vw, 18px);
  background: linear-gradient(90deg, oklch(22% 0.04 118 / 0.38), oklch(28% 0.055 142 / 0.58));
}

.article-console .post-row:nth-of-type(3n) {
  margin-left: 0;
}

.article-console .post-row::before {
  inset: auto auto 0 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, var(--seal), oklch(72% 0.14 194), transparent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 360ms var(--ease-out);
}

.article-console .post-row::after {
  content: "";
  position: absolute;
  inset: 8px;
  border: 1px solid oklch(72% 0.14 194 / 0);
  border-radius: 6px;
  transition: border-color 260ms var(--ease-out), transform 260ms var(--ease-out);
  pointer-events: none;
}

.article-console .post-row.selected {
  color: oklch(76% 0.14 194);
}

.article-console .post-row.selected::before,
.article-console .post-row:hover::before {
  right: auto;
  transform: scaleX(1);
}

.article-console .post-row.selected::after,
.article-console .post-row:hover::after {
  border-color: oklch(72% 0.14 194 / 0.42);
  transform: translateY(-2px);
}

.article-console .post-date {
  align-self: start;
  display: grid;
  place-items: center;
  width: 60px;
  min-height: 72px;
  gap: 4px;
  border: 1px solid oklch(72% 0.14 194 / 0.32);
  border-radius: 7px;
  background: oklch(17% 0.03 116 / 0.72);
  color: oklch(72% 0.14 194);
}

.article-console .post-date text:first-child {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
}

.article-console .post-date text:last-child {
  font-size: 30px;
}

.post-command {
  display: block;
  margin-bottom: 8px;
  color: oklch(75% 0.14 158);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
}

.article-console .post-topline {
  color: oklch(82% 0.12 86);
}

.article-console .post-desc {
  color: oklch(78% 0.036 115);
}

.article-console .post-tags text {
  border: 1px solid oklch(72% 0.12 194 / 0.28);
  background: oklch(18% 0.03 120 / 0.82);
  color: oklch(86% 0.05 124);
}

.article-console .post-arrow {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid oklch(72% 0.14 194 / 0.4);
  border-radius: 999px;
  color: oklch(72% 0.14 194);
}

.aside-block,
.subscribe {
  position: relative;
  overflow: hidden;
  border-color: oklch(34% 0.04 125 / 0.35);
  background:
    linear-gradient(135deg, oklch(20% 0.032 118), oklch(28% 0.044 140)),
    var(--lab-panel);
  color: oklch(91% 0.02 106);
  box-shadow: 0 20px 46px oklch(18% 0.03 110 / 0.2);
}

.aside-block::after,
.subscribe::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg, transparent 0 38%, oklch(72% 0.14 194 / 0.12) 46%, transparent 54% 100%);
  transform: translateX(-76%);
  animation: side-sweep 7s var(--ease-snap) infinite;
  pointer-events: none;
}

.aside-label {
  color: oklch(75% 0.14 194);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

.reading {
  background:
    radial-gradient(circle at 100% 0%, oklch(71% 0.18 332 / 0.22), transparent 36%),
    linear-gradient(135deg, oklch(18% 0.03 116), oklch(25% 0.045 142));
}

.queue-item {
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  border-bottom-color: oklch(72% 0.14 194 / 0.18);
  color: oklch(84% 0.036 118);
}

.queue-prefix {
  color: oklch(71% 0.18 332);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
}

.tag-cloud button {
  border-color: oklch(72% 0.14 194 / 0.32);
  background: oklch(18% 0.03 120 / 0.48);
  color: oklch(84% 0.04 120);
  transition: transform 220ms var(--ease-out), background 220ms var(--ease-out), color 220ms var(--ease-out);
}

.tag-cloud button.active {
  border-color: oklch(75% 0.14 194);
  background: oklch(72% 0.14 194);
  color: oklch(17% 0.03 116);
}

.clear-tag {
  color: oklch(72% 0.14 158);
}

.subscribe-copy {
  color: oklch(80% 0.035 118);
}

.subscribe-row input {
  border-color: oklch(72% 0.14 194 / 0.3);
  background: oklch(15% 0.03 116);
  color: oklch(92% 0.018 100);
}

.subscribe-row button {
  background: oklch(71% 0.18 332);
  color: oklch(18% 0.03 116);
}

.showcase-section {
  position: relative;
  padding: clamp(24px, 5vw, 48px);
  border: 1px solid oklch(36% 0.05 126 / 0.52);
  border-radius: 8px;
  overflow: hidden;
  background:
    linear-gradient(120deg, oklch(16% 0.03 112), oklch(24% 0.046 145) 54%, oklch(18% 0.03 116)),
    var(--lab-ink);
  color: oklch(92% 0.018 100);
  box-shadow: 0 34px 84px oklch(17% 0.03 115 / 0.28);
}

.showcase-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, oklch(72% 0.14 194 / 0.09) 1px, transparent 1px),
    linear-gradient(0deg, oklch(72% 0.14 194 / 0.07) 1px, transparent 1px);
  background-size: 48px 48px;
  animation: grid-drift 14s linear infinite;
  pointer-events: none;
}

.showcase-section .section-heading,
.project-list {
  position: relative;
  z-index: 1;
}

.showcase-section .section-kicker {
  color: oklch(75% 0.14 194);
}

.project-list {
  gap: 18px;
  transform-style: preserve-3d;
}

.project-row {
  grid-template-columns: 92px minmax(220px, 0.72fr) minmax(160px, 0.4fr) 130px;
  min-height: 164px;
  border-color: oklch(72% 0.14 194 / 0.28);
  background:
    linear-gradient(135deg, oklch(24% 0.04 132 / 0.92), oklch(18% 0.03 116 / 0.92)),
    oklch(20% 0.034 120);
  color: oklch(92% 0.018 100);
  box-shadow: 0 24px 54px oklch(8% 0.02 116 / 0.32);
  transform: rotateX(0deg) rotateY(0deg);
  overflow: hidden;
}

.project-row:nth-child(2n) {
  margin-left: clamp(18px, 5vw, 70px);
  transform: rotate(-1deg);
}

.project-row:nth-child(3n) {
  margin-right: clamp(14px, 6vw, 90px);
  transform: rotate(1deg);
}

.project-row::before,
.project-row::after {
  content: "";
  position: absolute;
  pointer-events: none;
}

.project-row::before {
  inset: 12px;
  border: 1px solid oklch(72% 0.14 194 / 0.16);
  border-radius: 6px;
}

.project-row::after {
  inset: 0;
  background: linear-gradient(100deg, transparent, oklch(71% 0.18 332 / 0.18), transparent);
  transform: translateX(-88%) skewX(-18deg);
  transition: transform 560ms var(--ease-out);
}

.project-index {
  display: grid;
  place-items: center;
  width: 68px;
  min-height: 88px;
  border: 1px solid oklch(72% 0.14 194 / 0.35);
  border-radius: 7px;
  background: oklch(15% 0.03 116 / 0.72);
  color: oklch(72% 0.14 194);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

.project-index text:first-child {
  font-size: 11px;
}

.project-index text:last-child {
  font-family: var(--font-display);
  font-size: 30px;
}

.project-core {
  display: grid;
  gap: 8px;
}

.project-status {
  color: oklch(78% 0.14 194);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

.project-desc {
  color: oklch(80% 0.035 118);
}

.project-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.project-stack text {
  padding: 7px 9px;
  border: 1px solid oklch(72% 0.14 194 / 0.26);
  border-radius: 999px;
  background: oklch(17% 0.03 116 / 0.72);
  color: oklch(85% 0.05 120);
  font-size: 12px;
}

.project-arrow {
  display: grid;
  justify-items: end;
  align-content: space-between;
  min-height: 86px;
  color: oklch(74% 0.13 158);
  text-align: right;
}

.project-arrow text:last-child {
  color: oklch(76% 0.1 236);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
}

.books-panel,
.about-panel {
  position: relative;
  overflow: hidden;
  border-color: oklch(34% 0.04 125 / 0.35);
  background:
    radial-gradient(circle at 100% 0%, oklch(72% 0.14 194 / 0.2), transparent 34%),
    linear-gradient(135deg, oklch(18% 0.03 116), oklch(25% 0.043 140));
  color: oklch(92% 0.018 100);
  box-shadow: 0 24px 58px oklch(17% 0.03 115 / 0.22);
}

.books-panel::before,
.about-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(0deg, oklch(92% 0.02 110 / 0.035) 0 1px, transparent 1px 9px);
  pointer-events: none;
}

.panel-head {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: center;
}

.panel-code {
  color: oklch(76% 0.1 236);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
}

.compact-title,
.book-terminal,
.inline-feedback,
.about-copy,
.capability-grid,
.about-actions {
  position: relative;
  z-index: 1;
}

.book-terminal {
  margin-top: 22px;
  border: 1px solid oklch(72% 0.14 194 / 0.22);
  border-radius: 8px;
  overflow: hidden;
}

.book-item {
  display: grid;
  grid-template-columns: 68px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
  margin-top: 0;
  padding: 16px;
  border-top-color: oklch(72% 0.14 194 / 0.16);
  color: oklch(92% 0.018 100);
  font-size: clamp(18px, 2.6vw, 22px);
}

.book-item:first-child {
  border-top: 0;
}

.book-item text:first-child {
  color: oklch(71% 0.18 332);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
}

.inline-feedback,
.about-copy {
  color: oklch(82% 0.035 118);
}

.capability-grid {
  display: grid;
  gap: 14px;
  margin-top: 22px;
}

.capability-item {
  display: grid;
  gap: 8px;
}

.capability-item > view:first-child {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  color: oklch(88% 0.04 118);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
}

.capability-track {
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: oklch(14% 0.028 116);
}

.capability-track view {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, oklch(72% 0.14 194), oklch(71% 0.18 332));
  animation: capability-load 900ms var(--ease-out) both;
}

.sync-ribbon,
.tech-ticker {
  transform:
    translateY(var(--ribbon-y))
    scale(var(--ribbon-scale));
  opacity: var(--ribbon-opacity);
  transform-origin: center top;
  will-change: transform, opacity;
}

.showcase-section {
  z-index: 4;
  margin-top: clamp(-74px, -5vw, -28px);
  transform:
    perspective(1300px)
    translateY(var(--case-y))
    scale(var(--case-scale))
    rotateX(var(--case-tilt));
  transform-origin: center top;
  opacity: var(--case-opacity);
  filter: blur(var(--case-blur));
  will-change: transform, opacity, filter;
}

.showcase-section::after {
  content: "";
  position: absolute;
  left: -6vw;
  right: -6vw;
  top: -118px;
  height: 170px;
  z-index: -1;
  background:
    linear-gradient(to bottom, transparent, oklch(10% 0.03 260 / 0.94) 48%, transparent),
    radial-gradient(circle at 50% 44%, oklch(72% 0.14 194 / 0.18), transparent 46%);
  opacity: var(--feed-veil-opacity);
  transform: translateY(var(--feed-veil-y));
  pointer-events: none;
}

.showcase-section .project-list {
  transform: translateY(var(--case-list-y));
  opacity: var(--case-list-opacity);
  will-change: transform, opacity;
}

.lower-grid {
  position: relative;
  z-index: 5;
  margin-top: clamp(-70px, -5vw, -26px);
  padding-top: clamp(76px, 9vw, 118px);
  transform:
    translateY(var(--lower-y))
    scale(var(--lower-scale));
  opacity: var(--lower-opacity);
  will-change: transform, opacity;
}

.lower-grid::before {
  content: "";
  position: absolute;
  left: -6vw;
  right: -6vw;
  top: 0;
  height: clamp(110px, 15vw, 180px);
  z-index: -1;
  background:
    linear-gradient(to bottom, transparent, oklch(10% 0.03 260 / 0.96) 48%, oklch(10% 0.03 260 / 0.76)),
    radial-gradient(circle at 52% 18%, oklch(72% 0.18 332 / 0.2), transparent 44%);
  opacity: var(--case-veil-opacity);
  pointer-events: none;
}

.books-panel {
  transform:
    translateY(var(--books-y))
    rotate(var(--books-rotate));
}

.about-panel {
  transform:
    translateY(var(--about-y))
    rotate(var(--about-rotate));
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
    transform: translateY(-10px) rotateX(5deg) rotateY(-4deg);
    box-shadow: 0 34px 72px oklch(8% 0.02 116 / 0.42);
  }

  .project-row:hover::after {
    transform: translateX(92%) skewX(-18deg);
  }

  .project-row:nth-child(2n):hover {
    transform: translateX(8px) translateY(-10px) rotate(0.45deg) rotateX(5deg) rotateY(3deg);
  }

  .journey-rail button:hover {
    color: var(--seal);
    transform: translateX(4px);
  }

  .journey-rail button:hover .rail-dot {
    border-color: var(--seal);
  }

  .thread-lane button:hover {
    background: var(--mineral-soft);
    box-shadow: 0 18px 34px oklch(28% 0.032 92 / 0.12);
  }

  .thread-lane button:nth-child(1):hover {
    transform: translateY(-8px);
  }

  .thread-lane button:nth-child(2):hover {
    transform: translateY(-24px);
  }

  .thread-lane button:nth-child(3):hover {
    transform: translateY(4px);
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

@keyframes lab-scan {
  0% {
    transform: translateX(-72%);
    opacity: 0;
  }

  18%,
  62% {
    opacity: 1;
  }

  100% {
    transform: translateX(72%);
    opacity: 0;
  }
}

@keyframes title-glitch {
  0%,
  90%,
  100% {
    transform: translateX(0);
    filter: none;
  }

  91% {
    transform: translateX(-2px);
    filter: contrast(1.3);
  }

  92% {
    transform: translateX(3px);
  }

  93% {
    transform: translateX(0);
  }
}

@keyframes lab-float {
  from {
    transform: rotateY(-8deg) rotateX(3deg) translateY(0);
  }

  to {
    transform: rotateY(-4deg) rotateX(4deg) translateY(-12px);
  }
}

@keyframes grid-drift {
  from {
    background-position: 0 0;
  }

  to {
    background-position: 84px 84px;
  }
}

@keyframes beam-sweep {
  from {
    transform: translateX(-360px) skewX(-14deg);
    opacity: 0;
  }

  35%,
  68% {
    opacity: 1;
  }

  to {
    transform: translateX(360px) skewX(-14deg);
    opacity: 0;
  }
}

@keyframes slab-a {
  from {
    transform: rotate(-3deg) translateY(0);
  }

  to {
    transform: rotate(-1deg) translateY(-12px);
  }
}

@keyframes slab-b {
  from {
    transform: rotate(2.5deg) translateY(0);
  }

  to {
    transform: rotate(4deg) translateY(10px);
  }
}

@keyframes orbit-spin {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes ring-field {
  from {
    --ring-angle: 0deg;
  }

  to {
    --ring-angle: 360deg;
  }
}

@keyframes core-pulse {
  from {
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 0 40px oklch(72% 0.14 194 / 0.36);
  }

  to {
    transform: translate(-50%, -50%) scale(1.08);
    box-shadow:
      0 0 52px oklch(72% 0.14 194 / 0.58),
      0 0 96px oklch(72% 0.18 332 / 0.28);
  }
}

@keyframes ribbon-sweep {
  0% {
    transform: translateX(-88%);
    opacity: 0;
  }

  30%,
  70% {
    opacity: 1;
  }

  100% {
    transform: translateX(88%);
    opacity: 0;
  }
}

@keyframes ticker-run {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-220px);
  }
}

@keyframes dial-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes console-scan {
  0% {
    transform: translateX(-84%);
    opacity: 0;
  }

  24%,
  62% {
    opacity: 1;
  }

  100% {
    transform: translateX(84%);
    opacity: 0;
  }
}

@keyframes side-sweep {
  0%,
  58% {
    transform: translateX(-76%);
  }

  100% {
    transform: translateX(76%);
  }
}

@keyframes capability-load {
  from {
    transform: scaleX(0);
    transform-origin: left;
  }

  to {
    transform: scaleX(1);
    transform-origin: left;
  }
}

@media (max-width: 900px) {
  .home {
    width: min(100% - 28px, 680px);
  }

  .sync-bus {
    position: sticky;
    top: 10px;
    right: auto;
    width: 100%;
    grid-template-columns: auto repeat(5, minmax(0, 1fr));
    align-items: center;
    margin: -18px 0 26px;
    overflow-x: auto;
  }

  .sync-bus::before,
  .sync-bus::after {
    display: none;
  }

  .sync-label {
    min-width: 120px;
  }

  .sync-bus button {
    min-width: 82px;
    grid-template-columns: 1fr;
    justify-items: center;
    padding: 0;
    text-align: center;
  }

  .bus-readout {
    grid-column: 1 / -1;
    margin-top: 0;
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
  .thread-map,
  .content-grid,
  .lower-grid {
    grid-template-columns: 1fr;
  }

  .hero {
    position: relative;
    top: auto;
    min-height: 0;
    gap: 28px;
    transform: none;
    opacity: 1;
    filter: none;
  }

  .content-grid,
  .showcase-section,
  .lower-grid,
  .sync-ribbon,
  .tech-ticker {
    transform: none;
    opacity: 1;
    filter: none;
  }

  .sync-ribbon {
    grid-template-columns: 1fr;
  }

  .ribbon-wave {
    grid-template-columns: repeat(5, minmax(86px, 1fr));
    overflow-x: auto;
  }

  .hero-media {
    min-height: 0;
    display: grid;
    gap: 14px;
  }

  .lab-stage {
    min-height: clamp(360px, 56vh, 520px);
    transform: none;
  }

  .desk-image {
    height: 100%;
  }

  .signal-stack {
    position: static;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .signal-stack button,
  .signal-stack button:nth-child(2),
  .signal-stack button:nth-child(3) {
    margin-left: 0;
  }

  .queue-panel {
    position: static;
    width: 100%;
  }

  .journey-rail {
    position: sticky;
    top: 10px;
    left: auto;
    z-index: 10;
    display: flex;
    gap: 8px;
    width: 100%;
    margin: 0 0 20px;
    overflow-x: auto;
    padding: 8px 0;
  }

  .journey-rail::before {
    display: none;
  }

  .journey-rail button {
    flex: 0 0 auto;
    grid-template-columns: 12px auto;
    min-height: 32px;
    padding: 0 12px;
    border: 1px solid var(--line);
    border-radius: 999px;
    background: oklch(94% 0.017 88 / 0.92);
  }

  .rail-dot {
    width: 10px;
    height: 10px;
  }

  .thread-map::before {
    top: auto;
    bottom: 98px;
  }

  .thread-lane {
    grid-template-columns: 1fr;
  }

  .thread-lane button,
  .thread-lane button:nth-child(2),
  .thread-lane button:nth-child(3) {
    transform: none;
  }

  .aside {
    position: static;
    grid-template-columns: 1fr;
  }

  .aside-block:nth-child(2),
  .subscribe {
    transform: none;
  }

  .console-topbar {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .console-topbar > text:last-child {
    display: none;
  }

  .project-row {
    grid-template-columns: 82px minmax(0, 1fr);
    margin-left: 0;
    margin-right: 0;
  }

  .project-core,
  .project-stack,
  .project-arrow {
    grid-column: 2;
  }

  .project-arrow {
    justify-items: start;
    text-align: left;
    min-height: 0;
  }
}

@media (max-width: 560px) {
  .home {
    width: calc(100% - 20px);
    padding-top: 18px;
    padding-bottom: 48px;
  }

  .home::after {
    display: none;
  }

  .nav {
    margin-bottom: 34px;
  }

  .brand-name {
    font-size: 19px;
  }

  .nav-links {
    display: none;
  }

  .headline {
    font-size: clamp(38px, 12.5vw, 56px);
    line-height: 1.04;
  }

  .intro {
    font-size: 15px;
    line-height: 1.78;
  }

  .hero-actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .hero-actions button {
    width: 100%;
  }

  .hero-media {
    min-height: 0;
  }

  .lab-stage {
    min-height: 340px;
  }

  .desk-image {
    height: 100%;
  }

  .code-slab {
    padding: 12px;
    font-size: 11px;
  }

  .slab-a {
    left: 14px;
    top: 18px;
    width: 190px;
  }

  .slab-b {
    right: 12px;
    bottom: 76px;
    width: 190px;
  }

  .orbit-board {
    width: 200px;
    height: 200px;
  }

  .orbit-core {
    width: 68px;
    height: 68px;
    font-size: 22px;
  }

  .orbit-node {
    width: 46px;
    height: 46px;
    font-size: 11px;
  }

  .signal-stack {
    display: flex;
    gap: 10px;
    width: calc(100vw - 20px);
    margin-left: 0;
    overflow-x: auto;
    padding-bottom: 4px;
    scroll-snap-type: x mandatory;
  }

  .signal-stack button {
    min-width: 210px;
    scroll-snap-align: start;
  }

  .queue-panel {
    padding: 18px;
  }

  .content-grid {
    margin-top: 54px;
  }

  .tech-ticker {
    width: calc(100vw - 20px);
  }

  .article-section::before {
    display: none;
  }

  .article-console .post-row {
    grid-template-columns: 1fr;
    min-height: 0;
    padding: 18px;
  }

  .article-console .post-date {
    width: 100%;
    min-height: 42px;
    grid-template-columns: auto auto;
    justify-content: start;
    padding: 0 12px;
  }

  .article-console .post-date text:last-child {
    font-size: 22px;
  }

  .thread-map {
    padding: 20px;
    margin-top: 34px;
  }

  .thread-map::before {
    display: none;
  }

  .thread-lane {
    gap: 10px;
  }

  .thread-lane button {
    min-height: 88px;
  }

  .post-row {
    grid-template-columns: 44px minmax(0, 1fr);
    margin-left: 0;
    padding: 22px 0;
    gap: 14px;
  }

  .post-arrow {
    display: none;
  }

  .post-date text:last-child {
    font-size: 25px;
  }

  .post-title {
    font-size: clamp(22px, 7.2vw, 29px);
  }

  .post-desc {
    font-size: 14px;
    line-height: 1.72;
  }

  .post-tags {
    gap: 6px;
  }

  .post-tags text {
    font-size: 11px;
  }

  .aside {
    gap: 16px;
  }

  .aside-block,
  .subscribe,
  .books-panel,
  .about-panel {
    padding: 20px;
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
    padding: 20px;
  }

  .project-index {
    width: 100%;
    min-height: 42px;
    grid-template-columns: auto auto;
    justify-content: start;
    gap: 10px;
    padding: 0 12px;
  }

  .project-index text:last-child {
    font-size: 22px;
  }

  .project-core,
  .project-stack,
  .project-desc {
    grid-column: auto;
  }

  .project-arrow {
    grid-column: auto;
  }

  .lower-grid {
    gap: 18px;
  }

  .books-panel,
  .about-panel {
    transform: none;
  }

  .book-item {
    grid-template-columns: 1fr;
  }
}

@media (orientation: portrait) and (max-width: 760px) {
  .hero {
    min-height: auto;
  }

  .filters {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .filter {
    flex: 0 0 auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home *,
  .home *::before,
  .home *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 1ms !important;
  }
}
</style>
