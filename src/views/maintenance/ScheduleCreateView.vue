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
            <h1 class="text-2xl font-bold text-gray-900">
              {{ isEdit ? 'Jadval tahrirlash' : 'Yangi texnik ko\'vik jadvali' }}
            </h1>
            <p class="text-gray-600 mt-1">Rejalashtirilgan texnik ko'rik yaratish</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="saveDraft"
            :disabled="saving"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Qoralama sifatida saqlash
          </button>
          <button
            @click="submitSchedule"
            :disabled="saving || !isValid"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ saving ? 'Saqlanmoqda...' : 'Saqlash va tasdiqlash' }}
          </button>
        </div>
      </div>
  
      <!-- Progress Steps -->
      <BaseCard>
        <div class="flex items-center justify-between">
          <div
            v-for="(step, index) in steps"
            :key="step.id"
            class="flex items-center flex-1"
          >
            <div class="flex items-center space-x-3">
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition',
                  currentStep > index
                    ? 'bg-green-600 text-white'
                    : currentStep === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                ]"
              >
                <CheckIcon v-if="currentStep > index" class="w-6 h-6" />
                <span v-else>{{ index + 1 }}</span>
              </div>
              <div>
                <p
                  :class="[
                    'font-medium',
                    currentStep >= index ? 'text-gray-900' : 'text-gray-500'
                  ]"
                >
                  {{ step.title }}
                </p>
                <p class="text-xs text-gray-600">{{ step.description }}</p>
              </div>
            </div>
            <div
              v-if="index < steps.length - 1"
              :class="[
                'flex-1 h-1 mx-4 rounded',
                currentStep > index ? 'bg-green-600' : 'bg-gray-200'
              ]"
            ></div>
          </div>
        </div>
      </BaseCard>
  
      <!-- Step 1: Basic Information -->
      <BaseCard v-if="currentStep === 0">
        <template #header>
          <h3 class="text-lg font-semibold">Asosiy ma'lumotlar</h3>
        </template>
  
        <form class="space-y-6">
          <!-- Schedule Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Texnik ko'rik turi <span class="text-red-600">*</span>
            </label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="type in maintenanceTypes"
                :key="type.id"
                @click="form.type = type.id"
                :class="[
                  'p-4 border-2 rounded-lg cursor-pointer transition',
                  form.type === type.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                ]"
              >
                <component :is="type.icon" :class="['w-8 h-8 mx-auto mb-2', form.type === type.id ? 'text-blue-600' : 'text-gray-400']" />
                <p :class="['text-center text-sm font-medium', form.type === type.id ? 'text-blue-900' : 'text-gray-700']">
                  {{ type.name }}
                </p>
              </div>
            </div>
            <p v-if="errors.type" class="text-red-600 text-sm mt-1">{{ errors.type }}</p>
          </div>
  
          <!-- Machine Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Uskuna <span class="text-red-600">*</span>
            </label>
            <select
              v-model="form.machineId"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Uskuna tanlang</option>
              <option v-for="machine in machines" :key="machine.id" :value="machine.id">
                {{ machine.code }} - {{ machine.name }}
              </option>
            </select>
            <p v-if="errors.machineId" class="text-red-600 text-sm mt-1">{{ errors.machineId }}</p>
          </div>
  
          <!-- Priority -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Muhimlik darajasi <span class="text-red-600">*</span>
            </label>
            <div class="grid grid-cols-3 gap-4">
              <div
                v-for="priority in priorities"
                :key="priority.value"
                @click="form.priority = priority.value"
                :class="[
                  'p-4 border-2 rounded-lg cursor-pointer transition text-center',
                  form.priority === priority.value
                    ? `border-${priority.color}-600 bg-${priority.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <Badge :color="priority.color" class="mb-2">{{ priority.label }}</Badge>
                <p class="text-sm text-gray-600">{{ priority.description }}</p>
              </div>
            </div>
          </div>
  
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Sarlavha <span class="text-red-600">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              placeholder="Masalan: Oylik to'liq texnik ko'rik"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p v-if="errors.title" class="text-red-600 text-sm mt-1">{{ errors.title }}</p>
          </div>
  
          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tavsif
            </label>
            <textarea
              v-model="form.description"
              rows="4"
              placeholder="Texnik ko'rik haqida batafsil ma'lumot..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>
        </form>
  
        <div class="flex justify-end mt-6">
          <button
            @click="nextStep"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Keyingisi
          </button>
        </div>
      </BaseCard>
  
      <!-- Step 2: Schedule Details -->
      <BaseCard v-if="currentStep === 1">
        <template #header>
          <h3 class="text-lg font-semibold">Jadval tafsilotlari</h3>
        </template>
  
        <form class="space-y-6">
          <!-- Schedule Type Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Jadval turi <span class="text-red-600">*</span>
            </label>
            <div class="grid grid-cols-2 gap-4">
              <div
                @click="form.scheduleType = 'once'"
                :class="[
                  'p-4 border-2 rounded-lg cursor-pointer transition',
                  form.scheduleType === 'once'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                ]"
              >
                <CalendarIcon :class="['w-6 h-6 mb-2', form.scheduleType === 'once' ? 'text-blue-600' : 'text-gray-400']" />
                <p class="font-medium">Bir martalik</p>
                <p class="text-sm text-gray-600">Aniq sana</p>
              </div>
              <div
                @click="form.scheduleType = 'recurring'"
                :class="[
                  'p-4 border-2 rounded-lg cursor-pointer transition',
                  form.scheduleType === 'recurring'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                ]"
              >
                <ArrowPathIcon :class="['w-6 h-6 mb-2', form.scheduleType === 'recurring' ? 'text-blue-600' : 'text-gray-400']" />
                <p class="font-medium">Takrorlanuvchi</p>
                <p class="text-sm text-gray-600">Davriy jadval</p>
              </div>
            </div>
          </div>
  
          <!-- One-time Schedule -->
          <div v-if="form.scheduleType === 'once'" class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Sana <span class="text-red-600">*</span>
              </label>
              <input
                v-model="form.scheduledDate"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Vaqt
              </label>
              <input
                v-model="form.scheduledTime"
                type="time"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
  
          <!-- Recurring Schedule -->
          <div v-if="form.scheduleType === 'recurring'" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Boshlanish sanasi <span class="text-red-600">*</span>
                </label>
                <input
                  v-model="form.startDate"
                  type="date"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tugash sanasi
                </label>
                <input
                  v-model="form.endDate"
                  type="date"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Takrorlanish davri <span class="text-red-600">*</span>
              </label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  v-for="freq in frequencies"
                  :key="freq.value"
                  type="button"
                  @click="form.frequency = freq.value"
                  :class="[
                    'px-4 py-3 border-2 rounded-lg font-medium transition',
                    form.frequency === freq.value
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-700 hover:border-blue-300'
                  ]"
                >
                  {{ freq.label }}
                </button>
              </div>
            </div>
  
            <div v-if="form.frequency === 'custom'" class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Har necha
                </label>
                <input
                  v-model.number="form.intervalValue"
                  type="number"
                  min="1"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Birlik
                </label>
                <select
                  v-model="form.intervalUnit"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="days">Kun</option>
                  <option value="weeks">Hafta</option>
                  <option value="months">Oy</option>
                </select>
              </div>
            </div>
          </div>
  
          <!-- Estimated Duration -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Taxminiy davomiyligi <span class="text-red-600">*</span>
            </label>
            <div class="grid grid-cols-3 gap-4">
              <input
                v-model.number="form.durationHours"
                type="number"
                min="0"
                placeholder="Soat"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                v-model.number="form.durationMinutes"
                type="number"
                min="0"
                max="59"
                placeholder="Daqiqa"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div class="flex items-center text-sm text-gray-600">
                Jami: {{ totalDuration }}
              </div>
            </div>
          </div>
  
          <!-- Downtime Expected -->
          <div>
            <label class="flex items-center space-x-2">
              <input
                v-model="form.requiresDowntime"
                type="checkbox"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="text-sm font-medium text-gray-700">
                To'xtash talab qilinadi
              </span>
            </label>
            <p class="text-xs text-gray-600 ml-6 mt-1">
              Agar texnik ko'rik vaqtida uskuna to'xtatilishi kerak bo'lsa belgilang
            </p>
          </div>
        </form>
  
        <div class="flex justify-between mt-6">
          <button
            @click="prevStep"
            class="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Orqaga
          </button>
          <button
            @click="nextStep"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Keyingisi
          </button>
        </div>
      </BaseCard>
  
      <!-- Step 3: Tasks & Checklist -->
      <BaseCard v-if="currentStep === 2">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Vazifalar va tekshiruv ro'yxati</h3>
            <button
              @click="addTask"
              class="text-sm text-blue-600 hover:text-blue-700"
            >
              + Vazifa qo'shish
            </button>
          </div>
        </template>
  
        <div class="space-y-4">
          <!-- Task Templates -->
          <div v-if="form.tasks.length === 0" class="text-center py-8">
            <ClipboardDocumentListIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600 mb-4">Hali vazifalar qo'shilmagan</p>
            <div class="flex justify-center space-x-3">
              <button
                @click="loadTemplate"
                class="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
              >
                Shablondan yuklash
              </button>
              <button
                @click="addTask"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Yangi vazifa
              </button>
            </div>
          </div>
  
          <!-- Task List -->
          <div
            v-for="(task, index) in form.tasks"
            :key="task.id"
            class="p-4 border border-gray-200 rounded-lg"
          >
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0 mt-1">
                <div class="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  {{ index + 1 }}
                </div>
              </div>
              <div class="flex-1 space-y-3">
                <input
                  v-model="task.title"
                  type="text"
                  placeholder="Vazifa nomi"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  v-model="task.description"
                  rows="2"
                  placeholder="Tavsif (ixtiyoriy)"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">
                      Taxminiy vaqt (daqiqa)
                    </label>
                    <input
                      v-model.number="task.estimatedMinutes"
                      type="number"
                      min="0"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">
                      Muhimlik
                    </label>
                    <select
                      v-model="task.priority"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="low">Past</option>
                      <option value="medium">O'rtacha</option>
                      <option value="high">Yuqori</option>
                    </select>
                  </div>
                </div>
              </div>
              <button
                @click="removeTask(index)"
                class="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <XMarkIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
  
        <div class="flex justify-between mt-6">
          <button
            @click="prevStep"
            class="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Orqaga
          </button>
          <button
            @click="nextStep"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Keyingisi
          </button>
        </div>
      </BaseCard>
  
      <!-- Step 4: Assignment -->
      <BaseCard v-if="currentStep === 3">
        <template #header>
          <h3 class="text-lg font-semibold">Mas'ul shaxslar</h3>
        </template>
  
        <form class="space-y-6">
          <!-- Primary Technician -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Mas'ul texnik <span class="text-red-600">*</span>
            </label>
            <select
              v-model="form.technicianId"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Texnik tanlang</option>
              <option v-for="tech in technicians" :key="tech.id" :value="tech.id">
                {{ tech.name }} - {{ tech.specialization }}
              </option>
            </select>
            <p v-if="errors.technicianId" class="text-red-600 text-sm mt-1">{{ errors.technicianId }}</p>
          </div>
  
          <!-- Additional Technicians -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Qo'shimcha texniklar
            </label>
            <div class="space-y-2">
              <div
                v-for="tech in availableTechnicians"
                :key="tech.id"
                class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div class="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    :value="tech.id"
                    v-model="form.additionalTechnicians"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p class="font-medium text-gray-900">{{ tech.name }}</p>
                    <p class="text-sm text-gray-600">{{ tech.specialization }}</p>
                  </div>
                </div>
                <Badge :color="tech.available ? 'green' : 'orange'">
                  {{ tech.available ? 'Mavjud' : 'Band' }}
                </Badge>
              </div>
            </div>
          </div>
  
          <!-- Supervisor -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nazoratchi
            </label>
            <select
              v-model="form.supervisorId"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tanlang (ixtiyoriy)</option>
              <option v-for="sup in supervisors" :key="sup.id" :value="sup.id">
                {{ sup.name }} - {{ sup.department }}
              </option>
            </select>
          </div>
  
          <!-- Notification Settings -->
          <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 class="font-medium text-gray-900 mb-3">Bildirishnoma sozlamalari</h4>
            <div class="space-y-2">
              <label class="flex items-center space-x-2">
                <input
                  v-model="form.notifications.email"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="text-sm text-gray-700">Email orqali xabarnoma</span>
              </label>
              <label class="flex items-center space-x-2">
                <input
                  v-model="form.notifications.sms"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="text-sm text-gray-700">SMS xabarnoma</span>
              </label>
              <label class="flex items-center space-x-2">
                <input
                  v-model="form.notifications.reminder"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="text-sm text-gray-700">Eslatma yuborish</span>
              </label>
            </div>
            <div v-if="form.notifications.reminder" class="mt-3">
              <label class="block text-xs font-medium text-gray-700 mb-1">
                Eslatma vaqti
              </label>
              <select
                v-model="form.reminderTime"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="1h">1 soat oldin</option>
                <option value="3h">3 soat oldin</option>
                <option value="1d">1 kun oldin</option>
                <option value="3d">3 kun oldin</option>
              </select>
            </div>
          </div>
        </form>
  
        <div class="flex justify-between mt-6">
          <button
            @click="prevStep"
            class="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Orqaga
          </button>
          <button
            @click="nextStep"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Ko'rib chiqish
          </button>
        </div>
      </BaseCard>
  
      <!-- Step 5: Review -->
      <BaseCard v-if="currentStep === 4">
        <template #header>
          <h3 class="text-lg font-semibold">Ko'rib chiqish va tasdiqlash</h3>
        </template>
  
        <div class="space-y-6">
          <!-- Basic Info Summary -->
          <div class="p-4 bg-gray-50 rounded-lg">
            <h4 class="font-semibold text-gray-900 mb-3">Asosiy ma'lumotlar</h4>
            <dl class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt class="text-gray-600">Turi:</dt>
                <dd class="font-medium text-gray-900">{{ getMaintenanceTypeName(form.type) }}</dd>
              </div>
              <div>
                <dt class="text-gray-600">Uskuna:</dt>
                <dd class="font-medium text-gray-900">{{ getMachineName(form.machineId) }}</dd>
              </div>
              <div>
                <dt class="text-gray-600">Muhimlik:</dt>
                <dd><Badge :color="getPriorityColor(form.priority)">{{ form.priority }}</Badge></dd>
              </div>
              <div>
                <dt class="text-gray-600">Sarlavha:</dt>
                <dd class="font-medium text-gray-900">{{ form.title }}</dd>
              </div>
            </dl>
          </div>
  
          <!-- Schedule Summary -->
          <div class="p-4 bg-gray-50 rounded-lg">
            <h4 class="font-semibold text-gray-900 mb-3">Jadval</h4>
            <dl class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt class="text-gray-600">Jadval turi:</dt>
                <dd class="font-medium text-gray-900">{{ form.scheduleType === 'once' ? 'Bir martalik' : 'Takrorlanuvchi' }}</dd>
              </div>
              <div v-if="form.scheduleType === 'once'">
                <dt class="text-gray-600">Sana:</dt>
                <dd class="font-medium text-gray-900">{{ form.scheduledDate }}</dd>
              </div>
              <div v-if="form.scheduleType === 'recurring'">
                <dt class="text-gray-600">Boshlanish:</dt>
                <dd class="font-medium text-gray-900">{{ form.startDate }}</dd>
              </div>
              <div v-if="form.scheduleType === 'recurring'">
                <dt class="text-gray-600">Takrorlanish:</dt>
                <dd class="font-medium text-gray-900">{{ getFrequencyLabel(form.frequency) }}</dd>
              </div>
              <div>
                <dt class="text-gray-600">Davomiyligi:</dt>
                <dd class="font-medium text-gray-900">{{ totalDuration }}</dd>
              </div>
              <div>
                <dt class="text-gray-600">To'xtash:</dt>
                <dd class="font-medium text-gray-900">{{ form.requiresDowntime ? 'Ha' : 'Yo\'q' }}</dd>
              </div>
            </dl>
          </div>
  
          <!-- Tasks Summary -->
          <div class="p-4 bg-gray-50 rounded-lg">
            <h4 class="font-semibold text-gray-900 mb-3">Vazifalar ({{ form.tasks.length }})</h4>
            <ul class="space-y-2">
              <li v-for="(task, index) in form.tasks" :key="task.id" class="text-sm flex items-center space-x-2">
                <span class="text-gray-600">{{ index + 1 }}.</span>
                <span class="text-gray-900">{{ task.title }}</span>
                <Badge v-if="task.priority === 'high'" color="red" size="sm">Yuqori</Badge>
              </li>
            </ul>
          </div>
  
          <!-- Assignment Summary -->
          <div class="p-4 bg-gray-50 rounded-lg">
            <h4 class="font-semibold text-gray-900 mb-3">Mas'ul shaxslar</h4>
            <dl class="space-y-2 text-sm">
              <div>
                <dt class="text-gray-600">Mas'ul texnik:</dt>
                <dd class="font-medium text-gray-900">{{ getTechnicianName(form.technicianId) }}</dd>
              </div>
              <div v-if="form.additionalTechnicians.length > 0">
                <dt class="text-gray-600">Qo'shimcha:</dt>
                <dd class="font-medium text-gray-900">{{ form.additionalTechnicians.length }} ta texnik</dd>
              </div>
              <div v-if="form.supervisorId">
                <dt class="text-gray-600">Nazoratchi:</dt>
                <dd class="font-medium text-gray-900">{{ getSupervisorName(form.supervisorId) }}</dd>
              </div>
            </dl>
          </div>
        </div>
  
        <div class="flex justify-between mt-6">
          <button
            @click="prevStep"
            class="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Orqaga
          </button>
          <button
            @click="submitSchedule"
            :disabled="saving"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ saving ? 'Saqlanmoqda...' : 'Tasdiqlash va saqlash' }}
          </button>
        </div>
      </BaseCard>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useMaintenanceStore } from '@/stores/maintenance'
  import {
    ArrowLeftIcon,
    CheckIcon,
    ClockIcon,
    WrenchScrewdriverIcon,
    CogIcon,
    BeakerIcon,
    CalendarIcon,
    ArrowPathIcon,
    ClipboardDocumentListIcon,
    XMarkIcon
  } from '@heroicons/vue/24/outline'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  
  const route = useRoute()
  const router = useRouter()
  const maintenanceStore = useMaintenanceStore()
  
  const isEdit = computed(() => !!route.params.id)
  const saving = ref(false)
  const currentStep = ref(0)
  
  const steps = [
    { id: 1, title: 'Asosiy ma\'lumotlar', description: 'Turi va uskuna' },
    { id: 2, title: 'Jadval', description: 'Sana va vaqt' },
    { id: 3, title: 'Vazifalar', description: 'Tekshiruv ro\'yxati' },
    { id: 4, title: 'Mas\'ullar', description: 'Texniklar' },
    { id: 5, title: 'Ko\'rib chiqish', description: 'Tasdiqlash' }
  ]
  
  const maintenanceTypes = [
    { id: 'preventive', name: 'Profilaktik', icon: ClockIcon },
    { id: 'corrective', name: 'Tuzatish', icon: WrenchScrewdriverIcon },
    { id: 'predictive', name: 'Bashoratli', icon: BeakerIcon },
    { id: 'inspection', name: 'Tekshiruv', icon: CogIcon }
  ]
  
  const priorities = [
    { value: 'low', label: 'Past', color: 'blue', description: 'Oddiy texnik ko\'rik' },
    { value: 'medium', label: 'O\'rtacha', color: 'orange', description: 'Rejalashtirilgan' },
    { value: 'high', label: 'Yuqori', color: 'red', description: 'Muhim va zarur' }
  ]
  
  const frequencies = [
    { value: 'daily', label: 'Kunlik' },
    { value: 'weekly', label: 'Haftalik' },
    { value: 'monthly', label: 'Oylik' },
    { value: 'custom', label: 'Boshqa' }
  ]
  
  const machines = ref([])
  const technicians = ref([])
  const supervisors = ref([])
  
  const form = reactive({
    type: '',
    machineId: '',
    priority: 'medium',
    title: '',
    description: '',
    scheduleType: 'once',
    scheduledDate: '',
    scheduledTime: '',
    startDate: '',
    endDate: '',
    frequency: 'monthly',
    intervalValue: 1,
    intervalUnit: 'months',
    durationHours: 0,
    durationMinutes: 0,
    requiresDowntime: false,
    tasks: [],
    technicianId: '',
    additionalTechnicians: [],
    supervisorId: '',
    notifications: {
      email: true,
      sms: false,
      reminder: true
    },
    reminderTime: '1d'
  })
  
  const errors = ref({})
  
  const availableTechnicians = computed(() => {
    return technicians.value.filter(t => t.id !== form.technicianId)
  })
  
  const totalDuration = computed(() => {
    const hours = form.durationHours || 0
    const minutes = form.durationMinutes || 0
    if (hours === 0 && minutes === 0) return '-'
    return `${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm' : ''}`
  })
  
  const isValid = computed(() => {
    return form.type &&
           form.machineId &&
           form.title &&
           form.technicianId &&
           (form.scheduleType === 'once' ? form.scheduledDate : form.startDate)
  })
  
  const nextStep = () => {
    if (validateCurrentStep()) {
      currentStep.value++
    }
  }
  
  const prevStep = () => {
    currentStep.value--
  }
  
  const validateCurrentStep = () => {
    errors.value = {}
    
    if (currentStep.value === 0) {
      if (!form.type) errors.value.type = 'Texnik ko\'vik turini tanlang'
      if (!form.machineId) errors.value.machineId = 'Uskunani tanlang'
      if (!form.title) errors.value.title = 'Sarlavhani kiriting'
    }
    
    if (currentStep.value === 3) {
      if (!form.technicianId) errors.value.technicianId = 'Mas\'ul texnikni tanlang'
    }
    
    return Object.keys(errors.value).length === 0
  }
  
  const addTask = () => {
    form.tasks.push({
      id: Date.now(),
      title: '',
      description: '',
      estimatedMinutes: 0,
      priority: 'medium'
    })
  }
  
  const removeTask = (index) => {
    form.tasks.splice(index, 1)
  }
  
  const loadTemplate = () => {
    // Load predefined template based on maintenance type
    const templates = {
      preventive: [
        { title: 'Vizual ko\'zdan kechirish', estimatedMinutes: 15, priority: 'high' },
        { title: 'Yog\'lash', estimatedMinutes: 30, priority: 'high' },
        { title: 'Filtrlarni tozalash', estimatedMinutes: 20, priority: 'medium' }
      ]
    }
    
    if (templates[form.type]) {
      form.tasks = templates[form.type].map((t, i) => ({
        id: Date.now() + i,
        ...t,
        description: ''
      }))
    }
  }
  
  const submitSchedule = async () => {
    if (!isValid.value) return
    
    saving.value = true
    try {
      if (isEdit.value) {
        await maintenanceStore.updateSchedule(route.params.id, form)
      } else {
        await maintenanceStore.createSchedule(form)
      }
      router.push({ name: 'maintenance-schedule' })
    } catch (error) {
      console.error('Failed to save schedule:', error)
    } finally {
      saving.value = false
    }
  }
  
  const saveDraft = async () => {
    saving.value = true
    try {
      await maintenanceStore.saveDraft(form)
      router.push({ name: 'maintenance-schedule' })
    } finally {
      saving.value = false
    }
  }
  
  const getMaintenanceTypeName = (type) => {
    return maintenanceTypes.find(t => t.id === type)?.name || type
  }
  
  const getMachineName = (id) => {
    return machines.value.find(m => m.id === id)?.name || '-'
  }
  
  const getPriorityColor = (priority) => {
    return priorities.find(p => p.value === priority)?.color || 'gray'
  }
  
  const getFrequencyLabel = (freq) => {
    return frequencies.find(f => f.value === freq)?.label || freq
  }
  
  const getTechnicianName = (id) => {
    return technicians.value.find(t => t.id === id)?.name || '-'
  }
  
  const getSupervisorName = (id) => {
    return supervisors.value.find(s => s.id === id)?.name || '-'
  }
  
  onMounted(async () => {
    // Load machines and technicians
    machines.value = (await maintenanceStore.fetchMachines()).data
    technicians.value = (await maintenanceStore.fetchTechnicians()).data
    supervisors.value = (await maintenanceStore.fetchSupervisors()).data
    
    // Load existing schedule if editing
    if (isEdit.value) {
      const schedule = await maintenanceStore.fetchSchedule(route.params.id)
      Object.assign(form, schedule)
    }
  })
  </script>