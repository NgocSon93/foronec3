/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import LoginView from '@/components/loginView.vue'
import RegisterView from '@/components/registerView.vue'
import HomeView from '@/components/HomeView.vue'
import UserProfiles from '@/components/UserProfiles.vue'
import Incentives from '@/components/IncentivesView.vue'
import Shipping from '@/components/shipping/ShippingView.vue'
import BookTicket from '@/components/BookTicket/indexBookTicket.vue'
import BookTicketDetail from '@/components/BookTicket/BookTicketDetail.vue'
import BookingInfor from '@/components/BookTicket/BookingInfor.vue'
import ShippingConfirmation from '@/components/shipping/ShippingConfirmation.vue'
import ActivityView from '@/components/ActivityView.vue'
import NewsDetail from '@/components/NewsDetail.vue'
import NewsView from '@/components/NewsView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
     {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/user-profiles',
      name: 'user-profiles',
      component: UserProfiles
    },
    {
      path: '/incentives',
      name: 'incentives',
      component: Incentives
    },
    {
      path: '/book-ticket',
      name: 'book-ticket',
      component: BookTicket
    },
    {
      path: '/book-ticket/:id',
      name: 'book-ticket-detail',
      component: BookTicketDetail,
      props: true
    },
    {
      path: '/booking-infor/:id',
      name: 'booking-infor',
      component: BookingInfor,
      props: true
    },
    {
      path: '/news',
      name: 'news',
      component: NewsView
    },
    {
      path: '/news-detail/:id',
      name: 'news-detail',
      component: NewsDetail,
      props: true
    },
    {
      path: '/shipping',
      name: 'shipping',
      component: Shipping
    },
    {
      path: '/shipping-confirmation/:id',
      name: 'ShippingConfirmation',
      component: ShippingConfirmation
    },
    {
      path: '/activitys',
      name: 'activitys',
      component: ActivityView
    },
    ...routes
  ],
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
