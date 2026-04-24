export const topics = ['All', 'Full-stack', 'AI Systems', 'Agent Lab', 'System Reading', 'Field Log']

export const posts = [
  {
    id: 1,
    slug: 'ai-agent-product-loop',
    topic: 'AI Systems',
    month: '04',
    day: '21',
    date: '2026.04.21',
    minutes: 13,
    progress: 74,
    title: '把 AI Agent 放进产品闭环，而不是聊天框里',
    desc: '从任务拆解、工具调用、状态回放和人工接管四个角度，设计一个真正能交付结果的 Agent 体验。',
    pullquote: 'Agent 的价值不在于它会说话，而在于它能把一个含混目标推进成可验证的结果。',
    tags: ['AI Agent', '产品设计', '工具调用'],
    actions: ['查看任务模型', '收藏到队列'],
    sections: [
      {
        heading: '先定义可交付结果',
        body: '很多 Agent 原型停留在对话流，因为一开始只定义了“能回答什么”，没有定义“完成到什么程度算结束”。我更愿意先写验收条件：生成了文件、提交了 PR、发出了邮件，或者把待确认项清楚交还给人。'
      },
      {
        heading: '把工具调用当成界面事件',
        body: '工具调用不应该藏在日志里。用户需要看到 Agent 为什么读这个文件、为什么改这个配置、为什么暂停等待确认。每一次调用都可以成为可回放的事件，让信任不是靠文案建立，而是靠过程透明建立。'
      },
      {
        heading: '人工接管不是失败',
        body: '好的 Agent 会知道什么时候停。权限、破坏性操作、需求冲突和信息不足，都应该触发清晰的接管点。让人介入不是降低自动化，而是保护结果质量。'
      },
      {
        heading: '最后做成产品节奏',
        body: '我会把 Agent 视为一个有状态的工作台：目标、计划、执行、证据、交付物和复盘都在同一条线上。这样它才从“聪明的聊天框”变成“可靠的协作者”。'
      }
    ]
  },
  {
    id: 2,
    slug: 'fullstack-observability-budget',
    topic: 'Full-stack',
    month: '04',
    day: '16',
    date: '2026.04.16',
    minutes: 11,
    progress: 58,
    title: '全栈应用的可观测性，先从预算开始',
    desc: '日志、指标、链路追踪都重要，但真正有效的第一步，是给错误、延迟和成本设定明确预算。',
    pullquote: '没有预算的监控只是噪声收集，有预算的监控才会推动工程决策。',
    tags: ['Next.js', 'Postgres', 'Observability'],
    actions: ['查看检查清单', '加入阅读队列'],
    sections: [
      {
        heading: '错误预算让告警有边界',
        body: '一个全栈应用通常同时拥有前端路由、服务端函数、数据库和第三方 API。所有地方都告警，最后等于没人看告警。先定义核心路径的错误预算，告警才会和用户影响绑定。'
      },
      {
        heading: '延迟预算决定架构取舍',
        body: '首页首屏、搜索请求、AI 生成任务、后台队列，它们不该共享同一套延迟期待。把延迟预算写在功能旁边，缓存、流式返回和异步化才有判断依据。'
      },
      {
        heading: '成本预算避免 AI 功能失控',
        body: 'AI 调用把成本从服务器规格转移到每次用户动作。记录 token、模型、重试次数和产物价值，是让功能可持续的基本功。'
      }
    ]
  },
  {
    id: 3,
    slug: 'rag-for-real-product',
    topic: 'AI Systems',
    month: '04',
    day: '09',
    date: '2026.04.09',
    minutes: 15,
    progress: 66,
    title: 'RAG 不是向量库接入，而是一套内容契约',
    desc: '真实业务里的 RAG，需要处理来源可信度、段落边界、引用证据、过期内容和无法回答的场景。',
    pullquote: '检索增强的核心不是“搜到了什么”，而是“回答凭什么成立”。',
    tags: ['RAG', 'Embedding', 'LLM'],
    actions: ['查看评估维度', '复制引用格式'],
    sections: [
      {
        heading: '内容切分是产品决定',
        body: '切分策略不是纯技术参数。一个 FAQ、一个 API 文档和一份合同，对段落完整性的要求完全不同。切得太碎会丢语义，切得太大又会稀释证据。'
      },
      {
        heading: '引用是用户界面的一部分',
        body: 'RAG 系统应该把引用做成可检查的界面，而不是在回答末尾贴几个链接。用户需要知道哪一句依赖哪段材料，以及材料是否足够新。'
      },
      {
        heading: '拒答能力要被测试',
        body: '无法回答不是模型失败，而是知识边界被正确识别。评估集里必须包含过期问题、无来源问题和冲突来源问题，否则上线后会用自信掩盖不确定。'
      }
    ]
  },
  {
    id: 4,
    slug: 'frontend-backend-contracts',
    topic: 'Full-stack',
    month: '03',
    day: '30',
    date: '2026.03.30',
    minutes: 9,
    progress: 42,
    title: '前后端契约，比接口文档更早出现',
    desc: '从页面状态、错误模型和权限边界出发，重新理解全栈协作里的 API 设计。',
    pullquote: '接口不是后端给前端的出口，而是产品状态在系统里的边界。',
    tags: ['API Design', 'TypeScript', 'UX'],
    actions: ['查看状态模型', '打开错误样例'],
    sections: [
      {
        heading: '先列页面状态',
        body: '我通常从页面会出现的状态开始：加载、空、部分成功、权限不足、可重试失败、不可恢复失败。接口文档如果覆盖不了这些状态，前端最终会自己发明一套解释。'
      },
      {
        heading: '错误需要可行动',
        body: '错误码的价值不在分类，而在于它能不能帮助界面决定下一步。是重试、刷新登录、请求权限，还是展示人工联系入口，这些都应该进入契约。'
      },
      {
        heading: '类型是协作语言',
        body: 'TypeScript 类型、OpenAPI schema 或 RPC 定义都只是形式。真正重要的是让需求变化能够在编译期或测试期暴露，而不是在用户点击之后才出现。'
      }
    ]
  },
  {
    id: 5,
    slug: 'reading-notes-designing-data-intensive',
    topic: 'System Reading',
    month: '03',
    day: '22',
    date: '2026.03.22',
    minutes: 14,
    progress: 61,
    title: '读《数据密集型应用系统设计》：可靠性是一种日常习惯',
    desc: '把复制、分区、一致性和可恢复性放回产品语境里，理解系统为什么需要留余地。',
    pullquote: '可靠性不是上线前的检查项，而是每天写代码时给未来留下的余地。',
    tags: ['系统设计', '数据库', '可靠性'],
    actions: ['查看书摘', '加入书单'],
    sections: [
      {
        heading: '系统总在部分失败',
        body: '这本书反复提醒我，分布式系统不是偶尔失败，而是一直存在局部不一致、延迟和重试。工程设计要承认这种现实，而不是把它包装成异常情况。'
      },
      {
        heading: '一致性是用户体验问题',
        body: '不同场景对一致性的忍受程度不同。订单支付、协作文档、消息通知和推荐列表，不该用同一种口径讨论“实时”。'
      },
      {
        heading: '恢复路径比完美路径重要',
        body: '真正让系统可靠的，是失败之后能不能解释、重放、补偿和恢复。日志与事件不是为了排查而存在，也是在给未来的修复留入口。'
      }
    ]
  },
  {
    id: 6,
    slug: 'quiet-weekend-walk',
    topic: 'Field Log',
    month: '03',
    day: '12',
    date: '2026.03.12',
    minutes: 6,
    progress: 31,
    title: '周末散步：让脑子从待办列表里出来',
    desc: '生活类笔记先保持松弛一点：关于走路、咖啡、天气，以及不急着解决问题的下午。',
    pullquote: '有些问题不是想通的，是走着走着不再那么紧。',
    tags: ['散步', '咖啡', '生活记录'],
    actions: ['保存片段', '下一篇生活'],
    sections: [
      {
        heading: '路过比抵达重要',
        body: '周末散步没有明确目的，反而更像给大脑做一次轻量重启。经过的街口、树影和店门口的声音，会把注意力从屏幕里慢慢拉出来。'
      },
      {
        heading: '不解决也可以记录',
        body: '我越来越喜欢把没想明白的事情写下来，但不立刻处理。记录本身像一个缓冲区，让问题先拥有形状。'
      },
      {
        heading: '给下周留一点空白',
        body: '如果周末被安排得太满，周一就像只是换了一个任务列表。留一点空白，反而能让之后几天更稳。'
      }
    ]
  }
]

export const navItems = [
  { label: 'FEED', target: 'articles' },
  { label: 'CASES', target: 'projects' },
  { label: 'STACK', target: 'books' },
  { label: 'PROFILE', target: 'about' }
]

export const queue = ['把 AI Agent 放进产品闭环', 'RAG 内容契约检查表', '全栈可观测性预算']

export const tags = ['AI Agent', 'RAG', 'LLM', 'Vue', 'uni-app', 'TypeScript', 'Postgres', '系统设计', '生活记录']

export const projects = [
  {
    id: 1,
    slug: 'agent-workbench',
    name: 'Agent 工作台原型',
    desc: '围绕目标、计划、工具调用和交付物组织的 AI 协作界面。',
    status: '设计中',
    role: '产品设计 / 前端原型 / Agent 流程设计',
    period: '2026.04',
    stack: ['Vue', 'uni-app', 'LLM Tools', 'Workflow UI'],
    cover: '任务、计划、工具调用、证据和交付物在同一条工作线上展开。',
    problem: '普通聊天框很难承载长任务，用户看不到 Agent 为什么执行某个动作，也很难在关键节点接管。',
    solution: '把 Agent 的工作过程拆成目标、计划、事件、产物和接管点，用时间线与状态面板呈现，保留每次工具调用的原因和结果。',
    highlights: ['可回放的工具调用事件', '人工确认和权限边界', '任务完成度与交付物视图'],
    results: ['完成核心信息架构', '沉淀 Agent 产品闭环文章', '下一步接入真实工具调用日志']
  },
  {
    id: 2,
    slug: 'fullstack-blog-platform',
    name: '全栈博客系统',
    desc: '当前项目的下一阶段：Markdown 内容源、归档、搜索和部署流水线。',
    status: '进行中',
    role: '全栈开发 / 内容系统 / 视觉设计',
    period: '2026.04',
    stack: ['uni-app', 'Vue 3', 'Markdown', 'Static Build'],
    cover: '一个兼顾个人品牌、长期写作和工程记录的博客系统。',
    problem: '普通博客模板容易只像文章列表，无法表达全栈与 AI 项目的长期演进，也缺少项目、书单和文章之间的连接。',
    solution: '先做品牌化 H5 原型，再把文章、项目、书单抽成结构化内容，后续接入 Markdown、搜索、RSS 和部署流水线。',
    highlights: ['高能实验室视觉系统', '文章与项目双入口', '详情页阅读路径和标签回流'],
    results: ['完成首页原型', '完成文章详情页', '完成项目详情页雏形']
  },
  {
    id: 3,
    slug: 'rag-evaluation-kit',
    name: 'RAG 评估小工具',
    desc: '用于记录检索命中、引用质量和拒答样例的轻量评估面板。',
    status: '构思',
    role: 'AI 应用工程 / 评估设计',
    period: '2026.03',
    stack: ['Embedding', 'Vector Search', 'Evaluation Set', 'Postgres'],
    cover: '围绕证据质量而不是单次回答分数设计的 RAG 评估面板。',
    problem: '很多 RAG Demo 能回答问题，但无法解释引用是否可靠，也没有系统记录无法回答、来源冲突和内容过期。',
    solution: '建立问题集、检索结果、引用片段、回答结论和人工判定之间的映射，让每一次评估都能回到证据。',
    highlights: ['引用质量标注', '拒答样例库', '检索命中和回答可信度对照'],
    results: ['完成评估维度设计', '准备实现数据表结构', '后续接入真实知识库']
  },
  {
    id: 4,
    slug: 'ops-insight-dashboard',
    name: '全栈可观测性面板',
    desc: '围绕错误预算、延迟预算和 AI 成本预算设计的工程健康面板。',
    status: '计划中',
    role: '全栈工程 / 数据可视化 / 运维体验',
    period: '2026.02',
    stack: ['Node.js', 'Postgres', 'Tracing', 'Charts'],
    cover: '把日志、指标和成本从“看很多图”整理成“知道下一步该做什么”。',
    problem: '监控数据分散在多个工具里，告警容易失焦，AI 功能上线后 token 成本和重试成本也缺少统一观察。',
    solution: '以预算为核心组织信息：错误预算、延迟预算、AI 调用预算和关键用户路径，一屏解释当前风险。',
    highlights: ['预算优先的信息结构', 'AI 调用成本追踪', '核心路径健康摘要'],
    results: ['完成信息架构草案', '下一步制作交互原型', '后续接入真实指标数据']
  }
]

export const bookNotes = [
  '《数据密集型应用系统设计》',
  '《Designing Machine Learning Systems》',
  '《The Staff Engineer Path》'
]

export function findPostById(id) {
  return posts.find((post) => String(post.id) === String(id)) || posts[0]
}

export function findProjectById(id) {
  return projects.find((project) => String(project.id) === String(id)) || projects[0]
}

export function findPostsByTag(tag) {
  return posts.filter((post) => post.tags.includes(tag))
}
