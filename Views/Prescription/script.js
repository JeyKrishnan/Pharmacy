// Generic utilities for both pages
if (!localStorage.getItem("prescriptions")) {
      localStorage.setItem("prescriptions", JSON.stringify([]));
  } 
// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}
 
// Validate file size
function validateFileSize(file, maxSizeMB = 5) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
}
 
// Validate file type
function validateFileType(file, allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']) {
    return allowedTypes.includes(file.type);
}
 
// Show toast notification
function showToast(message, type = 'info') {
    const toastHTML = `
        <div class="toast align-items-center text-white bg-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'}" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    const toastContainer = document.createElement('div');
    toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
    toastContainer.style.zIndex = '11';
    toastContainer.innerHTML = toastHTML;
    document.body.appendChild(toastContainer);
    
    const bootstrap = window.bootstrap;
    const toast = new bootstrap.Toast(toastContainer.querySelector('.toast'));
    toast.show();
    
    setTimeout(() => document.body.removeChild(toastContainer), 5000);
}
 
// Smooth scroll
function smoothScroll(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
 
// Log for debugging
function logDebug(message, data = null) {
    if (data) {
        console.log(`[Pharma] ${message}:`, data);
    } else {
        console.log(`[Pharma] ${message}`);
    }
}
 
// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    logDebug('Pharma system initialized');
});


 
