import {defineConfig} from 'vite';
export default defineConfig({
  server:{
    port:3000,strictPort:true,
    watch:{ignored:['**/data/**','**/tools/**']},
    fs:{deny:['.env','.env.*','**/*.pem','**/*.key','**/.git/**','**/data/**','**/wallet.js','**/app.js']}
  },
  build:{outDir:'dist'}
});
