/*
 * This script provides simple client-side storage for the Daily Vehicle Check portal.
 * Inspections are stored in the browser's localStorage under the key 'inspections'.
 * When the form is submitted, the data is captured and appended to the stored array.
 * The manager dashboard retrieves the stored inspections and renders them into a table.
 */

// Save an inspection from the form into localStorage
function saveInspection(event) {
    event.preventDefault();
    var messageEl = document.getElementById('message');
    // Get form values
    var date = document.getElementById('date').value;
    var driver = document.getElementById('driver').value;
    var vehicle = document.getElementById('vehicle').value;
    var odometer = document.getElementById('odometer').value;
    var notes = document.getElementById('notes').value;
    // Collect checked items
    var items = Array.from(document.querySelectorAll('input[name="items"]:checked')).map(function(el) {
        return el.parentElement.textContent.trim();
    });
    // Collect photo name (store only name, not data)
    var photoInput = document.getElementById('photo');
    var photoName = '';
    if (photoInput && photoInput.files && photoInput.files[0]) {
        photoName = photoInput.files[0].name;
    }
    // Construct inspection object
    var inspection = {
        id: new Date().toISOString(),
        date: date,
        driver: driver,
        vehicle: vehicle,
        odometer: odometer,
        items: items,
        notes: notes,
        photo: photoName
    };
    // Retrieve existing inspections or start new array
    var existing = [];
    try {
        existing = JSON.parse(localStorage.getItem('inspections') || '[]');
        if (!Array.isArray(existing)) existing = [];
    } catch (e) {
        existing = [];
    }
    // Append and save
    existing.push(inspection);
    localStorage.setItem('inspections', JSON.stringify(existing));
    // Clear form
    if (event.target && event.target.reset) {
        event.target.reset();
    }
    // Show confirmation message
    if (messageEl) {
        messageEl.textContent = 'Inspection submitted successfully.';
        messageEl.style.color = 'green';
    }
    // Optionally send the inspection by email
    sendInspectionByEmail(inspection);
}

// Send the inspection details via a mailto link to a predefined recipient
function sendInspectionByEmail(ins) {
    var recipientEmail = '24156112@ardenuniversity.ac.uk';
    // Compose subject and body
    var subject = 'New HGV Inspection Submitted';
    var body = 'Date/Time: ' + ins.date + '\n';
    body += 'Driver: ' + ins.driver + '\n';
    body += 'Vehicle: ' + ins.vehicle + '\n';
    body += 'Odometer: ' + ins.odometer + '\n';
    body += 'Items Checked: ' + ins.items.join(', ') + '\n';
    body += 'Defects/Notes: ' + (ins.notes || 'None') + '\n';
    body += 'Photo: ' + (ins.photo || 'No photo attached') + '\n';
    var mailtoLink = 'mailto:' + encodeURIComponent(recipientEmail) + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    // Open the user's default mail client with the pre‑filled email
    window.location.href = mailtoLink;
}

// Load inspections from localStorage and render to table
function loadInspections() {
    var tableBody = document.getElementById('inspectionTable');
    var noDataMessage = document.getElementById('noDataMessage');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    var inspections = [];
    try {
        inspections = JSON.parse(localStorage.getItem('inspections') || '[]');
        if (!Array.isArray(inspections)) inspections = [];
    } catch (e) {
        inspections = [];
    }
    if (inspections.length === 0) {
        if (noDataMessage) {
            noDataMessage.textContent = 'No inspection records found. Please submit a check using the form.';
        }
        return;
    }
    if (noDataMessage) {
        noDataMessage.textContent = '';
    }
    inspections.forEach(function(ins) {
        var tr = document.createElement('tr');
        // Date & Time
        var tdDate = document.createElement('td');
        tdDate.textContent = ins.date;
        tr.appendChild(tdDate);
        // Driver
        var tdDriver = document.createElement('td');
        tdDriver.textContent = ins.driver;
        tr.appendChild(tdDriver);
        // Vehicle
        var tdVehicle = document.createElement('td');
        tdVehicle.textContent = ins.vehicle;
        tr.appendChild(tdVehicle);
        // Items
        var tdItems = document.createElement('td');
        tdItems.textContent = ins.items.join(', ');
        tr.appendChild(tdItems);
        // Notes
        var tdNotes = document.createElement('td');
        tdNotes.textContent = ins.notes;
        tr.appendChild(tdNotes);
        tableBody.appendChild(tr);
    });
}

// Attach event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('inspectionForm');
    if (form) {
        form.addEventListener('submit', saveInspection);
    }
    // Always attempt to load inspections; will do nothing if table not present
    loadInspections();

    // Attach handler to email history button if present
    var historyBtn = document.getElementById('emailHistoryBtn');
    if (historyBtn) {
        historyBtn.addEventListener('click', sendHistoryByEmail);
    }
});

// Send the entire inspection history via a mailto link
function sendHistoryByEmail() {
    var recipientEmail = '24156112@ardenuniversity.ac.uk';
    var inspections = [];
    try {
        inspections = JSON.parse(localStorage.getItem('inspections') || '[]');
        if (!Array.isArray(inspections)) inspections = [];
    } catch (e) {
        inspections = [];
    }
    if (!inspections || inspections.length === 0) {
        alert('No inspection history to email.');
        return;
    }
    var subject = 'HGV Inspection History (' + inspections.length + ' records)';
    var body = 'Below is the list of all submitted inspections:\n\n';
    inspections.forEach(function(ins, index) {
        body += 'Record #' + (index + 1) + '\n';
        body += 'Date/Time: ' + ins.date + '\n';
        body += 'Driver: ' + ins.driver + '\n';
        body += 'Vehicle: ' + ins.vehicle + '\n';
        body += 'Odometer: ' + ins.odometer + '\n';
        body += 'Items Checked: ' + ins.items.join(', ') + '\n';
        body += 'Defects/Notes: ' + (ins.notes || 'None') + '\n';
        body += 'Photo: ' + (ins.photo || 'No photo attached') + '\n';
        body += '\n';
    });
    var mailtoLink = 'mailto:' + encodeURIComponent(recipientEmail) + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    window.location.href = mailtoLink;
}