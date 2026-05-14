请按 TDD 模式实现 @docs/goal/REQUIREMENTS.md @docs/goal/DESIGN.md @docs/goal/TASKS.md 中描述的所有任务。

## 强制约束

1. **不要重新解释需求**。三 umbrella 文档（REQUIREMENTS / DESIGN / TASKS）就是 source of truth；细节看它们链接到的文件（PRD / NON_GOALS / ACCEPTANCE / IMPACT / PLAN / VERIFY）。
2. **逐任务执行**，顺序按 `docs/goal/TASKS.md` 的 Task Order。
3. **每个生产代码任务必须走完 TDD 全循环**：
   - **RED**: 先写任务里 "RED Test" 段指定的失败测试。
   - **Expected Failure 验证**: 跑 "Verification Command"，确认失败信号与 "Expected Failure" 描述一致——不是任意失败。
   - **GREEN**: 写最小化实现，仅刚好让该测试通过。范围严格限制在任务的 "GREEN Boundary" 内。
   - **Verify**: 再跑 Verification Command，确认全绿。
   - **Refactor**: 仅在绿后，按 "Refactor Allowance" 列出的清理操作做整理；refactor 后必须重新跑验证。
   - **Evidence**: 把命令输出摘要 + 关键证据追加到 `docs/goal/VERIFY.md`。
   - **Acceptance**: 任务的 Acceptance Criteria 全部满足，才进入下一任务。
4. **不要碰** 任务的 "Do Not Touch" 段以及 `docs/goal/NON_GOALS.md` 列出的任何文件 / 模块 / 行为。
5. **技术栈**严格遵守 `docs/goal/DESIGN.md` 的 Tech Stack 段（版本约束、依赖白名单）；不要静默引入替代方案。
6. **遇到需求冲突或 BLOCKING 未知立刻停下来**，报告：
   - 冲突的具体段落（文件 + 行号或锚点）
   - 你尝试了哪些命令
   - 提出**最小**的、可被一个回答解决的问题
7. **完工标准**：
   - `docs/goal/TASKS.md` 中所有任务完成
   - `docs/goal/ACCEPTANCE.md` 中所有验收标准通过
   - lint / type-check / test 等验证命令全绿
   - `git diff` 只含预期文件
   - `docs/goal/VERIFY.md` 含完整证据
   - 残留风险（如有）显式列出
