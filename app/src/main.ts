import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './routes';
import { createPinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

router.isReady().then(() => {
	if (
		router.currentRoute.value.meta.requiresAuth &&
		!localStorage.getItem('authToken')
	) {
		router.push('/login');
	}

	app.mount('#app').$nextTick(() => {});
});
