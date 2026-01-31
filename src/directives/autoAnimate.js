import autoAnimate from '@formkit/auto-animate'

// Auto-animate directive for smooth list transitions
export default {
  mounted(el, binding) {
    // Initialize auto-animate
    const cleanup = autoAnimate(el, binding.value || {})
    el._autoAnimate = cleanup
  },
  
  unmounted(el) {
    if (el._autoAnimate) {
      el._autoAnimate()
    }
  },
}