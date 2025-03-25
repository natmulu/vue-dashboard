<template>
  <ThemeProvider>
    <SidebarProvider>
      <RouterView />
    </SidebarProvider>
  </ThemeProvider>
</template>

<script>
import ThemeProvider from './components/layout/ThemeProvider.vue'
import SidebarProvider from './components/layout/SidebarProvider.vue'

export default {
  components: {
    ThemeProvider,
    SidebarProvider,
  },
  created() {
    this.$store.dispatch('applyHeader')
  }
}
</script>
