export default {
  // กำหนดค่าพื้นฐาน
  external: ['@rollup/rollup-linux-x64-gnu'],
  input: 'src/main.tsx',
  output: {
    dir: 'dist',
    format: 'es'
  }
};