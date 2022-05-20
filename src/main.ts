import { createApp } from 'vue'
import { createPinia } from 'pinia';
import { Chart, registerables } from 'chart.js';
import App from './App.vue'
import './index.css'

Chart.register(...registerables);

const pinia = createPinia();

createApp(App)
  .use(pinia)
  .mount('#app')
