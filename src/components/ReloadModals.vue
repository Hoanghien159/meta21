<template>
  <div>
    <AdsReloadPopup :is-visible="activeModal === 'ads'" @close="closeModal" @load-data="loadData" />
    <BmReloadPopup :is-visible="activeModal === 'bm'" @close="closeModal" @load-data="loadData" />
    <!-- Thêm các modal khác ở đây -->
  </div>
</template>

<script setup>
import { usePageReloader } from '@/composables/usePageReloader'
import AdsReloadPopup from '@/components/AdsReloadPopup.vue'
import BmReloadPopup from '@/components/BmReloadPopup.vue'

const { activeModal, closeModal, loadData } = usePageReloader()
</script>
