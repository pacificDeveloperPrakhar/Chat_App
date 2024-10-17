import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config({path:path.resolve(__dirname,'../config.env')})
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base:"/static_files",
  server:{
    port:3000
  },
  build:{
    outDir:"public_dir"
  },
  define:{
    'process.env':process.env
  }
})
