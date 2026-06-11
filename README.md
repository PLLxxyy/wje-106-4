# 美食日记本

```bash
cp .env.example .env
docker compose up -d --build
```

访问地址：`http://localhost:28606`

**项目类型标签：纯前端 Web 应用**

美食日记本是一款本地优先的饮食记录与健康管理应用，用 IndexedDB 保存餐次、照片、营养目标和统计数据。

## 主要功能

- 首页仪表盘：今日热量、三大营养素、餐次记录和目标提醒
- 记录饮食：选择餐次、添加食物、上传压缩照片、标注食物和价格
- 详情与日历：按日和按餐回顾饮食记录
- 食物库：30 种种子食物，支持搜索、筛选、新增、编辑和删除
- 统计分析：热量趋势、营养占比、餐次热量分布
- 目标与设置：每日目标、亮暗主题、JSON 导入导出、清空数据

## 本地开发

```bash
cd frontend
npm install
npm run dev
```

开发服务默认地址：`http://localhost:5173`

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 构建 | Vite |
| UI | React 18 + TypeScript |
| 样式 | Tailwind CSS |
| 状态 | Zustand |
| 图表 | Chart.js + react-chartjs-2 |
| 本地数据 | Dexie + IndexedDB |
| 部署 | Docker Compose + Nginx |

## 目录结构

```text
.
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── db/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── router/
│   │   ├── stores/
│   │   ├── styles/
│   │   ├── types/
│   │   └── utils/
│   ├── index.html
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── README.md
```

## 环境变量

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `COMPOSE_PROJECT_NAME` | `wjefooddiary` | Compose 项目名 |
| `FRONTEND_PORT` | `28606` | 宿主机访问端口 |

## 数据存储说明

所有数据保存在浏览器 IndexedDB 的 `FoodDiaryDB` 中，包含 `diaryEntries`、`foodItems`、`dailyGoal` 三个表。数据不会上传到服务器；清除浏览器站点数据会删除本地记录。设置页可导出 JSON 备份，也可导入 JSON 覆盖恢复。

## 功能截图位置

- 首页仪表盘：启动后打开 `http://localhost:28606`
- 记录饮食：点击顶部导航“记录”
- 统计分析：点击顶部导航“统计”

## License

MIT
