const STORAGE_KEY = 'skripsi_students';

// --- Data Layer (Cloudflare D1 integration) ---

async function getStudents() {
    try {
        const res = await fetch('/api/students');
        if (!res.ok) throw new Error("Failed to fetch students");
        return await res.json();
    } catch (err) {
        console.error(err);
        return [];
    }
}

async function addStudent(name, proposalDate, pin) {
    try {
        const res = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, proposalDate, pin })
        });
        if (!res.ok) throw new Error("Failed to add student");
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

async function deleteStudent(id, pin) {
    try {
        const res = await fetch(`/api/students/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin })
        });
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || "Failed to delete student");
        }
        return true;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// --- Toggle Milestone ---
async function toggleMilestone(id, milestone, isCompleted, pin) {
    try {
        const res = await fetch(`/api/students/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin, milestone, isCompleted })
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || "Failed to toggle milestone");
        }
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// --- Business Logic ---

/**
 * Calculates milestones based on the 120 timeline rules.
 * @param {string} proposalDateStr 'YYYY-MM-DD'
 */
function calculateMilestones(proposalDateStr) {
    const propDate = new Date(proposalDateStr);

    // Helper to add days
    const addDays = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    return {
        proposal: propDate,
        bab3: addDays(propDate, 40),
        bab4: addDays(propDate, 100),
        bab5: addDays(propDate, 120),
    };
}

/**
 * Compare dates and return a difference in days.
 */
function diffDays(date1, date2) {
    // Math.ceil to round up any partial days
    const diffTime = Math.abs(date2 - date1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Generates status object for rendering timeline
 */
function evaluateStudentStatus(student) {
    const milestones = calculateMilestones(student.proposalDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to midnight

    // Identify current phase and calculate exact status
    const timeline = [
        { key: 'bab3', label: 'BAB III', date: milestones.bab3 },
        { key: 'bab4', label: 'BAB IV', date: milestones.bab4 },
        { key: 'bab5', label: 'BAB V & Finalisasi', date: milestones.bab5 }
    ];

    let currentPhaseIndex = -1;
    let mostOverdueDays = 0;
    let closestDeadlineDays = Infinity;

    const evaluatedTimeline = timeline.map((m, index) => {
        const mDate = m.date;
        mDate.setHours(0, 0, 0, 0);

        let state;
        let daysDiff = diffDays(today, mDate);
        let statusText = '';
        let isCompleted = !!student[`${m.key}CompletedAt`];

        if (isCompleted) {
            state = 'completed';
            const completedDate = new Date(student[`${m.key}CompletedAt`]);
            statusText = `Selesai pada ${formatDate(completedDate)}`;
        } else if (today > mDate) {
            state = 'overdue';
            statusText = `Terlambat ${daysDiff} hari`;
            if (daysDiff > mostOverdueDays) mostOverdueDays = daysDiff;
        } else if (today < mDate) {
            state = 'upcoming';
            statusText = `${daysDiff} hari lagi`;
            if (daysDiff < closestDeadlineDays) closestDeadlineDays = daysDiff;
        } else {
            state = 'current';
            statusText = `Batas waktu hari ini!`;
            closestDeadlineDays = 0;
        }

        return { ...m, state, statusText, daysDiff, isCompleted };
    });

    // Determine the active "current" milestone (the first one not completed, or overdue)
    let nextMilestone = evaluatedTimeline.find(m => m.state === 'upcoming' || m.state === 'current');
    if (!nextMilestone) {
        // If all are past, look for the most advanced overdue
        nextMilestone = evaluatedTimeline[evaluatedTimeline.length - 1]; // BAB V
    } else {
        // Find the first non-completed one
        const activeIndex = evaluatedTimeline.findIndex(m => m.state === 'upcoming' || m.state === 'current');
        if (activeIndex > 0 && evaluatedTimeline[activeIndex - 1].state === 'overdue') {
            // Wait, if an earlier one is overdue, they are stuck on that earlier one actually!
            nextMilestone = evaluatedTimeline.find(m => m.state === 'overdue') || nextMilestone;
        }
    }

    // Force exact "current" class on the active milestone dot
    evaluatedTimeline.forEach(m => {
        if (m.key === nextMilestone?.key && m.state !== 'overdue') {
            m.state = 'current';
        }
    });

    return {
        ...student,
        milestones: evaluatedTimeline,
        nextMilestone,
        mostOverdueDays,
        closestDeadlineDays: closestDeadlineDays === Infinity ? 0 : closestDeadlineDays
    };
}


// --- UI Layer ---

function formatDate(dateObj) {
    return dateObj.toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' });
}

async function renderStudents() {
    const listEl = document.getElementById('student-list');
    const sortSelect = document.getElementById('sort-select');

    listEl.innerHTML = `
        <div class="empty-state">
            <p>Memuat mahasiswa...</p>
        </div>
    `;

    const studentsRaw = await getStudents();

    if (studentsRaw.length === 0) {
        listEl.innerHTML = `
            <div class="empty-state">
                <p>Belum ada pelacakan mahasiswa saat ini.</p>
                <p>Tambahkan mahasiswa di atas untuk memulai!</p>
            </div>
        `;
        return;
    }

    // Evaluate
    let students = studentsRaw.map(evaluateStudentStatus);

    // Sort
    const sortVal = sortSelect.value;
    students.sort((a, b) => {
        if (sortVal === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortVal === 'closest') {
            // Sort by closest deadline (smallest days remaining)
            return a.closestDeadlineDays - b.closestDeadlineDays;
        } else if (sortVal === 'overdue') {
            // Sort by most overdue days descending
            return b.mostOverdueDays - a.mostOverdueDays;
        }
        return 0;
    });

    listEl.innerHTML = '';

    students.forEach(student => {
        const card = document.createElement('div');
        card.className = 'student-card';

        // Build Timeline HTML
        const timelineHTML = student.milestones.map(m => {
            let statusClass = m.state === 'overdue' ? 'status-overdue'
                : (m.state === 'current' ? 'status-upcoming' : (m.state === 'completed' ? 'status-completed' : 'status-upcoming'));

            let dotClass = m.state;
            let checkedAttr = m.isCompleted ? 'checked' : '';

            return `
                <div class="milestone ${dotClass}">
                    <div class="ms-dot"></div>
                    <div class="ms-label">
                        <label class="ms-checkbox-label" title="Tandai Selesai / Batal">
                            <input type="checkbox" ${checkedAttr} onclick="handleToggleMilestone('${student.id}', '${m.key}', ${m.isCompleted})">
                            ${m.label}
                        </label>
                    </div>
                    <div class="ms-date">${formatDate(m.date)}</div>
                    <div class="ms-status ${statusClass}">${m.statusText}</div>
                </div>
            `;
        }).join('');

        card.innerHTML = `
            <div class="sc-header">
                <h3 class="sc-name">${student.name}</h3>
                <div class="sc-prop-date">Proposal: ${formatDate(new Date(student.proposalDate))}</div>
                <button class="btn btn-small btn-danger" onclick="handleDelete('${student.id}')">Hapus</button>
            </div>
            <div class="timeline">
                ${timelineHTML}
            </div>
        `;
        listEl.appendChild(card);
    });
}

// Global action handler for inline HTML onclick
window.handleDelete = async (id) => {
    const pin = prompt("Masukkan PIN mahasiswa untuk menghapus:");
    if (!pin) return;

    if (confirm("Apakah Anda yakin ingin menghapus pelacakan ini?")) {
        try {
            await deleteStudent(id, pin);
            await renderStudents();
        } catch (e) {
            alert(e.message);
        }
    }
}

window.handleToggleMilestone = async (id, milestone, currentState) => {
    const isCompleted = !currentState;
    const action = isCompleted ? "menyelesaikan" : "membatalkan penyelesaian";
    const pin = prompt(`Masukkan PIN mahasiswa untuk ${action} milestone ini:`);
    if (!pin) {
        // revert checkbox visually instantly if cancelled
        await renderStudents();
        return;
    }

    try {
        await toggleMilestone(id, milestone, isCompleted, pin);
        await renderStudents();
    } catch (e) {
        alert(e.message);
        await renderStudents();
    }
}

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('student-form');
    const nameInput = document.getElementById('student-name');
    const dateInput = document.getElementById('proposal-date');
    const pinInput = document.getElementById('student-pin');
    const sortSelect = document.getElementById('sort-select');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = nameInput.value.trim();
        const date = dateInput.value;
        const pin = pinInput.value;

        if (name && date && pin) {
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'Menambahkan...';
            btn.disabled = true;

            await addStudent(name, date, pin);

            nameInput.value = '';
            dateInput.value = '';
            pinInput.value = '';

            btn.innerText = originalText;
            btn.disabled = false;

            await renderStudents();
        }
    });

    sortSelect.addEventListener('change', renderStudents);

    // Initial Render
    renderStudents();
});
