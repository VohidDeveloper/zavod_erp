/**
 * Auto Focus Directive
 * Automatically focuses element when mounted
 * Usage: v-focus
 */

export default {
    mounted(el) {
      // Focus with slight delay to ensure DOM is ready
      setTimeout(() => {
        el.focus()
      }, 50)
    }
  }