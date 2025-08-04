import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const routes = [
	{
		path: '/',
		component: () => import('@/views/HomeView.vue'),
		meta: { requiresAuth: true },
		name: 'Home',
	},
	{
		path: '/register',
		component: () => import('@/views/register/RegisterView.vue'),
		meta: { requiresAuth: false },
		name: 'Register',
	},
	{
		path: '/login',
		component: () => import('@/views/auth/LoginView.vue'),
		meta: { requiresAuth: false },
		name: 'Login',
	},
	{
		path: '/verify',
		component: () => import('@/views/register/CodeVerifyView.vue'),
		meta: { requiresAuth: false },
		name: 'Verify',
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

router.beforeEach((to, _from, next) => {
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
