export default defineConfig(({ command, mode, ssrBuild }) => {
  return {
    base: command === 'build' ? '/test/act/`' : './'
    // 其它配置...
  }
})
