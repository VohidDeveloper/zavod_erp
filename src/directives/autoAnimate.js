/**
 * Auto Animate Directive
 * Automatically animates element changes (add/remove/reorder)
 * Uses CSS transitions for smooth animations
 * Usage: v-auto-animate or v-auto-animate="{ duration: 300 }"
 */

const defaultConfig = {
    duration: 250,
    easing: 'ease-in-out'
  }
  
  export default {
    mounted(el, binding) {
      const config = { ...defaultConfig, ...(binding.value || {}) }
      
      // Store original styles
      const originalTransition = el.style.transition
      
      // Enable transitions
      el.style.transition = `all ${config.duration}ms ${config.easing}`
      
      // Create mutation observer
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          // Handle added nodes
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              node.style.transition = `all ${config.duration}ms ${config.easing}`
              node.style.opacity = '0'
              node.style.transform = 'translateY(-10px)'
              
              // Trigger animation
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  node.style.opacity = '1'
                  node.style.transform = 'translateY(0)'
                })
              })
            }
          })
          
          // Handle removed nodes
          mutation.removedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              node.style.opacity = '0'
              node.style.transform = 'translateY(-10px)'
            }
          })
        })
      })
      
      // Start observing
      observer.observe(el, {
        childList: true,
        subtree: true
      })
      
      // Store observer and original transition for cleanup
      el._autoAnimateObserver = observer
      el._autoAnimateOriginalTransition = originalTransition
    },
    
    unmounted(el) {
      // Cleanup
      if (el._autoAnimateObserver) {
        el._autoAnimateObserver.disconnect()
        delete el._autoAnimateObserver
      }
      
      // Restore original transition
      if (el._autoAnimateOriginalTransition !== undefined) {
        el.style.transition = el._autoAnimateOriginalTransition
        delete el._autoAnimateOriginalTransition
      }
    }
  }