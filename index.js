let eventSource
const setupChannel = (url, params, listeners = []) => {
  eventSource = new EventSource(url, params)
  eventSource.onerror = function(event) {
    if (event.target.readyState === EventSource.CONNECTING) {
      console.log('Channel: Reconnecting...')
    } else if (event.target.readyState === EventSource.CLOSED) {
      console.log('Channel: Connection failed permanently. Reconnecting...')
      eventSource.close()
      setTimeout(() => {
        setupChannel(url, params, listeners)
      }, 2000)
    }
  }
  eventSource.onopen = () => {
    listeners.map(listener => eventSource.addEventListener(listener.name, listener.cb))
  }
  eventSource.closeEvents = () => {
    eventSource.close()
    listeners.map(listener => eventSource.removeEventListener(listener.name, listener.cb))
  }
  return eventSource
}

exports.createChannel = function(url, params, listeners = []) {
  return setupChannel(url, params, listeners)
}
