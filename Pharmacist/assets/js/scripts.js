// Helpers
function logActivity(text) {
    activity.unshift({text, time: new Date().toLocaleString()});
    if (activity.length > 20) activity.pop();
    renderActivity();
}

function renderActivity() {
    const ul = $("#activityLog").empty();
    activity.forEach(a => ul.append(`<li>${a.time} — ${a.text}</li>`));
}

// Render functions
function renderMedicinesTable(){
    const tbody = $("#medicinesTable tbody").empty();
    medicines.forEach(m => {
    const lowBadge = m.stock <= 10 ? `<span class="badge badge-low text-white">Low</span>` : "";
    tbody.append(`
        <tr>
        <td>${m.id}</td>
        <td>${m.name}</td>
        <td>${m.category}</td>
        <td>${m.price.toFixed(2)}</td>
        <td>${m.stock} ${lowBadge}</td>
        <td>${m.expiry}</td>
        <td class="table-actions">
            <button class="btn btn-sm btn-outline-primary edit-med" data-id="${m.id}">Edit</button>
            <button class="btn btn-sm btn-outline-danger del-med" data-id="${m.id}">Delete</button>
        </td>
        </tr>
    `);
    });
    // refill bill select
    const select = $("#billMedSelect").empty();
    medicines.forEach(m => select.append(`<option value="${m.id}">${m.name} — ₹${m.price.toFixed(2)} (Stock ${m.stock})</option>`));
}

function validatePrescription(id) {
  // Find the index of the prescription
  const idx = prescriptions.findIndex(p => p.id == id);
  if (idx === -1) return;

  // (Optional) If you still want to mark it validated before removing:
  prescriptions[idx].status = "VALIDATED";
  logActivity?.(`Prescription #${id} validated by pharmacist`);
const hasValidated = prescriptions[idx].status;
  if (hasValidated) {
    setTimeout(function() {
      prescriptions.splice(idx, 1);
    }, 2000);
  }

  // Remove it from the array
  

  // Persist and rerender
  localStorage.setItem("prescriptions", JSON.stringify(prescriptions));
  renderPrescriptions();
  renderDashboardWidgets();
}
function renderPrescriptions(){
    const tbody = $("#presTable tbody").empty();
    prescriptions.forEach(p => {
    tbody.append(`
        <tr>
        <td>${p.id}</td>
        <td>${p.customer}</td>
        <td>${p.doctor}</td>
        <td>${p.issued}</td>
        <td>${p.status}</td>
        <td>
            ${p.status === "PENDING" ? `<button class="btn btn-sm btn-success validate-pres"onclick="validatePrescription(${p.id})" data-id="${p.id}">Validate</button>` : ""}
            <button class="btn btn-sm btn-outline-danger del-pres" data-id="${p.id}">Delete</button>
        </td>
        </tr>
    `);
    });
}

function renderBills(){
    const tbody = $("#billsTable tbody").empty();
    bills.forEach(b => {
    tbody.append(`
        <tr>
        <td>${b.id}</td>
        <td>${b.customer}</td>
        <td>₹${b.amount.toFixed(2)}</td>
        <td>${b.date}</td>
        <td>${b.status}</td>
        <td>
            ${b.status === "PENDING" ? `<button class="btn btn-sm btn-success pay-bill" data-id="${b.id}">Pay</button>` : ""}
            <button class="btn btn-sm btn-outline-secondary view-bill" data-id="${b.id}">View</button>
        </td>
        </tr>
    `);
    });
}

function renderTickets(){
    const tbody = $("#ticketsTable tbody").empty();
    tickets.forEach(t => {
    tbody.append(`
        <tr>
        <td>${t.id}</td>
        <td>${t.customer}</td>
        
        <td>${t.status}</td>
        <td>${t.created}</td>
        <td>
            ${t.status === "OPEN" ? `<button class="btn btn-sm btn-success resolve-ticket" data-id="${t.id}">Resolve</button>` : ""}
        </td>
        </tr>
    `);
    });
}

function renderDashboardWidgets(){
    // Low stock
    $("#lowStockList").empty();
    medicines.filter(m => m.stock <= 10).forEach(m => {
    $("#lowStockList").append(`<div>${m.name} <span class="float-end badge bg-danger">${m.stock}</span></div>`);
    });
    if ($("#lowStockList").is(':empty')) $("#lowStockList").append(`<div class="text-muted">No low-stock items</div>`);

    // Pending prescriptions
    $("#pendingPresList").empty();
    const pend = prescriptions.filter(p => p.status === "PENDING");
    if (pend.length) pend.forEach(p => $("#pendingPresList").append(`<div>${p.customer} (${p.doctor})</div>`));
    else $("#pendingPresList").append(`<div class="text-muted">None</div>`);

    // Today's bills (just sample)
    $("#todaysBills").empty();
    bills.slice(0,3).forEach(b => $("#todaysBills").append(`<div>Bill #${b.id} ₹${b.amount.toFixed(2)}</div>`));

    // Open tickets
    $("#openTickets").empty();
    const openTs = tickets.filter(t => t.status === "OPEN");
    if (openTs.length) openTs.forEach(t => $("#openTickets").append(`<div>${t.customer}</div>`));
    else $("#openTickets").append(`<div class="text-muted">No open tickets</div>`);
}

// Page nav
$(function(){
    // initial render
    renderMedicinesTable();
    renderPrescriptions();
    renderBills();
    renderTickets();
    renderDashboardWidgets();
    renderActivity();

    // sidebar navigation
    
    // open add medicine
    $("#openAddMedicine, #btnAddMedicine").click(function(){
    $("#medModalTitle").text("Add Medicine");
    $("#medicineForm")[0].reset();
    $("#medId").val("");
    const md = new bootstrap.Modal(document.getElementById('medicineModal'));
    md.show();
    });

    // save medicine (add/edit)
    $("#medicineForm").submit(function(e){
    e.preventDefault();
    const id = $("#medId").val();
    const obj = {
        id: id ? parseInt(id) : (medicines.length ? Math.max(...medicines.map(m=>m.id))+1 : 1),
        name: $("#medName").val(),
        category: $("#medCategory").val(),
        price: parseFloat($("#medPrice").val()),
        stock: parseInt($("#medStock").val()),
        expiry: $("#medExpiry").val()
    };
    if (id) {
        medicines = medicines.map(m => m.id == obj.id ? obj : m);
        logActivity(`Medicine updated: ${obj.name}`);
    } else {
        medicines.push(obj);
        logActivity(`Medicine added: ${obj.name}`);
    }
    renderMedicinesTable();
    renderDashboardWidgets();
    bootstrap.Modal.getInstance(document.getElementById('medicineModal')).hide();
    });

    // edit / delete medicine
    $(document).on("click", ".edit-med", function(){
    const id = $(this).data("id");
    const m = medicines.find(x=>x.id==id);
    $("#medId").val(m.id);
    $("#medName").val(m.name);
    $("#medCategory").val(m.category);
    $("#medPrice").val(m.price);
    $("#medStock").val(m.stock);
    $("#medExpiry").val(m.expiry);
    $("#medModalTitle").text("Edit Medicine");
    new bootstrap.Modal(document.getElementById('medicineModal')).show();
    });

    $(document).on("click", ".del-med", function(){
    const id = $(this).data("id");
    if (!confirm("Delete medicine?")) return;
    const m = medicines.find(x=>x.id==id);
    medicines = medicines.filter(x=>x.id!=id);
    renderMedicinesTable();
    renderDashboardWidgets();
    logActivity(`Medicine deleted: ${m.name}`);
    });

    // upload prescription
    $("#openUploadPres, #btnUploadPrescription").click(function(){
    $("#uploadPresForm")[0].reset();
    new bootstrap.Modal(document.getElementById('uploadPresModal')).show();
    });

    $("#uploadPresForm").submit(function(e){
    e.preventDefault();
    const id = prescriptions.length ? Math.max(...prescriptions.map(p=>p.id))+1 : 1;
    const p = {
        id,
        customer: $("#presCustomer").val(),
        doctor: $("#presDoctor").val(),
        issued: $("#presIssued").val(),
        status: "PENDING"
    };
    prescriptions.push(p);
    renderPrescriptions();
    renderDashboardWidgets();
    logActivity(`Prescription uploaded for ${p.customer}`);
    bootstrap.Modal.getInstance(document.getElementById('uploadPresModal')).hide();
    });

    // validate pres
    
$(document).on("click", ".validate-pres", function () {
  const id = $(this).data("id");
  const idx = prescriptions.findIndex(x => x.id == id);
  if (idx === -1) return;

  if (!confirm(`Mark prescription #${id} as VALIDATED and remove it?`)) return;

  // (Optional) mark before removing
  prescriptions[idx].status = "VALIDATED";
  logActivity?.(`Prescription #${id} validated by pharmacist`);

  // Remove from array
 const hasValidated = prescriptions[idx].status;
  if (hasValidated) {
    setTimeout(function() {
      prescriptions.splice(idx, 1);
    }, 2000);
  }

  // Persist and rerender
  localStorage.setItem("prescriptions", JSON.stringify(prescriptions));
  renderPrescriptions();
  renderDashboardWidgets();
});

    $(document).on("click", ".del-pres", function(){
    const id = $(this).data("id");
    prescriptions = prescriptions.filter(x=>x.id!=id);
    renderPrescriptions();
    renderDashboardWidgets();
    logActivity(`Prescription #${id} deleted`);
    });

    // billing - open new bill
    $("#newBillBtn").click(function(){
    $("#billForm")[0].reset();
    $("#billCart tbody").empty();
    $("#grandTotal").text("0.00");
    $("#billDate").val(new Date().toISOString().slice(0,10));
    new bootstrap.Modal(document.getElementById('billModal')).show();
    });

    let billCart = [];

    $("#addToCartBtn").click(function(){
    const medId = parseInt($("#billMedSelect").val());
    const qty = parseInt($("#billQty").val()) || 1;
    const med = medicines.find(m=>m.id==medId);
    if (!med) return alert("Select medicine");
    if (qty > med.stock) {
        if(!confirm("Quantity exceeds stock. Continue?")) return;
    }
    const item = {medId, name:med.name, price:med.price, qty};
    billCart.push(item);
    renderCart();
    });

    function renderCart(){
    const tbody = $("#billCart tbody").empty();
    let total = 0;
    billCart.forEach((it, idx) => {
        const subtotal = it.price * it.qty;
        total += subtotal;
        tbody.append(`<tr>
        <td>${it.name}</td><td>₹${it.price.toFixed(2)}</td><td>${it.qty}</td><td>₹${subtotal.toFixed(2)}</td>
        <td><button class="btn btn-sm btn-outline-danger remove-cart" data-index="${idx}">Remove</button></td>
        </tr>`);
    });
    $("#grandTotal").text(`₹${total.toFixed(2)}`);
    }

    $(document).on("click", ".remove-cart", function(){
    const idx = $(this).data("index");
    billCart.splice(idx,1);
    renderCart();
    });

    $("#billForm").submit(function(e){
    e.preventDefault();
    if (!billCart.length) return alert("Add medicines to bill first");
    const id = bills.length ? Math.max(...bills.map(b=>b.id))+1 : 1;
    const total = billCart.reduce((s,i) => s + i.price*i.qty, 0);
    const bill = {id, customer: $("#billCustomer").val(), amount: total, date: $("#billDate").val(), status: "PENDING"};
    bills.unshift(bill);
    // reduce stock locally for demo
    billCart.forEach(it => {
        const med = medicines.find(m=>m.id==it.medId);
        if (med) med.stock = Math.max(0, med.stock - it.qty);
    });
    billCart = [];
    renderBills();
    renderMedicinesTable();
    renderDashboardWidgets();
    logActivity(`Bill #${id} generated for ${bill.customer} - ₹${bill.amount.toFixed(2)}`);
    bootstrap.Modal.getInstance(document.getElementById('billModal')).hide();
    });

    // pay bill
    $(document).on("click", ".pay-bill", function(){
    const id = $(this).data("id");
    const bill = bills.find(b=>b.id==id);
    if (!bill) return;
    $("#payBillId").val(bill.id);
    $("#payAmountText").text(`₹${bill.amount.toFixed(2)}`);
    $("#payMethod").val("Cash");
    new bootstrap.Modal(document.getElementById('paymentModal')).show();
    });

    $("#paymentForm").submit(function(e){
    e.preventDefault();
    const id = parseInt($("#payBillId").val());
    const bill = bills.find(b=>b.id==id);
    if (!bill) return;
    bill.status = "PAID";
    renderBills();
    renderDashboardWidgets();
    logActivity(`Bill #${id} paid via ${$("#payMethod").val()}`);
    bootstrap.Modal.getInstance(document.getElementById('paymentModal')).hide();
    });

// tickets
    $("#createTicketBtn").click(function(){ $("#ticketForm")[0].reset(); new bootstrap.Modal(document.getElementById('ticketModal')).show(); });

    $("#ticketForm").submit(function(e){
    e.preventDefault();
    const id = tickets.length ? Math.max(...tickets.map(t=>t.id))+1 : 1;
    const ticket = {id, customer: $("#ticketCustomer").val(),  status:"OPEN", created: new Date().toISOString().slice(0,10)};
    tickets.unshift(ticket);
    renderTickets();
    renderDashboardWidgets();
    logActivity(`Ticket #${id} created by ${ticket.customer}`);
    bootstrap.Modal.getInstance(document.getElementById('ticketModal')).hide();
    });

    $(document).on("click", ".resolve-ticket", function(){
    const id = $(this).data("id");
    const t = tickets.find(x=>x.id==id);
    if (!t) return;
    t.status = "RESOLVED";
    renderTickets();
    renderDashboardWidgets();
    logActivity(`Ticket #${id} resolved`);
    });
    
    // simple profile load/save
    $("#profileUsername").val("pharmacist_user");
    $("#profileEmail").val("pharmacist@example.com");
    $("#profileForm").submit(function(e){
    e.preventDefault();
    logActivity("Profile updated");
    alert("Profile saved (demo)");
    });

    // refresh dashboard
    $("#refreshDashboard").click(function(){ renderDashboardWidgets(); alert("Dashboard refreshed (demo)"); });

    // initial UI state
    $(".nav-link[data-page='dashboard']").click();

}); // end doc ready
