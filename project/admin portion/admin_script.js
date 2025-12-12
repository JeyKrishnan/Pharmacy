
        let pharmacists = JSON.parse(localStorage.getItem('pharmacists')) || [];
        //let payments = JSON.parse(localStorage.getItem('paymentData')) || [];
        let editingPharmacistId = null;
        let editingUserId = null;
        let chart = null;

        // Navigation
        $(document).on('click', '.nav-link', function() {
            const section = $(this).data('section');
            $('.nav-link').removeClass('active');
            $(this).addClass('active');
            $('.section').removeClass('active');
            $('#' + section).addClass('active');
            
            if (section === 'analytics') {
                setTimeout(initChart, 100);
            }
        });

        // Load and display data on page load
        $(document).ready(function() {
            loadPharmacists();
            // loadUsers();
            syncPaymentData();
            updateDashboard();
        });

        function syncPaymentData() {
            payments = JSON.parse(localStorage.getItem('payments')) || [];
            loadPayments();
            updateDashboard();
        }

        // Load Pharmacists
        
            function loadPharmacists() {
                const tbody = $('#pharmacistTableBody');
                tbody.empty();

                pharmacists.forEach(p => {
                    // Safe email display—fallback to '—' if missing
                    const emailDisplay = p.email ? p.email : '—';

                    const row = `
                        <tr>
                            <td>${p.name}</td>
                            <td>${p.specialization}</td>
                            <td>${p.phone}</td>
                            <td>${emailDisplay}</td> <!-- NEW -->
                            <td>
                                <span class="status-badge status-${p.status === 'Active' ? 'active' : 'inactive'}">
                                    ${p.status}
                                </span>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-warning" onclick="editPharmaciist('${p.id}')">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="deletePharmaciist('${p.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                    tbody.append(row);
                });
            }


        // Load Users
        // function loadUsers() {
        //     const tbody = $('#userTableBody');
        //     tbody.empty();
            
        //     users.forEach(u => {
        //         const row = `
        //             <tr>
        //                 <td>${u.name}</td>
        //                 <td>${u.email}</td>
        //                 <td>${u.phone}</td>
        //                 <td>${u.city}</td>
        //                 <td>${u.paymentMethod}</td>
        //                 <td>
        //                     <button class="btn btn-sm btn-warning" onclick="editUser('${u.id}')"><i class="fas fa-edit"></i></button>
        //                     <button class="btn btn-sm btn-danger" onclick="deleteUser('${u.id}')"><i class="fas fa-trash"></i></button>
        //                 </td>
        //             </tr>
        //         `;
        //         tbody.append(row);
        //     });
        // }

        // Load Payments
        function loadPayments() {

            const payments = [
                    {
                        orderId: "ORD-1001",
                        customerName: "Amit Kumar",
                        email: "amit@example.com",
                        phone: "9876543210",
                        productType: "Tablet",
                        amount: 250,
                        paymentMethod: "UPI",
                        date: "2025-01-10"
                    },
                    {
                        orderId: "ORD-1002",
                        customerName: "Sneha Roy",
                        email: "sneha@example.com",
                        phone: "9123456780",
                        productType: "Syrup",
                        amount: 180,
                        paymentMethod: "Cash",
                        date: "2025-02-14"
                    },
                    {
                        orderId: "ORD-1003",
                        customerName: "Rohan Sharma",
                        email: "rohan@example.com",
                        phone: "9988776655",
                        productType: "Capsule",
                        amount: 320,
                        paymentMethod: "Card",
                        date: "2025-03-02"
                    },
                    {
                        orderId: "ORD-1004",
                        customerName: "Priya Singh",
                        email: "priya@example.com",
                        phone: "9001122334",
                        productType: "Injection",
                        amount: 500,
                        paymentMethod: "UPI",
                        date: "2025-03-20"
                    }
                ];



            const tbody = $('#paymentTableBody');
            tbody.empty();
            
            if (payments.length === 0) {
                tbody.append('<tr><td colspan="8" class="text-center text-muted">No payments yet. Payments from user website will appear here.</td></tr>');
                return;
            }
            
            payments.forEach(p => {

                console.log("payment data:",p);
                const row = `
                    <tr>
                        <td>#${p.orderId}</td>
                        <td>${p.customerName}</td>
                        <td>${p.email}</td>
                        <td>${p.phone}</td>
                        <td>${p.productType}</td>
                        <td><span class="rupee-symbol">₹</span>${p.amount}</td>
                        <td>${p.paymentMethod}</td>
                        <td>${new Date(p.date).toLocaleDateString()}</td>
                        <td><span class="status-badge status-active">Completed</span></td>
                    </tr>
                `;
                tbody.append(row);
            });
        }

        // Save Pharmacist
        

function savePharmaciist() {
    const name = $('#pharmacistName').val().trim();
    const specialization = $('#pharmacistSpecialization').val().trim();
    const phone = $('#pharmacistPhone').val().trim();
    const status = $('#pharmacistStatus').val();
    const email = $('#pharmacistEmail').val().trim();
    const password = $('#pharmacistPassword').val(); // leave as-is (not trimmed), optional

    // Basic validation (name, phone, email required; license removed)
    if (!name || !phone || !email) {
        alert('Please fill all required fields: Name, Phone, and Email.');
        return;
    }

    // Optional: Email format check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Optional: simple phone format check (customize for your locale)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 7) {
        alert('Please enter a valid phone number.');
        return;
    }

    if (editingPharmacistId) {
        // Update existing pharmacist
        const pharmacist = pharmacists.find(p => p.id === editingPharmacistId);
        if (pharmacist) {
            pharmacist.name = name;
            pharmacist.specialization = specialization;
            pharmacist.phone = phone;
            pharmacist.status = status;
            pharmacist.email = email;

            // Only update password if user entered a new one
            if (password) {
                pharmacist.password = password; 
                // NOTE: In a real app, hash the password on the server.
            }
        }
    } else {
        // Create new pharmacist
        const newPharmacist = {
            id: Date.now().toString(),
            name,
            specialization,
            phone,
            status,
            email
        };

        // Include password only if provided
        if (password) {
            newPharmacist.password = password; 
            // NOTE: In a real app, hash the password on the server.
        }

        pharmacists.push(newPharmacist);
    }

    // Persist and refresh UI
    localStorage.setItem('pharmacists', JSON.stringify(pharmacists));
    loadPharmacists();
    updateDashboard();

    // Reset and close modal
    $('#pharmacistForm')[0].reset();
    editingPharmacistId = null;
    bootstrap.Modal.getInstance(document.getElementById('pharmacistModal')).hide();
}

 // Edit Pharmacist
        
        function editPharmaciist(id) {
            const pharmacist = pharmacists.find(p => p.id === id);
            if (pharmacist) {
                // Populate basic fields
                $('#pharmacistName').val(pharmacist.name);
                $('#pharmacistSpecialization').val(pharmacist.specialization);
                $('#pharmacistPhone').val(pharmacist.phone);
                $('#pharmacistStatus').val(pharmacist.status);

                // NEW: Populate email
                $('#pharmacistEmail').val(pharmacist.email || '');

                // NEW: Handle password — DO NOT prefill existing password
                // Leave it blank so the user can optionally set a new one
                $('#pharmacistPassword').val('');

                // Track the editing ID
                editingPharmacistId = id;

                // Show modal
                new bootstrap.Modal(document.getElementById('pharmacistModal')).show();
            }
        }


        // Delete Pharmacist
        function deletePharmaciist(id) {
            if (confirm('Are you sure?')) {
                pharmacists = pharmacists.filter(p => p.id !== id);
                localStorage.setItem('pharmacists', JSON.stringify(pharmacists));
                loadPharmacists();
                updateDashboard();
            }
        }

        // Save User
        // function saveUser() {
        //     const name = $('#userName').val();
        //     const email = $('#userEmail').val();
        //     const password = $('#userPassword').val();
        //     const phone = $('#userPhone').val();
        //     const city = $('#userCity').val();
        //     const paymentMethod = $('#userPaymentMethod').val();
        //     const address = $('#userAddress').val();

        //     if (!name || !email || !password || !phone || !city) {
        //         alert('Please fill all required fields');
        //         return;
        //     }

        //     if (editingUserId) {
        //         const user = users.find(u => u.id === editingUserId);
        //         if (user) {
        //             user.name = name;
        //             user.email = email;
        //             user.password = password;
        //             user.phone = phone;
        //             user.city = city;
        //             user.paymentMethod = paymentMethod;
        //             user.address = address;
        //         }
        //     } else {
        //         users.push({
        //             id: Date.now().toString(),
        //             name, email, password, phone, city, paymentMethod, address
        //         });
        //     }

        //     localStorage.setItem('users', JSON.stringify(users));
        //     loadUsers();
        //     updateDashboard();
        //     $('#userForm')[0].reset();
        //     editingUserId = null;
        //     bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
        // }

        // // Edit User
        // function editUser(id) {
        //     const user = users.find(u => u.id === id);
        //     if (user) {
        //         $('#userName').val(user.name);
        //         $('#userEmail').val(user.email);
        //         $('#userPassword').val(user.password);
        //         $('#userPhone').val(user.phone);
        //         $('#userCity').val(user.city);
        //         $('#userPaymentMethod').val(user.paymentMethod);
        //         $('#userAddress').val(user.address);
        //         editingUserId = id;
        //         new bootstrap.Modal(document.getElementById('userModal')).show();
        //     }
        // }

        // Delete User
        // function deleteUser(id) {
        //     if (confirm('Are you sure?')) {
        //         users = users.filter(u => u.id !== id);
        //         localStorage.setItem('users', JSON.stringify(users));
        //         loadUsers();
        //         updateDashboard();
        //     }
        // }

        // Update Dashboard Stats
        function updateDashboard() {
            //$('#totalUsers').text(users.length);
            //$('#totalPayments').text(payments.length);
            $('#totalPharmacists').text(pharmacists.filter(p => p.status === 'Active').length);
            
            const totalRevenue =8000;
            $('#totalRevenue').text(totalRevenue.toFixed(2));
            $('#analyticsRevenue').text(totalRevenue.toFixed(2));
            
            const avgTransaction = 1*(totalRevenue / 4).toFixed(2);
            $('#avgTransaction').text(avgTransaction);
        }

        // Initialize Chart
        function initChart() {
            if (chart) chart.destroy();
            
            const ctx = document.getElementById('salesChart');
            if (!ctx) return;
            
            const productCounts = {
                'Tablets': Math.floor(Math.random() * 100) + 20,
                'Syrups': Math.floor(Math.random() * 80) + 10,
                'Injections': Math.floor(Math.random() * 60) + 5
            };

            chart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(productCounts),
                    datasets: [{
                        data: Object.values(productCounts),
                        backgroundColor: ['#3498db', '#e74c3c', '#f39c12'],
                        borderColor: '#fff',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }