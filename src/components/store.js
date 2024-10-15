import { defineStore } from 'pinia'
import axios from 'axios'

export const useStore = defineStore('main', {
  state: () => ({
    bookings: [],
    shippings: [],
    notifications: []
  }),

  actions: {
    async fetchBookings() {
      try {
        const response = await axios.get('http://localhost:3001/bookings')
        this.bookings = response.data
      } catch (error) {
        console.error('Error fetching bookings:', error)
      }
    },

    async fetchShippings() {
      try {
        const response = await axios.get('http://localhost:3001/shippings')
        this.shippings = response.data
      } catch (error) {
        console.error('Error fetching shippings:', error)
      }
    },

    async fetchNotifications() {
      try {
        const response = await axios.get('http://localhost:3001/notifications')
        this.notifications = response.data
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    },

    addNotification(newNotification) {
      this.notifications.unshift(newNotification)
    },

    startPolling() {
      setInterval(() => {
        this.fetchNotifications()
      }, 5000) // Poll every 5 seconds
    }
  },

  getters: {
    getBookings: (state) => state.bookings,
    getShippings: (state) => state.shippings,
    getNotifications: (state) => state.notifications
  }
})
