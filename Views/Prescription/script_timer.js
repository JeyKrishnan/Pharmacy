if (!localStorage.getItem("prescriptions")) {
      localStorage.setItem("prescriptions", JSON.stringify([]));
  } 
        let timeRemaining = 30;
 
        $(document).ready(function() {
            // Get data from sessionStorage
            const medicines = JSON.parse(sessionStorage.getItem('medicines'));
            const userDoctor = sessionStorage.getItem('userDoctor');
            const notes = sessionStorage.getItem('notes');
 
            // Render blurred medicines background
            renderBlurredMedicines(medicines);
 
            // Render order summary
            renderOrderSummary(medicines, userDoctor, notes);
 
            // Start timer
            startTimer();
        });
 
        function renderBlurredMedicines(medicineList) {
            let html = '';
            medicineList.forEach(medicine => {
                html += `
                    <div class="blurred-medicine-card">
                        <div class="medicine-icon">${medicine.image}</div>
                        <p class="medicine-name">${medicine.name}</p>
                    </div>
                `;
            });
            $('#blurredMedicinesList').html(html);
        }
 
        function renderOrderSummary(medicineList, userDoctor, notes) {
            let html = `
                <div class="mb-3">
                    <strong>Doctor Name:</strong>
                    <p class="text-muted">${userDoctor}</p>
                </div>
                <div class="mb-3">
                    <strong>Items in Order:</strong>
                    <p class="text-muted">${medicineList.length} medicines</p>
                </div>
            `;
 
            if (notes) {
                html += `
                    <div class="mb-3">
                        <strong>Notes:</strong>
                        <p class="text-muted">${notes}</p>
                    </div>
                `;
            }
 
            let total = 0;
            medicineList.forEach(med => {
                total += med.quantity * med.price;
            });
 
            html += `
                <div class="border-top pt-3">
                    <strong>Total Amount:</strong>
                    <p class="text-success fw-bold">₹${total.toLocaleString()}</p>
                </div>
            `;
 
            $('#orderSummary').html(html);
        }
 
        function startTimer() {
            const timerInterval = setInterval(function() {
                timeRemaining--;
 
                // Update timer display
                $('#timerCount').text(timeRemaining);
 
                // Update progress bar
                const progress = (timeRemaining / 30) * 100;
                $('#progressBar').css('width', progress + '%');
 
                // Change color based on time
                if (timeRemaining <= 10) {
                    $('#progressBar').removeClass('bg-success').addClass('bg-danger');
                } else if (timeRemaining <= 15) {
                    $('#progressBar').removeClass('bg-success').addClass('bg-warning');
                }
 
                // Time's up
            //     if (timeRemaining <= 0) {
            //         clearInterval(timerInterval);
            //         completeTimer();
            //     }
             }, 1000);
        }
        if (!localStorage.getItem("prescriptions")) {
      localStorage.setItem("prescriptions", JSON.stringify([]));
  }
 
  //----------------------------------------------------
  // LOAD USER PRESCRIPTIONS
  //----------------------------------------------------
  function loadUserPrescriptions() {
      let prescriptions = JSON.parse(localStorage.getItem("prescriptions")) || [];
      
    
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
        function completeTimer() {
            $('#timerCount').text('✓');
            $('#progressBar').css('width', '100%').removeClass('bg-success bg-warning bg-danger').addClass('bg-success');
            
            $('#messageContainer').html(`
                <div class="alert alert-success">
                    <i class="bi bi-check-circle"></i> Prescription verified successfully!
                </div>
                <p class="mt-3 text-muted">Your order has been confirmed. Redirecting...</p>
            `);
 
            $('#cancelBtn').prop('disabled', true);
 
            // Redirect after 3 seconds
            setTimeout(function() {
                window.location.href = '../Medicine/my_order.html';
            }, 3000);
        }
        $("#cancelBtn").click(function() {
      window.location.href = "carted_med.html";
  });