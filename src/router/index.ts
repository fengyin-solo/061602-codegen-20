import { createRouter, createWebHashHistory } from 'vue-router'
import StartScreen from '@/components/StartScreen.vue'
import GameScreen from '@/components/GameScreen.vue'
import EndScreen from '@/components/EndScreen.vue'
import DiaryScreen from '@/components/DiaryScreen.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'start', component: StartScreen },
    { path: '/game', name: 'game', component: GameScreen },
    { path: '/end', name: 'end', component: EndScreen },
    { path: '/diary', name: 'diary', component: DiaryScreen },
  ],
})

export default router
