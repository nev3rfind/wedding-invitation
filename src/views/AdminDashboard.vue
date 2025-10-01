<template>
  <div class="admin-dashboard min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <header class="mb-8">
        <h1 class="text-4xl font-serif text-spring-poppy mb-2">Wedding Invitation Dashboard</h1>
        <p class="text-nimble">Donatas & Trang - April 5, 2026</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="stat-card bg-white p-6 rounded-lg shadow">
          <h3 class="text-sm font-medium text-nimble mb-2">Total Invites</h3>
          <p class="text-3xl font-bold text-spring-poppy">{{ stats.total }}</p>
        </div>
        <div class="stat-card bg-white p-6 rounded-lg shadow">
          <h3 class="text-sm font-medium text-nimble mb-2">Accepted</h3>
          <p class="text-3xl font-bold text-english-pear">{{ stats.accepted }}</p>
        </div>
        <div class="stat-card bg-white p-6 rounded-lg shadow">
          <h3 class="text-sm font-medium text-nimble mb-2">Pending</h3>
          <p class="text-3xl font-bold text-gold-accent">{{ stats.pending }}</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow mb-8 p-6">
        <h2 class="text-2xl font-serif text-spring-poppy mb-4">Guest List</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4">Name</th>
                <th class="text-left py-3 px-4">Language</th>
                <th class="text-left py-3 px-4">Status</th>
                <th class="text-left py-3 px-4">Flying From</th>
                <th class="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="guest in guests"
                :key="guest.id"
                class="border-b hover:bg-gray-50"
              >
                <td class="py-3 px-4">{{ guest.guest_full_name }}</td>
                <td class="py-3 px-4">{{ guest.guest_language }}</td>
                <td class="py-3 px-4">
                  <span
                    class="px-2 py-1 rounded-full text-xs"
                    :class="getStatusClass(guest.status?.name)"
                  >
                    {{ guest.status?.name || 'pending' }}
                  </span>
                </td>
                <td class="py-3 px-4">{{ guest.fly_from_country?.country_name_en || '-' }}</td>
                <td class="py-3 px-4">
                  <button
                    @click="copyInviteLink(guest.invite_guid)"
                    class="text-english-pear hover:text-spring-poppy"
                  >
                    Copy Link
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-serif text-spring-poppy mb-4">Recent Activities</h2>
        <div class="space-y-3">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="flex justify-between items-center py-2 border-b"
          >
            <div>
              <span class="font-medium">{{ activity.activity_type }}</span>
              <span class="text-sm text-nimble ml-2">
                {{ formatDate(activity.event_time) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../services/supabase'
import dayjs from 'dayjs'

const guests = ref([])
const activities = ref([])

const stats = computed(() => {
  return {
    total: guests.value.length,
    accepted: guests.value.filter(g => g.status?.name === 'accepted').length,
    pending: guests.value.filter(g => g.status?.name === 'pending').length,
  }
})

const recentActivities = computed(() => {
  return activities.value.slice(0, 10)
})

const loadGuests = async () => {
  const { data, error } = await supabase
    .from('guest_invitations')
    .select(`
      *,
      fly_from_country:countries(country_code, country_name_en),
      status:invitation_status(name)
    `)
    .order('created_at', { ascending: false })

  if (!error && data) {
    guests.value = data
  }
}

const loadActivities = async () => {
  const { data, error } = await supabase
    .from('guest_activities')
    .select('*')
    .order('event_time', { ascending: false })
    .limit(20)

  if (!error && data) {
    activities.value = data
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'accepted':
      return 'bg-english-pear text-white'
    case 'rejected':
      return 'bg-spring-poppy text-white'
    default:
      return 'bg-nimble text-white'
  }
}

const copyInviteLink = (inviteGuid) => {
  const url = `${window.location.origin}/invite/${inviteGuid}`
  navigator.clipboard.writeText(url)
  alert('Invite link copied to clipboard!')
}

const formatDate = (dateString) => {
  return dayjs(dateString).format('MMM DD, YYYY HH:mm')
}

onMounted(() => {
  loadGuests()
  loadActivities()
})
</script>
