import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './routes';
import { createPinia } from 'pinia';
import { useAuthStore } from './stores/auth.store';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

const authStore = useAuthStore(pinia);
await authStore.autoLogin();

app.use(router);

router.isReady().then(() => {
	app.mount('#app').$nextTick(() => {});
});
