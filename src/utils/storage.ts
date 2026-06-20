import type { GameState, DiaryRecord } from '@/types/game'

const STORAGE_KEY = 'virtual-bird-nest-save'
const DIARY_STORAGE_KEY = 'virtual-bird-nest-diaries'
const MAX_DIARY_RECORDS = 20

export const saveGame = (state: GameState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.warn('保存游戏失败', e)
  }
}

export const loadGame = (): GameState | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.warn('读取存档失败', e)
    return null
  }
}

export const clearSave = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.warn('清除存档失败', e)
  }
}

export const saveDiaryRecord = (record: DiaryRecord): void => {
  try {
    const records = loadDiaryRecords()
    records.unshift(record)
    if (records.length > MAX_DIARY_RECORDS) {
      records.length = MAX_DIARY_RECORDS
    }
    localStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(records))
  } catch (e) {
    console.warn('保存日记失败', e)
  }
}

export const loadDiaryRecords = (): DiaryRecord[] => {
  try {
    const data = localStorage.getItem(DIARY_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (e) {
    console.warn('读取日记失败', e)
    return []
  }
}

export const clearDiaryRecords = (): void => {
  try {
    localStorage.removeItem(DIARY_STORAGE_KEY)
  } catch (e) {
    console.warn('清除日记失败', e)
  }
}
