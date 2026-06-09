# Node.js + TypeScript 学习环境

这是一个为你准备的 Node.js + TypeScript 开发与学习环境。既然你的老师讲的是 JavaScript，而你想用 TypeScript，这个项目将帮助你无缝过渡。

## 目录结构
- `src/index.ts` - 主入口文件，你可以在这里编写和测试你的代码。
- `tsconfig.json` - TypeScript 的配置文件。
- `package.json` - 项目配置与依赖管理。

## 常用命令

在终端中，你可以运行以下命令：

1. **启动开发服务器（热更新）**
   ```bash
   npm run dev
   ```
   *该命令会使用 `tsx` 启动服务。当你修改 `src/index.ts` 后，它会自动重新运行，无需手动重启。*

2. **编译成 JavaScript**
   ```bash
   npm run build
   ```
   *会将 TypeScript 编译为原生的 JavaScript，输出到 `dist/` 文件夹中。*

3. **运行编译后的代码**
   ```bash
   npm start
   ```

---

## JavaScript (老师教的) vs TypeScript (你写的) 对照表

由于 TypeScript 是 JavaScript 的超集，你完全可以把老师的代码“升级”为 TypeScript。以下是一些常见的模式对比：

### 1. 导入模块
* **JavaScript (CommonJS):**
  ```javascript
  const fs = require('fs');
  const path = require('path');
  ```
* **TypeScript (ES Modules):**
  ```typescript
  import * as fs from 'fs';
  import * as path from 'path';
  ```

### 2. 定义函数与变量
* **JavaScript:**
  ```javascript
  function greet(name) {
    return "Hello, " + name;
  }
  ```
* **TypeScript:**
  ```typescript
  function greet(name: string): string {
    return `Hello, ${name}`;
  }
  ```

### 3. 异步操作 (Promise / async/await)
* 在 TypeScript 中，你可以像在 JavaScript 中一样使用 `async/await`，但 TS 会帮你检查 Promise 返回的类型是否正确。

---

## 学习建议
1. **新建文件练习**：你可以在 `src/` 下新建不同的 `.ts` 文件，比如 `src/fs-demo.ts`，然后在 `package.json` 的 `"dev"` 脚本中把路径改为对应的文件，运行 `npm run dev` 进行调试。
2. **允许部分 JS 代码**：如果你有时候觉得给某些复杂数据写类型太麻烦，可以直接使用 `any` 类型或者直接写普通的 JS 代码，TypeScript 并不会阻止你这样做。
