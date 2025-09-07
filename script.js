document.addEventListener('DOMContentLoaded', function() {
    // --- Functia de salvare a inspectiei in memoria telefonului/browserului ---
    const form = document.getElementById('inspectionForm');
    if (form) {
        // Am eliminat event listener-ul de 'submit' de pe form pentru a-l pune pe butonul final
    }

    // --- Functia de incarcare a inspectiilor in dashboard ---
    loadInspections();

    // --- Functia pentru colorarea butoanelor "Pass" si "Fail" ---
    document.querySelectorAll('.pass-button, .fail-button').forEach(button => {
        button.addEventListener('click', function() {
            // Sterge selectia de la butonul pereche
            const parent = this.parentElement;
            parent.querySelectorAll('button').forEach(btn => btn.classList.remove('selected-pass', 'selected-fail'));

            // Adauga clasa de culoare
            if (this.classList.contains('pass-button')) {
                this.classList.add('selected-pass');
            } else {
                this.classList.add('selected-fail');
            }
        });
    });

    // --- Functia pentru generare PDF si trimitere email ---
    const generateButton = document.getElementById('generateAndEmailBtn');
    if (generateButton) {
        generateButton.addEventListener('click', function() {
            // Preia datele din formular
            const driver = document.getElementById('driver').value;
            const vehicle = document.getElementById('vehicle').value;
            const odometer = document.getElementById('odometer').value;
            const notes = document.getElementById('notes').value;
            
            // Colecteaza starea fiecarui item (Pass/Fail)
            let checklistStatus = '';
            document.querySelectorAll('.check-item').forEach(item => {
                const itemName = item.querySelector('span').textContent;
                const selectedPass = item.querySelector('.selected-pass');
                const selectedFail = item.querySelector('.selected-fail');
                let status = 'Not checked';
                if (selectedPass) status = 'Pass';
                if (selectedFail) status = 'Fail';
                checklistStatus += `- ${itemName}: ${status}\n`;
            });

            // Creeaza PDF-ul
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            doc.text("Daily Vehicle Check Report", 20, 20);
            doc.text(`Driver: ${driver}`, 20, 30);
            doc.text(`Vehicle: ${vehicle}`, 20, 40);
            doc.text(`Odometer: ${odometer}`, 20, 50);
            doc.text("Checklist Status:", 20, 60);
            doc.text(checklistStatus, 25, 70); // Adauga statusul intregului checklist

            const finalYPos = 70 + (document.querySelectorAll('.check-item').length * 10);
            doc.text(`Notes: ${notes}`, 20, finalYPos);
            
            // Salveaza PDF-ul local
            doc.save('Vehicle_Check_Report.pdf');

            // Pregateste si deschide clientul de email
            const recipientEmail = '24156112@ardenuniversity.ac.uk';
            const subject = 'Vehicle Check Report';
            let body = 'Please find the vehicle check report details below:\n\n';
            body += `Driver: ${driver}\n`;
            body += `Vehicle: ${vehicle}\n`;
            body += `Odometer: ${odometer}\n\n`;
            body += `Checklist Status:\n${checklistStatus}\n`;
            body += `Notes: ${notes}\n\n`;
            
            window.location.href = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            alert("PDF-ul a fost descărcat și aplicația de email s-a deschis pentru a trimite raportul.");
        });
    }
});

function loadInspections() {
    const tableBody = document.getElementById('inspectionTable');
    if (!tableBody) return;
    
    // Functia de incarcare ramane la fel
}
