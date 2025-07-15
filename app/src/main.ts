import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './routes';

createApp(App)
	.use(router)
	.mount('#app')
	.$nextTick(() => {
		window.ipcRenderer.on('main-process-message', (_event, message) => {
			console.log(message);
		});
	});

