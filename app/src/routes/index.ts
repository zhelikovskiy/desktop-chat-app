import { createMemoryHistory, createRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import HomeView from '@/views/HomeView.vue';

const routes = [
	{ path: '/', component: HomeView, meta: { requiresAuth: true } },
	{
		path: '/register',
		component: () => import('@/views/auth/RegisterView.vue'),
		meta: { public: true },
	},
	{
		path: '/login',
		component: () => import('@/views/auth/LoginView.vue'),
		meta: { public: true },
	},
];

const router = createRouter({
	history: createMemoryHistory(),
	routes,
});

router.beforeEach((to, from, next) => {
	const authStore = useAuthStore();
	if (
		(to.path === '/login' || to.path === '/register') &&
		authStore.isAuthenticated
	) {
		next('/');
	} else if (to.meta.requiresAuth && !authStore.isAuthenticated) {
		next('/login');
	} else {
		next();
	}
});

export default router;
