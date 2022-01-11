self.addEventListener('push', e => {
  const body = e.data ? e.data.text() : 'Notificação'
  const options = {
    body,
    icon: '',
    vibrate: [100, 50, 100],
    data: {}
  }
  e.waitUntil(self.registration.showNotification('Asq', options))
})
