<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameState } from '@/composables/useGameState'
import type { DiaryRecord, DiaryDay, DiaryEventType } from '@/types/game'
import { WEATHER_NAMES, STAGE_EMOJI, PERSONALITY_EMOJI } from '@/utils/constants'

const router = useRouter()
const { loadDiaryRecords } = useGameState()

const records = ref<DiaryRecord[]>([])
const selectedRecordId = ref<string | null>(null)
const expandedDays = ref<Set<number>>(new Set())

onMounted(() => {
  records.value = loadDiaryRecords()
  if (records.value.length > 0) {
    selectedRecordId.value = records.value[0].id
  }
})

const selectedRecord = computed(() => {
  return records.value.find(r => r.id === selectedRecordId.value) || null
})

const formatDate = (ts: number) => {
  return new Date(ts).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const toggleDay = (day: number) => {
  if (expandedDays.value.has(day)) {
    expandedDays.value.delete(day)
  } else {
    expandedDays.value.add(day)
  }
}

const getEventIcon = (type: DiaryEventType): string => {
  const icons: Record<DiaryEventType, string> = {
    hatch: '🥚',
    grow: '🌟',
    die: '💔',
    bury: '🕊️',
    away: '💨',
    return: '🏠',
    sick: '🤒',
    recover: '💚',
    feed: '🍒',
    breeding: '💝',
    weather: '🌤️',
    dayStart: '📅',
    info: 'ℹ️',
  }
  return icons[type] || '📝'
}

const getEventColor = (type: DiaryEventType): string => {
  const colors: Record<DiaryEventType, string> = {
    hatch: 'bg-green-500/15 text-green-200 border-green-400/20',
    grow: 'bg-yellow-500/15 text-yellow-200 border-yellow-400/20',
    die: 'bg-red-500/15 text-red-200 border-red-400/20',
    bury: 'bg-gray-500/15 text-gray-200 border-gray-400/20',
    away: 'bg-orange-500/15 text-orange-200 border-orange-400/20',
    return: 'bg-teal-500/15 text-teal-200 border-teal-400/20',
    sick: 'bg-rose-500/15 text-rose-200 border-rose-400/20',
    recover: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/20',
    feed: 'bg-pink-500/15 text-pink-200 border-pink-400/20',
    breeding: 'bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-400/20',
    weather: 'bg-sky-500/15 text-sky-200 border-sky-400/20',
    dayStart: 'bg-indigo-500/15 text-indigo-200 border-indigo-400/20',
    info: 'bg-white/10 text-white/80 border-white/10',
  }
  return colors[type] || 'bg-white/10 text-white/80 border-white/10'
}

const formatEventTime = (ts: number) => {
  return new Date(ts).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const getStarDisplay = (stars?: number) => {
  const s = stars ?? 0
  return '⭐'.repeat(s) + '☆'.repeat(5 - s)
}

const handleBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="w-full h-full bg-gradient-to-br from-amber-900 via-orange-900 to-rose-900 flex flex-col p-4 md:p-6 overflow-hidden">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-10 left-10 text-5xl opacity-10 animate-float">📖</div>
      <div class="absolute top-20 right-16 text-4xl opacity-10 animate-float" style="animation-delay: 0.5s">🪶</div>
      <div class="absolute bottom-20 left-20 text-5xl opacity-10 animate-float" style="animation-delay: 1s">🐦</div>
      <div class="absolute bottom-16 right-10 text-4xl opacity-10 animate-float" style="animation-delay: 1.5s">🌿</div>
    </div>

    <div class="relative z-10 flex items-center justify-between mb-4">
      <button
        class="px-4 py-2 glass rounded-xl text-white/90 text-sm hover:bg-white/20 transition-all flex items-center gap-2"
        @click="handleBack"
      >
        <span>←</span> 返回主页
      </button>
      <h1 class="font-display text-3xl text-amber-200 text-stroke flex items-center gap-2">
        <span>📔</span> 守巢日记
      </h1>
      <div class="w-24" />
    </div>

    <div class="relative z-10 flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div class="lg:col-span-3 min-h-0 flex flex-col gap-3">
        <div class="font-display text-lg text-amber-300 flex items-center gap-2 px-1">
          <span>📚</span> 历史记录
        </div>
        <div class="flex-1 min-h-0 overflow-y-auto scrollbar-hide flex flex-col gap-2 pr-1">
          <div
            v-for="record in records"
            :key="record.id"
            :class="[
              'glass rounded-2xl p-4 cursor-pointer transition-all border-2',
              selectedRecordId === record.id
                ? 'border-amber-400/50 bg-amber-500/10'
                : 'border-transparent hover:bg-white/10',
            ]"
            @click="selectedRecordId = record.id"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="text-white font-bold text-sm">
                {{ formatDate(record.startedAt) }}
              </div>
              <div v-if="record.finalScore" class="text-xs text-yellow-300">
                {{ getStarDisplay(record.finalScore.stars) }}
              </div>
            </div>
            <div class="text-white/60 text-xs flex flex-wrap gap-x-3 gap-y-1">
              <span>📅 {{ record.totalDays }} 天</span>
              <span>🥚 {{ record.totalHatched }}</span>
              <span>💔 {{ record.totalDied }}</span>
              <span v-if="record.breedingCount > 0">💝 {{ record.breedingCount }}窝</span>
            </div>
            <div v-if="record.finalScore" class="mt-2 text-xs text-amber-300/80">
              {{ record.finalScore.rank }} · {{ record.finalScore.totalScore }}分
            </div>
          </div>

          <div v-if="records.length === 0" class="glass rounded-2xl p-8 text-center">
            <div class="text-5xl mb-3 opacity-60">📭</div>
            <div class="text-white/60 text-sm">还没有守巢日记哦~</div>
            <div class="text-white/40 text-xs mt-1">完成一局游戏后，日记会自动保存在这里</div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-9 min-h-0 flex flex-col gap-3">
        <template v-if="selectedRecord">
          <div class="glass rounded-2xl p-5">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div class="font-display text-2xl text-amber-200 mb-1">
                  {{ formatDate(selectedRecord.startedAt) }} 的守巢记录
                </div>
                <div class="text-white/60 text-sm flex flex-wrap gap-x-4 gap-y-1">
                  <span>📅 共 {{ selectedRecord.totalDays }} 天</span>
                  <span>🥚 孵化 {{ selectedRecord.totalHatched }} 只</span>
                  <span>💔 离世 {{ selectedRecord.totalDied }} 只</span>
                  <span v-if="selectedRecord.breedingCount > 0">💝 繁殖 {{ selectedRecord.breedingCount }} 窝</span>
                </div>
              </div>
              <div v-if="selectedRecord.finalScore" class="text-right">
                <div class="text-3xl text-yellow-300">{{ getStarDisplay(selectedRecord.finalScore.stars) }}</div>
                <div class="text-amber-200 font-display text-lg">{{ selectedRecord.finalScore.rank }}</div>
                <div class="text-white/60 text-xs">综合 {{ selectedRecord.finalScore.totalScore }} 分</div>
              </div>
            </div>
          </div>

          <div class="flex-1 min-h-0 overflow-y-auto scrollbar-hide pr-1 space-y-3">
            <div
              v-for="(day, idx) in [...selectedRecord.days].reverse()"
              :key="day.day"
              class="glass rounded-2xl overflow-hidden animate-pop-in"
              :style="{ animationDelay: `${idx * 0.05}s` }"
            >
              <div
                class="p-4 cursor-pointer hover:bg-white/5 transition-all flex items-center justify-between"
                @click="toggleDay(day.day)"
              >
                <div class="flex items-center gap-3">
                  <div class="text-3xl">📅</div>
                  <div>
                    <div class="text-white font-bold text-lg">第 {{ day.day }} 天</div>
                    <div class="text-white/50 text-xs">
                      {{ day.events.length }} 条事件 · 存活 {{ day.aliveBirdCount }} 只
                      <span v-if="day.totalFoodCollected > 0"> · 收集食物 {{ day.totalFoodCollected }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="hidden md:flex gap-2 flex-wrap">
                    <span v-if="day.stats.hatched > 0" class="bg-green-500/20 text-green-300 px-2 py-1 rounded-lg text-xs">
                      🥚 +{{ day.stats.hatched }}
                    </span>
                    <span v-if="day.stats.grew > 0" class="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-lg text-xs">
                      🌟 +{{ day.stats.grew }}
                    </span>
                    <span v-if="day.stats.died > 0" class="bg-red-500/20 text-red-300 px-2 py-1 rounded-lg text-xs">
                      💔 {{ day.stats.died }}
                    </span>
                    <span v-if="day.stats.fed > 0" class="bg-pink-500/20 text-pink-300 px-2 py-1 rounded-lg text-xs">
                      🍒 {{ day.stats.fed }}次
                    </span>
                    <span v-if="day.stats.sickened > 0" class="bg-rose-500/20 text-rose-300 px-2 py-1 rounded-lg text-xs">
                      🤒 {{ day.stats.sickened }}
                    </span>
                    <span v-if="day.stats.recovered > 0" class="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-lg text-xs">
                      💚 {{ day.stats.recovered }}
                    </span>
                  </div>
                  <div class="text-white/40 text-xl transition-transform" :class="expandedDays.has(day.day) ? 'rotate-180' : ''">
                    ▼
                  </div>
                </div>
              </div>

              <div v-show="expandedDays.has(day.day)" class="border-t border-white/10">
                <div v-if="day.stats.weathers.length > 0" class="px-5 py-3 bg-white/5 flex items-center gap-2 flex-wrap">
                  <span class="text-white/50 text-xs">🌤️ 今日天气：</span>
                  <span
                    v-for="w in day.stats.weathers"
                    :key="w"
                    class="bg-sky-500/20 text-sky-200 px-2 py-0.5 rounded-lg text-xs"
                  >
                    {{ WEATHER_NAMES[w] }}
                  </span>
                </div>

                <div class="divide-y divide-white/5">
                  <div
                    v-for="event in day.events"
                    :key="event.id"
                    :class="[
                      'px-5 py-3 flex items-start gap-3',
                      getEventColor(event.type),
                    ]"
                  >
                    <div class="text-xl shrink-0 mt-0.5">{{ getEventIcon(event.type) }}</div>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm leading-snug">{{ event.message }}</div>
                      <div class="text-xs opacity-50 mt-1">
                        {{ formatEventTime(event.timestamp) }}
                        <span v-if="event.birdName" class="ml-2">· {{ event.birdName }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="day.events.length === 0" class="px-5 py-6 text-center text-white/40 text-sm">
                  这一天没有特别的事件记录~
                </div>
              </div>
            </div>
          </div>
        </template>

        <div v-else class="flex-1 flex items-center justify-center">
          <div class="text-center glass rounded-3xl p-10">
            <div class="text-7xl mb-4 opacity-50">📔</div>
            <div class="text-white/60 text-lg">选择一条记录查看守巢日记</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
