/**
 * Click Outside Directive
 * Triggers callback when user clicks outside the element
 * Usage: v-click-outside="handleClickOutside"
 */

export default {
    mounted(el, binding) {
      el.clickOutsideEvent = function(event) {
        // Check if clicked element is outside the bound element and its children
        if (!(el === event.target || el.contains(event.target))) {
          // Call the provided method
          if (typeof binding.value === 'function') {
            binding.value(event)
          }
        }
      }
      
      // Add listener with slight delay to avoid immediate trigger
      setTimeout(() => {
        document.addEventListener('click', el.clickOutsideEvent)
        document.addEventListener('touchstart', el.clickOutsideEvent)
      }, 0)
    },
    
    unmounted(el) {
      // Clean up listeners
      document.removeEventListener('click', el.clickOutsideEvent)
      document.removeEventListener('touchstart', el.clickOutsideEvent)
      delete el.clickOutsideEvent
    }
  }