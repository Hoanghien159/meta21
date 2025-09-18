<template>
  <div
    class="container-fluid"
    style="display: flex; height: 100%; overflow: hidden; padding: 0; gap: 0"
  >
    <div
      class="main-content"
      id="mainContent"
      style="flex: 1; min-width: 0; display: flex; flex-direction: column"
    >
      <!-- Slot for DataTable -->
      <slot name="datatable"></slot>
    </div>

    <!-- Slot for Automation Panel -->
    <slot name="automation-panel"></slot>
  </div>
</template>

<script setup>
// This component is for layout purposes only.
// No script logic is needed here.
</script>
