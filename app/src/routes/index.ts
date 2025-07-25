import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import HomeView from '@/views/HomeView.vue';

const routes = [
	{
		path: '/',
		component: HomeView,
		meta: { requiresAuth: true },
		name: 'Home',
	},
	{
		path: '/register',
		component: () => import('@/views/auth/RegisterView.vue'),
		meta: { requiresAuth: false },
		name: 'Register',
	},
	{
		path: '/login',
		component: () => import('@/views/auth/LoginView.vue'),
		meta: { requiresAuth: false },
		name: 'Login',
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

router.beforeEach((to, from, next) => {
	const authStore = useAuthStore();

	if (to.meta.requiresAuth && !authStore.isAuthenticated) {
		next({ name: 'Login' });
	} else if (
		(to.name === 'Login' || to.name === 'Register') &&
		authStore.isAuthenticated
	) {
		next({ name: 'Home' });
	} else {
		next();
	}
});

export default router;
