export function set(d) {
  localStorage.setItem('data', d)
}

export function get() {
  return localStorage.getItem('data')
}
