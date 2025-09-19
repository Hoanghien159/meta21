<template>
  <div>
    <AdsReloadPopup :is-visible="activeModal === 'ads'" @close="closeModal" @load-data="handleLoadDataRequest" />
    <BmReloadPopup :is-visible="activeModal === 'bm'" @close="closeModal" @load-data="handleLoadDataRequest" />
    <!-- Thêm các modal khác ở đây -->
  </div>
</template>

<script setup>
import { usePageReloader } from '@/composables/usePageReloader'
import AdsReloadPopup from '@/components/AdsReloadPopup.vue'
import BmReloadPopup from '@/components/BmReloadPopup.vue'

const emit = defineEmits(['load-data']);
const { activeModal, closeModal } = usePageReloader()

const handleLoadDataRequest = (settings) => {
  emit('load-data', settings);
};
</script>
