<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            @click="$router.back()"
            class="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeftIcon class="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <div class="flex items-center space-x-3">
              <h1 class="text-2xl font-bold text-gray-900">{{ request.title }}</h1>
              <Badge :color="getStatusColor(request.status)">
                {{ getStatusText(request.status) }}
              </Badge>
              <Badge :color="getPriorityColor(request.priority)">
                {{ getPriorityText(request.priority) }}
              </Badge>
            </div>
            <p class="text-gray-600 mt-1">So'rov #{{ request.id }} • {{ request.createdAt }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button
            v-if="canEdit"
            @click="editRequest"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Tahrirlash
          </button>
          <button
            v-if="canAssign"
            @click="showAssignModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Texnik tayinlash
          </button>
          <button
            @click="showMoreMenu = !showMoreMenu"
            class="p-2 hover:bg-gray-100 rounded-lg relative"
          >
            <EllipsisVerticalIcon class="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
  
      <!-- Status Alert -->
      <div
        v-if="request.status === 'pending'"
        class="p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start space-x-3"
      >
        <ClockIcon class="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 class="font-semibold text-orange-900">Kutilmoqda</h3>
          <p class="text-sm text-orange-800">
            Ushbu so'rov hali tekshirilmagan. Texnik tayinlanishi kutilmoqda.
          </p>
        </div>
      </div>
  
      <div v-if="request.safetyConcern" class="p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start space-x-3">
        <ExclamationTriangleIcon class="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 class="font-semibold text-red-900">Xavfsizlik xavfi!</h3>
          <p class="text-sm text-red-800">{{ request.safetyDescription }}</p>
        </div>
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Request Details -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">So'rov tafsilotlari</h3>
            </template>
  
            <div class="space-y-6">
              <!-- Machine Info -->
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center justify-between mb-3">
                  <h4 class="font-medium text-gray-900">Uskuna</h4>
                  <button
                    @click="viewMachine"
                    class="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Batafsil →
                  </button>
                </div>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p class="text-gray-600">Nomi:</p>
                    <p class="font-medium text-gray-900">{{ request.machine.name }}</p>
                  </div>
                  <div>
                    <p class="text-gray-600">Kod:</p>
                    <p class="font-medium text-gray-900">{{ request.machine.code }}</p>
                  </div>
                  <div>
                    <p class="text-gray-600">Lokatsiya:</p>
                    <p class="font-medium text-gray-900">{{ request.machine.location }}</p>
                  </div>
                  <div>
                    <p class="text-gray-600">Holat:</p>
                    <Badge :color="getMachineStatusColor(request.machine.status)">
                      {{ getMachineStatusText(request.machine.status) }}
                    </Badge>
                  </div>
                </div>
              </div>
  
              <!-- Description -->
              <div>
                <h4 class="font-medium text-gray-900 mb-2">Muammo tavsifi</h4>
                <p class="text-gray-700 whitespace-pre-wrap">{{ request.description }}</p>
              </div>
  
              <!-- Component -->
              <div v-if="request.component">
                <h4 class="font-medium text-gray-900 mb-2">Komponent</h4>
                <p class="text-gray-700">{{ request.component }}</p>
              </div>
  
              <!-- Categories -->
              <div v-if="request.categories && request.categories.length > 0">
                <h4 class="font-medium text-gray-900 mb-2">Kategoriyalar</h4>
                <div class="flex flex-wrap gap-2">
                  <Badge v-for="cat in request.categories" :key="cat" color="blue">
                    {{ cat }}
                  </Badge>
                </div>
              </div>
  
              <!-- Attachments -->
              <div v-if="request.attachments && request.attachments.length > 0">
                <h4 class="font-medium text-gray-900 mb-2">Qo'shimcha fayllar</h4>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div
                    v-for="file in request.attachments"
                    :key="file.id"
                    @click="viewFile(file)"
                    class="relative group cursor-pointer"
                  >
                    <img
                      v-if="file.type === 'image'"
                      :src="file.url"
                      :alt="file.name"
                      class="w-full h-32 object-cover rounded-lg"
                    />
                    <div
                      v-else
                      class="w-full h-32 bg-gray-100 rounded-lg flex flex-col items-center justify-center"
                    >
                      <DocumentIcon class="w-8 h-8 text-gray-400 mb-1" />
                      <p class="text-xs text-gray-600 text-center px-2">{{ file.name }}</p>
                    </div>
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition flex items-center justify-center">
                      <EyeIcon class="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition" />
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Impact Assessment -->
              <div class="p-4 bg-gray-50 rounded-lg">
                <h4 class="font-medium text-gray-900 mb-3">Ta'sir baholash</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex items-center space-x-2">
                    <div :class="[
                      'w-2 h-2 rounded-full',
                      request.causesDowntime ? 'bg-red-600' : 'bg-gray-300'
                    ]"></div>
                    <span class="text-gray-700">Uskuna to'xtashi</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <div :class="[
                      'w-2 h-2 rounded-full',
                      request.safetyConcern ? 'bg-red-600' : 'bg-gray-300'
                    ]"></div>
                    <span class="text-gray-700">Xavfsizlik xavfi</span>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>
  
          <!-- Status Timeline -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Holat tarixi</h3>
            </template>
  
            <div class="space-y-4">
              <div
                v-for="(item, index) in request.timeline"
                :key="item.id"
                class="flex space-x-4"
              >
                <div class="flex flex-col items-center">
                  <div
                    :class="[
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      getTimelineColor(item.type)
                    ]"
                  >
                    <component :is="getTimelineIcon(item.type)" class="w-5 h-5 text-white" />
                  </div>
                  <div
                    v-if="index < request.timeline.length - 1"
                    class="w-0.5 h-full bg-gray-200 mt-2"
                  ></div>
                </div>
                <div class="flex-1 pb-6">
                  <div class="flex items-center justify-between mb-1">
                    <p class="font-medium text-gray-900">{{ item.title }}</p>
                    <span class="text-sm text-gray-600">{{ item.time }}</span>
                  </div>
                  <p class="text-sm text-gray-600">{{ item.description }}</p>
                  <p v-if="item.user" class="text-xs text-gray-500 mt-1">
                    {{ item.user }}
                  </p>
                </div>
              </div>
            </div>
          </BaseCard>
  
          <!-- Comments -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Izohlar</h3>
            </template>
  
            <div class="space-y-4">
              <div
                v-for="comment in request.comments"
                :key="comment.id"
                class="flex space-x-3"
              >
                <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-sm font-semibold text-gray-600">
                    {{ comment.user.name.split(' ').map(n => n[0]).join('') }}
                  </span>
                </div>
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-1">
                    <p class="font-medium text-gray-900">{{ comment.user.name }}</p>
                    <span class="text-xs text-gray-500">{{ comment.createdAt }}</span>
                  </div>
                  <p class="text-sm text-gray-700">{{ comment.text }}</p>
                </div>
              </div>
  
              <!-- Add Comment -->
              <div class="flex space-x-3 pt-4 border-t">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserIcon class="w-5 h-5 text-blue-600" />
                </div>
                <div class="flex-1">
                  <textarea
                    v-model="newComment"
                    rows="3"
                    placeholder="Izoh qo'shish..."
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                  <div class="flex justify-end mt-2">
                    <button
                      @click="addComment"
                      :disabled="!newComment.trim()"
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      Yuborish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
  
        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Harakatlar</h3>
            </template>
  
            <div class="space-y-2">
              <button
                v-if="canStart"
                @click="startWork"
                class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Ishni boshlash
              </button>
              <button
                v-if="canComplete"
                @click="showCompleteModal = true"
                class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Tugatish
              </button>
              <button
                v-if="canReopen"
                @click="reopenRequest"
                class="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Qayta ochish
              </button>
              <button
                @click="printRequest"
                class="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Chop etish
              </button>
            </div>
          </BaseCard>
  
          <!-- Assignment Info -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Mas'ul shaxslar</h3>
            </template>
  
            <div class="space-y-3">
              <div v-if="request.assignedTo">
                <p class="text-sm text-gray-600 mb-2">Mas'ul texnik</p>
                <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span class="text-sm font-semibold text-blue-600">
                      {{ request.assignedTo.name.split(' ').map(n => n[0]).join('') }}
                    </span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ request.assignedTo.name }}</p>
                    <p class="text-sm text-gray-600">{{ request.assignedTo.specialization }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="text-sm text-gray-600 text-center py-4">
                Hali texnik tayinlanmagan
              </div>
  
              <div v-if="request.supervisor">
                <p class="text-sm text-gray-600 mb-2">Nazoratchi</p>
                <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span class="text-sm font-semibold text-purple-600">
                      {{ request.supervisor.name.split(' ').map(n => n[0]).join('') }}
                    </span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ request.supervisor.name }}</p>
                    <p class="text-sm text-gray-600">{{ request.supervisor.role }}</p>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>
  
          <!-- Request Info -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">So'rov ma'lumotlari</h3>
            </template>
  
            <dl class="space-y-3 text-sm">
              <div>
                <dt class="text-gray-600">Yaratilgan:</dt>
                <dd class="font-medium text-gray-900">{{ request.createdAt }}</dd>
              </div>
              <div>
                <dt class="text-gray-600">So'rov beruvchi:</dt>
                <dd class="font-medium text-gray-900">{{ request.requester.name }}</dd>
              </div>
              <div v-if="request.preferredDate">
                <dt class="text-gray-600">Istagan sana:</dt>
                <dd class="font-medium text-gray-900">{{ request.preferredDate }}</dd>
              </div>
              <div v-if="request.contactPhone">
                <dt class="text-gray-600">Telefon:</dt>
                <dd class="font-medium text-gray-900">{{ request.contactPhone }}</dd>
              </div>
              <div v-if="request.completedAt">
                <dt class="text-gray-600">Tugatilgan:</dt>
                <dd class="font-medium text-gray-900">{{ request.completedAt }}</dd>
              </div>
              <div v-if="request.estimatedDuration">
                <dt class="text-gray-600">Davomiyligi:</dt>
                <dd class="font-medium text-gray-900">{{ request.estimatedDuration }}</dd>
              </div>
            </dl>
          </BaseCard>
  
          <!-- Related Requests -->
          <BaseCard v-if="relatedRequests.length > 0">
            <template #header>
              <h3 class="text-lg font-semibold">Bog'liq so'rovlar</h3>
            </template>
  
            <div class="space-y-2">
              <div
                v-for="req in relatedRequests"
                :key="req.id"
                @click="viewRequest(req.id)"
                class="p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition"
              >
                <div class="flex items-center justify-between mb-1">
                  <p class="font-medium text-gray-900 text-sm">{{ req.title }}</p>
                  <Badge :color="getStatusColor(req.status)" size="sm">
                    {{ getStatusText(req.status) }}
                  </Badge>
                </div>
                <p class="text-xs text-gray-600">{{ req.createdAt }}</p>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
  
      <!-- Assign Modal -->
      <Modal v-model="showAssignModal" title="Texnik tayinlash">
        <form @submit.prevent="assignTechnician" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Texnik tanlang
            </label>
            <select
              v-model="assignForm.technicianId"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Tanlang</option>
              <option v-for="tech in technicians" :key="tech.id" :value="tech.id">
                {{ tech.name }} - {{ tech.specialization }}
              </option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Rejalashtirilgan sana
            </label>
            <input
              v-model="assignForm.scheduledDate"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Izoh
            </label>
            <textarea
              v-model="assignForm.notes"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            ></textarea>
          </div>
  
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showAssignModal = false"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tayinlash
            </button>
          </div>
        </form>
      </Modal>
  
      <!-- Complete Modal -->
      <Modal v-model="showCompleteModal" title="So'rovni tugatish">
        <form @submit.prevent="completeRequest" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Bajarilgan ishlar
            </label>
            <textarea
              v-model="completeForm.workDone"
              rows="4"
              placeholder="Qanday ishlar bajarildi..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            ></textarea>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ishlatilingan qismlar
            </label>
            <textarea
              v-model="completeForm.partsUsed"
              rows="2"
              placeholder="Ehtiyot qismlar ro'yxati..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            ></textarea>
          </div>
  
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Sarflangan vaqt (soat)
              </label>
              <input
                v-model.number="completeForm.hoursSpent"
                type="number"
                min="0"
                step="0.5"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Xarajat
              </label>
              <input
                v-model.number="completeForm.cost"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
  
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showCompleteModal = false"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tugatish
            </button>
          </div>
        </form>
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useMaintenanceStore } from '@/stores/maintenance'
  import {
    ArrowLeftIcon,
    EllipsisVerticalIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    DocumentIcon,
    EyeIcon,
    UserIcon,
    CheckCircleIcon,
    XCircleIcon
  } from '@heroicons/vue/24/outline'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  import Modal from '@/components/common/overlays/Modal.vue'
  
  const route = useRoute()
  const router = useRouter()
  const maintenanceStore = useMaintenanceStore()
  
  const request = ref({
    id: route.params.id,
    title: 'Motor shovqini muammosi',
    status: 'in_progress',
    priority: 'high',
    type: 'repair',
    createdAt: '2024-01-27 10:30',
    description: 'Asosiy motordan g\'ayritabiiy shovqin eshitilmoqda. Tebranish kuchaygan.',
    component: 'Asosiy motor',
    categories: ['Mexanik', 'Elektr'],
    causesDowntime: true,
    safetyConcern: false,
    safetyDescription: '',
    attachments: [],
    machine: {
      id: 1,
      name: 'Ekstruziya mashinasi #1',
      code: 'EXT-001',
      location: 'Ishlab chiqarish binosi A',
      status: 'maintenance'
    },
    requester: {
      id: 1,
      name: 'Ali Valiyev',
      role: 'Operator'
    },
    assignedTo: {
      id: 1,
      name: 'Sardor Toshmatov',
      specialization: 'Mexanik texnik'
    },
    supervisor: null,
    preferredDate: '2024-01-28',
    contactPhone: '+998 90 123-45-67',
    timeline: [
      {
        id: 1,
        type: 'created',
        title: 'So\'rov yaratildi',
        description: 'Ali Valiyev tomonidan',
        user: 'Ali Valiyev',
        time: '2024-01-27 10:30'
      },
      {
        id: 2,
        type: 'assigned',
        title: 'Texnik tayinlandi',
        description: 'Sardor Toshmatov tayinlandi',
        user: 'Nodira Karimova',
        time: '2024-01-27 11:00'
      },
      {
        id: 3,
        type: 'started',
        title: 'Ish boshlandi',
        description: 'Diagnostika boshlandi',
        user: 'Sardor Toshmatov',
        time: '2024-01-27 13:00'
      }
    ],
    comments: [
      {
        id: 1,
        user: { name: 'Sardor Toshmatov' },
        text: 'Motorni tekshirdim. Podshipnik almashtirilishi kerak.',
        createdAt: '2024-01-27 14:00'
      }
    ]
  })
  
  const technicians = ref([])
  const relatedRequests = ref([])
  const newComment = ref('')
  const showAssignModal = ref(false)
  const showCompleteModal = ref(false)
  const showMoreMenu = ref(false)
  
  const assignForm = reactive({
    technicianId: '',
    scheduledDate: '',
    notes: ''
  })
  
  const completeForm = reactive({
    workDone: '',
    partsUsed: '',
    hoursSpent: 0,
    cost: 0
  })
  
  const canEdit = computed(() => request.value.status === 'pending' || request.value.status === 'assigned')
  const canAssign = computed(() => request.value.status === 'pending' || !request.value.assignedTo)
  const canStart = computed(() => request.value.status === 'assigned')
  const canComplete = computed(() => request.value.status === 'in_progress')
  const canReopen = computed(() => request.value.status === 'completed' || request.value.status === 'closed')
  
  const getStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      assigned: 'blue',
      in_progress: 'purple',
      completed: 'green',
      closed: 'gray',
      cancelled: 'red'
    }
    return colors[status] || 'gray'
  }
  
  const getStatusText = (status) => {
    const texts = {
      pending: 'Kutilmoqda',
      assigned: 'Tayinlangan',
      in_progress: 'Jarayonda',
      completed: 'Tugatilgan',
      closed: 'Yopilgan',
      cancelled: 'Bekor qilingan'
    }
    return texts[status] || status
  }
  
  const getPriorityColor = (priority) => {
    const colors = { low: 'blue', medium: 'orange', high: 'red' }
    return colors[priority] || 'gray'
  }
  
  const getPriorityText = (priority) => {
    const texts = { low: 'Past', medium: 'O\'rtacha', high: 'Yuqori' }
    return texts[priority] || priority
  }
  
  const getMachineStatusColor = (status) => {
    const colors = { active: 'green', maintenance: 'orange', stopped: 'red' }
    return colors[status] || 'gray'
  }
  
  const getMachineStatusText = (status) => {
    const texts = { active: 'Faol', maintenance: 'Texnik ko\'rikda', stopped: 'To\'xtatilgan' }
    return texts[status] || status
  }
  
  const getTimelineIcon = (type) => {
    const icons = {
      created: DocumentIcon,
      assigned: UserIcon,
      started: ClockIcon,
      completed: CheckCircleIcon,
      closed: XCircleIcon
    }
    return icons[type] || DocumentIcon
  }
  
  const getTimelineColor = (type) => {
    const colors = {
      created: 'bg-blue-600',
      assigned: 'bg-purple-600',
      started: 'bg-green-600',
      completed: 'bg-green-600',
      closed: 'bg-gray-600'
    }
    return colors[type] || 'bg-gray-600'
  }
  
  const viewMachine = () => {
    router.push(`/maintenance/machines/${request.value.machine.id}`)
  }
  
  const viewRequest = (id) => {
    router.push(`/maintenance/requests/${id}`)
  }
  
  const editRequest = () => {
    router.push(`/maintenance/requests/${request.value.id}/edit`)
  }
  
  const viewFile = (file) => {
    window.open(file.url, '_blank')
  }
  
  const addComment = async () => {
    if (!newComment.value.trim()) return
    
    try {
      await maintenanceStore.addComment(request.value.id, newComment.value)
      newComment.value = ''
      // Reload request
    } catch (error) {
      console.error('Failed to add comment:', error)
    }
  }
  
  const assignTechnician = async () => {
    try {
      await maintenanceStore.assignRequest(request.value.id, assignForm)
      showAssignModal.value = false
      // Reload request
    } catch (error) {
      console.error('Failed to assign technician:', error)
    }
  }
  
  const startWork = async () => {
    try {
      await maintenanceStore.startWork(request.value.id)
      // Reload request
    } catch (error) {
      console.error('Failed to start work:', error)
    }
  }
  
  const completeRequest = async () => {
    try {
      await maintenanceStore.completeRequest(request.value.id, completeForm)
      showCompleteModal.value = false
      // Reload request
    } catch (error) {
      console.error('Failed to complete request:', error)
    }
  }
  
  const reopenRequest = async () => {
    try {
      await maintenanceStore.reopenRequest(request.value.id)
      // Reload request
    } catch (error) {
      console.error('Failed to reopen request:', error)
    }
  }
  
  const printRequest = () => {
    window.print()
  }
  
  onMounted(async () => {
    // Load request details
    try {
      const data = await maintenanceStore.fetchRequest(route.params.id)
      request.value = data
    } catch (error) {
      console.error('Failed to load request:', error)
    }
    
    // Load technicians
    technicians.value = (await maintenanceStore.fetchTechnicians()).data
    
    // Load related requests
    if (request.value.machine.id) {
      relatedRequests.value = await maintenanceStore.fetchMachineRequests(
        request.value.machine.id,
        { limit: 5 }
      )
    }
  })
  </script>