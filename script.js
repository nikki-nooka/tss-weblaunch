// Tab Switcher Logic
function switchTab(tabId) {
  // Hide all tab contents
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(content => content.classList.remove('active'));

  // Deactivate all tab buttons
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  // Show selected content and activate button
  document.getElementById(`tab-${tabId}`).classList.add('active');
  
  // Find the button that calls this function and make it active
  const eventTarget = window.event ? window.event.currentTarget : null;
  if (eventTarget) {
    eventTarget.classList.add('active');
  } else {
    // Fallback: search by text or index if event is missing
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
      if (btn.innerText.toLowerCase().includes(tabId)) {
        btn.classList.add('active');
      }
    });
  }
}

// Stats Counter Animation
const statsSection = document.querySelector('.stats');
const statElements = document.querySelectorAll('.stat-item h3');
let animated = false;

function animateStats() {
  statElements.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds
    const stepTime = Math.abs(Math.floor(duration / target));
    let current = 0;
    
    // For large numbers, increment in steps to match duration
    const increment = target > 500 ? Math.ceil(target / 100) : 1;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      
      // Format number presentation
      if (target === 20000) {
        stat.innerText = current.toLocaleString() + '+';
      } else if (target === 100 || target === 800) {
        stat.innerText = current + '+';
      } else {
        stat.innerText = current + 'h';
      }
    }, target > 500 ? 20 : stepTime);
  });
}

// Intersection Observer for Stats
if (statsSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animateStats();
        animated = true;
      }
    });
  }, { threshold: 0.5 });
  
  observer.observe(statsSection);
}

// Interactive Card Customizer
const inputName = document.getElementById('input-name');
const inputCollege = document.getElementById('input-college');
const inputRole = document.getElementById('input-role');
const inputBadge = document.getElementById('input-badge');

const cardName = document.getElementById('card-name');
const cardCollege = document.getElementById('card-college');
const cardRole = document.getElementById('card-role');
const cardBadge = document.getElementById('card-badge');
const cardId = document.getElementById('card-id');
const virtualCard = document.getElementById('virtual-card');

// Helper to generate a Member ID format: TSS-XX-DDMMYYXXX
function generateMockID(name, role) {
  // Get role initials
  let rolePrefix = 'ST'; // Student default
  if (role.includes('Founder')) rolePrefix = 'FD';
  if (role.includes('Developer') || role.includes('Freelance')) rolePrefix = 'DV';
  if (role.includes('Mentor')) rolePrefix = 'MN';
  if (role.includes('Design')) rolePrefix = 'DS';

  // Get current date formatted DDMMYY
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
  const yy = String(today.getFullYear()).slice(-2);
  const dateStr = `${dd}${mm}${yy}`;

  // Stable hash based on name to get a consistent 3 digit suffix (001 - 999)
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const suffix = String(Math.abs(hash % 900) + 100); // Between 100 and 999

  return `TSS-${rolePrefix}-${dateStr}${suffix}`;
}

function updateProgressBar() {
  let progress = 50; // Role and Status are pre-selected
  
  if (inputName.value.trim().length > 3) {
    progress += 25;
  }
  if (inputCollege.value.trim().length > 5) {
    progress += 25;
  }

  const percentEl = document.getElementById('progress-percent');
  const fillEl = document.getElementById('progress-fill');
  
  if (percentEl && fillEl) {
    percentEl.innerText = progress + '%';
    fillEl.style.width = progress + '%';
  }
}

function updateCard() {
  const nameVal = inputName.value.trim() || 'Rajkamal Panthagani';
  const collegeVal = inputCollege.value.trim() || 'Karimnagar College of Engineering';
  const roleVal = inputRole.value;
  const badgeVal = inputBadge.value;

  // Update text values
  cardName.innerText = nameVal;
  cardCollege.innerText = collegeVal;
  cardRole.innerText = roleVal;
  cardBadge.innerText = badgeVal;

  // Generate ID
  cardId.innerText = generateMockID(nameVal, roleVal);

  // Update Badge Style class
  cardBadge.className = 'card-badge-ui';
  if (badgeVal === 'VERIFIED') {
    cardBadge.style.background = 'rgba(16, 185, 129, 0.2)';
    cardBadge.style.color = '#10B981';
    cardBadge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
    virtualCard.className = 'virtual-card status-verified';
  } else if (badgeVal === 'UNDER AUDIT') {
    cardBadge.style.background = 'rgba(247, 127, 0, 0.2)';
    cardBadge.style.color = '#F77F00';
    cardBadge.style.borderColor = 'rgba(247, 127, 0, 0.3)';
    virtualCard.className = 'virtual-card status-audit';
  } else {
    cardBadge.style.background = 'rgba(252, 191, 73, 0.2)';
    cardBadge.style.color = '#FCBF49';
    cardBadge.style.borderColor = 'rgba(252, 191, 73, 0.3)';
    virtualCard.className = 'virtual-card status-trial';
  }

  updateProgressBar();
}

// Custom Role Selection Chips
const roleChips = document.querySelectorAll('#role-chips .role-chip');
roleChips.forEach(chip => {
  chip.addEventListener('click', () => {
    roleChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    inputRole.value = chip.getAttribute('data-value');
    updateCard();
  });
});

// Custom Status Selection Chips
const statusChips = document.querySelectorAll('#status-chips .status-chip');
statusChips.forEach(chip => {
  chip.addEventListener('click', () => {
    statusChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    inputBadge.value = chip.getAttribute('data-value');
    updateCard();
  });
});

// Scanning Action
const btnScan = document.getElementById('btn-scan');
const laserScanner = document.getElementById('laser-scanner');
if (btnScan && laserScanner) {
  btnScan.addEventListener('click', () => {
    const currentStatus = inputBadge.value;
    if (currentStatus === 'VERIFIED') {
      laserScanner.style.background = '#10B981';
      laserScanner.style.boxShadow = '0 0 8px #10B981, 0 0 16px #10B981';
    } else if (currentStatus === 'UNDER AUDIT') {
      laserScanner.style.background = '#F77F00';
      laserScanner.style.boxShadow = '0 0 8px #F77F00, 0 0 16px #F77F00';
    } else {
      laserScanner.style.background = '#FCBF49';
      laserScanner.style.boxShadow = '0 0 8px #FCBF49, 0 0 16px #FCBF49';
    }

    laserScanner.classList.remove('scanning');
    void laserScanner.offsetWidth; // Trigger reflow to restart CSS animation
    laserScanner.classList.add('scanning');

    btnScan.innerHTML = 'Scanning...';
    btnScan.disabled = true;

    setTimeout(() => {
      btnScan.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><polyline points="20 6 9 17 4 12"/></svg>Scan Complete';
      setTimeout(() => {
        btnScan.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/></svg>Security Scan';
        btnScan.disabled = false;
      }, 1500);
    }, 2000);
  });
}

// Export Card Action
const btnExport = document.getElementById('btn-export');
if (btnExport) {
  btnExport.addEventListener('click', () => {
    btnExport.innerHTML = 'Exporting...';
    btnExport.disabled = true;

    setTimeout(() => {
      btnExport.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><polyline points="20 6 9 17 4 12"/></svg>Card Saved!';
      setTimeout(() => {
        btnExport.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>Export ID Card';
        btnExport.disabled = false;
      }, 1500);
    }, 1200);
  });
}

// Event Listeners for customizer
if (inputName) inputName.addEventListener('input', updateCard);
if (inputCollege) inputCollege.addEventListener('input', updateCard);

// Initial run
updateCard();

// Card 3D Tilt Effect
const cardContainer = document.querySelector('.card-container');
const virtualCard = document.getElementById('virtual-card');

if (cardContainer && virtualCard) {
  cardContainer.addEventListener('mousemove', (e) => {
    const rect = cardContainer.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element
    
    // Calculate rotation angles based on mouse position relative to center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 15; // Max 15 degrees
    const rotateX = -((y - centerY) / centerY) * 15; // Max 15 degrees

    virtualCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  cardContainer.addEventListener('mouseleave', () => {
    // Smooth reset
    virtualCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
    virtualCard.style.transition = 'transform 0.5s ease';
  });

  cardContainer.addEventListener('mouseenter', () => {
    virtualCard.style.transition = 'none';
  });
}
