// Tooltip directive
export default {
    mounted(el, binding) {
      const tooltip = document.createElement('div')
      tooltip.textContent = binding.value
      tooltip.className = 'tooltip absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg opacity-0 pointer-events-none transition-opacity duration-200'
      tooltip.style.position = 'absolute'
      tooltip.style.whiteSpace = 'nowrap'
      
      el.style.position = 'relative'
      
      const showTooltip = () => {
        document.body.appendChild(tooltip)
        
        const rect = el.getBoundingClientRect()
        const tooltipRect = tooltip.getBoundingClientRect()
        
        // Position tooltip above element
        tooltip.style.left = rect.left + (rect.width - tooltipRect.width) / 2 + 'px'
        tooltip.style.top = rect.top - tooltipRect.height - 8 + window.scrollY + 'px'
        
        setTimeout(() => {
          tooltip.style.opacity = '1'
        }, 10)
      }
      
      const hideTooltip = () => {
        tooltip.style.opacity = '0'
        setTimeout(() => {
          if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip)
          }
        }, 200)
      }
      
      el.addEventListener('mouseenter', showTooltip)
      el.addEventListener('mouseleave', hideTooltip)
      
      el._tooltip = { tooltip, showTooltip, hideTooltip }
    },
    
    updated(el, binding) {
      if (el._tooltip && el._tooltip.tooltip) {
        el._tooltip.tooltip.textContent = binding.value
      }
    },
    
    unmounted(el) {
      if (el._tooltip) {
        el.removeEventListener('mouseenter', el._tooltip.showTooltip)
        el.removeEventListener('mouseleave', el._tooltip.hideTooltip)
        if (el._tooltip.tooltip.parentNode) {
          el._tooltip.tooltip.parentNode.removeChild(el._tooltip.tooltip)
        }
      }
    },
  }