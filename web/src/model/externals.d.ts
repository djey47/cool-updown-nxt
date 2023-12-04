declare module 'tailwind-toastify' {
  function showAlert(type: 'info' | 'error' | 'success', title: string, message: string): void;
  export { showAlert };
}
