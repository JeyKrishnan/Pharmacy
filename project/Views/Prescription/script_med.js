let medicines = [
            {
                id: 1,
                name: "Aspirin 500mg",
                brand: "Bayer",
                quantity: 1,
                price: 150,
                image: "../images/aspirin.webp"
            },
            {
                id: 2,
                name: "Paracetamol 650mg",
                brand: "Calpol",
                quantity: 1,
                price: 120,
                image: "../images/paracetamol.webp"
            },
            {
                id: 3,
                name: "Amoxicillin 250mg",
                brand: "Augmentin",
                quantity: 1,
                price: 140,
                image: "../images/amoxicillin.webp"
            },
            {
                id: 4,
                name: "Cough Syrup",
                brand: "Nature's Gift",
                quantity: 1,
                price: 180,
                image: "../images/cough-syrup.webp"
            },
            {
                id: 5,
                name: "Vitamin Injection",
                brand: "HealthPlus",
                quantity: 2,
                price: 500,
                image: "../images/Vitamin-Injections.webp"
            }
        ];
 
// Render medicines on page load
$(document).ready(function() {
    renderMedicines(medicines);
});
 
if (!localStorage.getItem("prescriptions")) {
      localStorage.setItem("prescriptions", JSON.stringify([]));
  } 
 
function renderMedicines(medicineList) {
    let html = '';
    let totalPrice = 0;
 
    medicineList.forEach(medicine => {
        const itemTotal = medicine.quantity * medicine.price;
        totalPrice += itemTotal;
        html += `
        <div class="medicine-card mb-3" data-id="${medicine.id}">
            <div class="row align-items-center">
                <div class="col-auto">
                    <div class="medicine-icon">
                        ${
                            medicine.image.includes(".webp")
                            ? `<img src="${medicine.image}" alt="${medicine.name}" style="width:45px; height:45px; object-fit:contain;">`
                            : medicine.image
                        }
                    </div>
                </div>
 
                <div class="col">
                    <h6 class="mb-1 fw-bold text-dark">${medicine.name}</h6>
                    <small class="text-muted">Brand: ${medicine.brand}</small>
                </div>
                <div class="col-auto text-center">
                    <small class="d-block text-muted">Qty</small>
                    <strong>${medicine.quantity}</strong>
                </div>
                <div class="col-auto text-end">
                    <small class="d-block text-muted">Price</small>
                    <strong class="text-primary">₹${itemTotal.toLocaleString()}</strong>
                </div>
                <div class="col-auto">
                    <button class="btn btn-sm btn-outline-danger remove-medicine" data-id="${medicine.id}">
                        <i class="bi bi-dash"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success add-medicine" data-id="${medicine.id}">
                        <i class="bi bi-plus"></i>
                    </button>
                </div>
 
            </div>
        </div>
        <hr>
        `;
    });
 
    html += `
        <div class="row mt-4">
            <div class="col-6">
                <h5>Subtotal:</h5>
            </div>
            <div class="col-6 text-end">
                <h5 class="text-primary">₹${totalPrice.toLocaleString()}</h5>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-6">
                <h5>Delivery Charges:</h5>
            </div>
            <div class="col-6 text-end">
                <h5 class="text-success">FREE</h5>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-6">
                <h4 class="fw-bold">Total:</h4>
            </div>
            <div class="col-6 text-end">
                <h4 class="text-success fw-bold">₹${totalPrice.toLocaleString()}</h4>
            </div>
        </div>
    `;
 
    $('#medicinesList').html(html);
 
    // Remove medicine functionality
    $('.remove-medicine').click(function() {
        const id = parseInt($(this).data('id'));
        const med = medicines.find(m => m.id === id);
        if (med) {
            if (med.quantity > 1) {
                med.quantity -= 1; // reduce quantity
            } else {
                medicines = medicines.filter(m => m.id !== id); // remove if last one
            }
        }
        renderMedicines(medicines); // re-render with updated list
    });
 
    $('.add-medicine').click(function() {
        const id = parseInt($(this).data('id'));
        const med = medicines.find(m => m.id === id);
        if (med) {
            med.quantity += 1;
        }
        renderMedicines(medicines);
    });
}
 
// Handle proceed button
$('#proceedBtn').click(function() {
    
    const prescriptionFile = $('#prescriptionFile').val();
    const userDoctor = $('#userDoctor').val();
 
    if (!prescriptionFile || !userDoctor) {
        alert('Please fill all required fields!');
        return;
    }
 
    // Store data in sessionStorage
    sessionStorage.setItem('prescriptionFile', $('#prescriptionFile')[0].files[0].name);
    sessionStorage.setItem('userDoctor', userDoctor);
    sessionStorage.setItem('notes', $('#notes').val());
    sessionStorage.setItem('medicines', JSON.stringify(medicines));
    let prescriptions = JSON.parse(localStorage.getItem("prescriptions")) || [];
 
      const newPres = {
          id: Date.now(),
          customer: $("#userCustomer").val(),
          doctor: $("#userDoctor").val(),
          issued: new Date().toISOString().slice(0, 10),
          status: "PENDING"
      };
 
      prescriptions.push(newPres);
 
      localStorage.setItem("prescriptions", JSON.stringify(prescriptions));
    // Redirect to timer page
    window.location.href = 'timer.html';
});
if (!localStorage.getItem("prescriptions")) {
      localStorage.setItem("prescriptions", JSON.stringify([]));
  }
 
  //----------------------------------------------------
  // LOAD USER PRESCRIPTIONS
  //----------------------------------------------------
  function loadUserPrescriptions() {
      let prescriptions = JSON.parse(localStorage.getItem("prescriptions")) || [];
      prescriptions = prescriptions.filter(p => p.status !== "VALIDATED");
    localStorage.setItem("prescriptions", JSON.stringify(prescriptions));
    
    const tbody = $("#userStatusTable tbody");
    
    tbody.empty();
 
      if (prescriptions.length === 0) {
          tbody.append(`<tr><td colspan="4" class="text-center text-muted">No prescriptions uploaded.</td></tr>`);
          return;
      }
 
      prescriptions.forEach(p => {
          tbody.append(`
              <tr>
                <td>${p.id}</td>
                <td>${p.doctor}</td>
                <td>${p.issued}</td>
                <td><span class="badge bg-${p.status === "VALIDATED" ? "success" : "warning"}">${p.status}</span></td>
              </tr>
          `);
      });
      
const hasValidated = prescriptions.some(p => p.status === "VALIDATED");
  if (hasValidated) {
    setTimeout(function() {
      window.location.href = '../Medicine/my_order.html';
    }, 2000);
  }
  }
 
  //----------------------------------------------------
  // USER UPLOAD PRESCRIPTION
  //----------------------------------------------------
  $("#uploadUserPrescriptionForm").on("submit", function(e){
      e.preventDefault();
 
      let prescriptions = JSON.parse(localStorage.getItem("prescriptions")) || [];
 
      const newPres = {
          id: Date.now(),
          customer: $("#userCustomer").val(),
          doctor: $("#userDoctor").val(),
          issued: new Date().toISOString().slice(0, 10),
          status: "PENDING"
      };
 
      prescriptions.push(newPres);
 
      localStorage.setItem("prescriptions", JSON.stringify(prescriptions));
 
      alert("Prescription submitted to pharmacist!");
 
      this.reset();
      loadUserPrescriptions();
  });
 
  loadUserPrescriptions();
