const STORAGE_KEY = 'skripsi_students';

// --- Data Layer (Mocking future Cloudflare D1 integration) ---

function getStudents() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveStudents(students) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function addStudent(name, proposalDate) {
    const students = getStudents();
    const newStudent = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        name,
        proposalDate, /* YYYY-MM-DD */
        createdAt: new Date().toISOString()
    };
    students.push(newStudent);
    saveStudents(students);
    return newStudent;
}

function deleteStudent(id) {
    let students = getStudents();
    students = students.filter(s => s.id !== id);
    saveStudents(students);
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
    today.setHours(0,0,0,0); // normalize to midnight
    
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
        mDate.setHours(0,0,0,0);

        let state = 'completed'; // past
        let daysDiff = diffDays(today, mDate);
        let statusText = '';
        
        if (today > mDate) {
            state = 'overdue';
            statusText = `${daysDiff} days overdue`;
            if (daysDiff > mostOverdueDays) mostOverdueDays = daysDiff;
        } else if (today < mDate) {
            state = 'upcoming';
            statusText = `${daysDiff} days left`;
            if (daysDiff < closestDeadlineDays) closestDeadlineDays = daysDiff;
        } else {
            state = 'current';
            statusText = `Due today!`;
            closestDeadlineDays = 0;
        }

        return { ...m, state, statusText, daysDiff };
    });

    // Determine the active "current" milestone (the first one not completed, or overdue)
    let nextMilestone = evaluatedTimeline.find(m => m.state === 'upcoming' || m.state === 'current');
    if (!nextMilestone) {
        // If all are past, look for the most advanced overdue
        nextMilestone = evaluatedTimeline[evaluatedTimeline.length - 1]; // BAB V
    } else {
        // Find the first non-completed one
        const activeIndex = evaluatedTimeline.findIndex(m => m.state === 'upcoming' || m.state === 'current');
        if (activeIndex > 0 && evaluatedTimeline[activeIndex-1].state === 'overdue') {
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
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderStudents() {
    const listEl = document.getElementById('student-list');
    const sortSelect = document.getElementById('sort-select');
    
    const studentsRaw = getStudents();
    
    if (studentsRaw.length === 0) {
        listEl.innerHTML = `
            <div class="empty-state">
                <p>No students tracking right now.</p>
                <p>Add one above to get started!</p>
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
                            : (m.state === 'current' ? 'status-upcoming' : 'status-upcoming');
            
            // If it's effectively completed because a future one is next and this one isn't overdue
            // We need a better heuristic. Since we can't tell if they literally finished,
            // we assume if today > deadline it's OVERDUE. 
            // We don't have a "completed" state without checkboxes, so it's always 'upcoming' or 'overdue' 
            // relative to today.
            
            // Re-eval for pure visual clarity on dots
            let dotClass = m.state; 
            
            return `
                <div class="milestone ${dotClass}">
                    <div class="ms-dot"></div>
                    <div class="ms-label">${m.label}</div>
                    <div class="ms-date">${formatDate(m.date)}</div>
                    <div class="ms-status ${statusClass}">${m.statusText}</div>
                </div>
            `;
        }).join('');

        card.innerHTML = `
            <div class="sc-header">
                <div>
                    <h3 class="sc-name">${student.name}</h3>
                    <div class="sc-prop-date">Proposal: ${formatDate(new Date(student.proposalDate))}</div>
                </div>
                <button class="btn btn-small btn-danger" onclick="handleDelete('${student.id}')">Remove</button>
            </div>
            <div class="timeline">
                ${timelineHTML}
            </div>
        `;
        listEl.appendChild(card);
    });
}

// Global action handler for inline HTML onclick
window.handleDelete = (id) => {
    if(confirm("Are you sure you want to remove this tracker?")) {
        deleteStudent(id);
        renderStudents();
    }
}

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('student-form');
    const nameInput = document.getElementById('student-name');
    const dateInput = document.getElementById('proposal-date');
    const sortSelect = document.getElementById('sort-select');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = nameInput.value.trim();
        const date = dateInput.value;
        if (name && date) {
            addStudent(name, date);
            nameInput.value = '';
            dateInput.value = '';
            renderStudents();
        }
    });

    sortSelect.addEventListener('change', renderStudents);

    // Initial Render
    renderStudents();
});
