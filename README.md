# 背景移除应用

这是一个简单的背景移除应用，使用React前端和Flask后端，通过rembg库实现图片背景移除功能。

## 功能特点

- 上传图片并自动移除背景
- 下载处理后的透明背景图片
- 简洁直观的用户界面
- 自动清理临时文件
- 完善的错误处理

## 系统要求

- Python 3.7+
- Node.js 14+
- npm 6+ 或 yarn 1.22+

## 安装步骤

1. 克隆仓库：
```bash
git clone <repository-url>
cd background-removal-app
```

2. 安装后端依赖：
```bash
cd backend
pip install -r requirements.txt
```

3. 安装前端依赖：
```bash
cd ../frontend
npm install
# 或
yarn install
```

## 运行应用

### 使用启动脚本（推荐）

在项目根目录运行：
```bash
start-app.bat
```

这将自动启动前端和后端服务。

### 手动启动

1. 启动后端服务：
```bash
cd backend
python app.py
```

2. 在另一个终端窗口启动前端服务：
```bash
cd frontend
npm start
# 或
yarn start
```

3. 在浏览器中访问：http://localhost:3000

## 停止应用

使用停止脚本：
```bash
stop-app.bat
```

## 测试

运行API测试：
```bash
cd backend
python test_api.py
```

## 项目结构

```
background-removal-app/
├── backend/
│   ├── app.py           # Flask应用主文件
│   ├── config.py        # 配置文件
│   ├── test_api.py      # API测试脚本
│   ├── logs/            # 日志目录
│   └── uploads/         # 上传文件临时存储目录
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # React组件
│   │   ├── App.js       # 主应用组件
│   │   └── index.js     # 入口文件
│   ├── package.json
│   └── README.md
├── start-app.bat        # 启动脚本
├── stop-app.bat         # 停止脚本
└── README.md            # 项目说明文档
```

## 备注

后端需要安装venv最新版，前端安装node_modules依赖

## 许可证

[MIT](LICENSE)
