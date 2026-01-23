export default {
    mounted(el, binding) {
      const tooltip = document.createElement('div')
      tooltip.className = 'absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg opacity-0 transition-opacity duration-200 pointer-events-none'
      tooltip.textContent = binding.value
      tooltip.setAttribute('data-tooltip', 'true')
      
      el.style.position = 'relative'
      el.appendChild(tooltip)
      
      el.addEventListener('mouseenter', () => {
        tooltip.classList.remove('opacity-0')
        tooltip.classList.add('opacity-100')
      })
      
      el.addEventListener('mouseleave', () => {
        tooltip.classList.remove('opacity-100')
        tooltip.classList.add('opacity-0')
      })
    },
    
    updated(el, binding) {
      const tooltip = el.querySelector('[data-tooltip="true"]')
      if (tooltip) {
        tooltip.textContent = binding.value
      }
    },
    
    unmounted(el) {
      const tooltip = el.querySelector('[data-tooltip="true"]')
      if (tooltip) {
        tooltip.remove()
      }
    }
  }