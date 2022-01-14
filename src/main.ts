import { createApp } from 'vue'
import { Chart, registerables } from 'chart.js';
import App from './App.vue'
import './index.css'

Chart.register(...registerables);


createApp(App).mount('#app')
