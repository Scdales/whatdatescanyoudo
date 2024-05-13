export function set(d: any) {
  localStorage.setItem('data', d)
}

export function get() {
  return localStorage.getItem('data')
}
