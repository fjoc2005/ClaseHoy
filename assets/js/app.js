/**
 * ClaseHoy - Core Logic (Teacher-Only Mode)
 */

const App = {
    state: {
        filter: {
            region: '',
            subject: '',
            hours: ''
        },
        reportingId: null,
        currentUser: null
    },

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.loadCurrentUser();
        this.setupNavigation();
        this.populateFilters();
        this.loadLocalData();
        this.renderJobs();
    },

    loadLocalData() {
        // ALWAYS Ensure Demo Data Exists for new devices
        // This solves the issue of "on another phone I see nothing"
        const existingJobs = this.getJobs();

        // If empty, load demo data
        if (existingJobs.length === 0) {
            const demoJobs = [
                {
                    id: 'pub-001',
                    institution: 'Juan Pérez',
                    position: 'Profesor de Física - 30 hrs',
                    region: 'Región Metropolitana de Santiago',
                    comuna: 'Ñuñoa',
                    contact: 'contacto.clasehoy@gmail.com',
                    urgency: 'Disponible Inmediatamente',
                    postedBy: 'contacto.clasehoy@gmail.com', // Assigned to Admin for testing
                    timestamp: new Date().toISOString(),
                    isDemo: true
                },
                {
                    id: 'pub-002',
                    institution: 'María González',
                    position: 'Docente de Matemáticas - 44 hrs',
                    region: 'Valparaíso',
                    comuna: 'Valparaíso',
                    contact: 'contacto.clasehoy@gmail.com',
                    urgency: 'Reemplazo disponible',
                    postedBy: 'direccion@liceobicentenario.cl',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    isDemo: true
                },
                {
                    id: 'pub-003',
                    institution: 'Carlos Ruiz',
                    position: 'English Teacher (Native Level)',
                    region: 'Coquimbo',
                    comuna: 'La Serena',
                    contact: 'contacto.clasehoy@gmail.com',
                    urgency: 'Full Time',
                    postedBy: 'recruitment@englishschool.cl',
                    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                    isDemo: true
                }
            ];

            localStorage.setItem('clasehoy_jobs', JSON.stringify(demoJobs));
        }
    },

    cacheDOM() {
        this.welcomeBanner = document.getElementById('welcome-banner');
        this.mainNav = document.getElementById('main-nav');
        this.jobList = document.getElementById('job-list');
        this.reportModal = document.getElementById('report-modal');
        this.reportForm = document.getElementById('report-form');
        this.termsModal = document.getElementById('terms-modal');
        this.postJobForm = document.getElementById('post-job-form'); // For post page logic

        // Filters
        this.filterRegion = document.getElementById('filter-region');
        this.filterSubject = document.getElementById('filter-subject');
        this.filterHours = document.getElementById('filter-hours');
    },

    bindEvents() {
        if (this.reportForm) {
            this.reportForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitReport();
            });
        }
        if (this.postJobForm) {
            this.postJobForm.addEventListener('submit', this.handlePostJob.bind(this));
        }
    },

    /* --- User Session --- */

    loadCurrentUser() {
        this.state.currentUser = Auth.getCurrentUser();
    },

    isAuthenticated() {
        return this.state.currentUser !== null;
    },

    /* --- Navigation Setup --- */

    setupNavigation() {
        if (!this.mainNav) return;

        if (this.isAuthenticated()) {
            // Show authenticated navigation
            this.mainNav.innerHTML = `
                <a href="index.html" class="active"><i class="fa-solid fa-table-columns"></i> Sala de Profes</a>
                <a href="post-job.html"><i class="fa-solid fa-pen-to-square"></i> Publicar</a>
                <a href="profile.html"><i class="fa-solid fa-user"></i> Mi Perfil</a>
                <a href="#" onclick="Auth.logout()" style="color: var(--danger);"><i class="fa-solid fa-right-from-bracket"></i> Salir</a>
            `;

            // Hide welcome banner if exists
            if (this.welcomeBanner) {
                this.welcomeBanner.classList.add('hidden');
            }
        } else {
            // Show guest navigation
            this.mainNav.innerHTML = `
                <a href="index.html" class="active"><i class="fa-solid fa-table-columns"></i> Ver Avisos</a>
                <a href="register.html"><i class="fa-solid fa-user-plus"></i> Registrarse</a>
                <a href="login.html"><i class="fa-solid fa-right-to-bracket"></i> Iniciar Sesión</a>
            `;

            // Show welcome banner if exists
            if (this.welcomeBanner) {
                this.welcomeBanner.classList.remove('hidden');
            }
        }
    },

    /* --- Populate Filters --- */

    populateFilters() {
        if (!this.filterRegion || !this.filterSubject) return;

        // Populate regions
        ChileData.getRegionNames().forEach(regionName => {
            const option = document.createElement('option');
            option.value = regionName;
            option.textContent = regionName;
            this.filterRegion.appendChild(option);
        });

        // Populate subjects
        ChileData.subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            this.filterSubject.appendChild(option);
        });
    },

    /* --- Modals --- */
    openTermsModal() {
        if (this.termsModal) this.termsModal.classList.remove('hidden');
    },

    closeTermsModal() {
        if (this.termsModal) this.termsModal.classList.add('hidden');
    },

    /* --- Data Layer --- */

    getJobs() {
        const jobs = localStorage.getItem('clasehoy_jobs');
        return jobs ? JSON.parse(jobs) : [];
    },

    saveJob(job) {
        const jobs = this.getJobs();
        jobs.unshift(job);
        localStorage.setItem('clasehoy_jobs', JSON.stringify(jobs));
    },

    /* --- Job Posting Logic --- */
    handlePostJob(e) {
        e.preventDefault();

        // Check authentication
        if (!Auth.isAuthenticated()) {
            alert('Debes iniciar sesión para publicar un aviso');
            window.location.href = 'login.html';
            return;
        }

        const formData = new FormData(this.postJobForm);
        const currentUser = Auth.getCurrentUser();

        // Create Job Object
        // Note: Institution is now the user's name
        const job = {
            id: Date.now().toString(),
            institution: currentUser.nombre, // Use profile name
            position: formData.get('position'),
            region: formData.get('region'),
            comuna: formData.get('comuna'),
            contact: formData.get('contact'),
            urgency: formData.get('urgency'),
            postedBy: currentUser.email,
            timestamp: new Date().toISOString()
        };

        this.saveJob(job);
        window.location.href = 'index.html';
    },

    /* --- Rendering --- */

    applyFilters() {
        this.state.filter.region = this.filterRegion.value;
        this.state.filter.subject = this.filterSubject.value;
        this.state.filter.hours = this.filterHours.value;
        this.renderJobs();
    },

    clearFilters() {
        this.filterRegion.value = "";
        this.filterSubject.value = "";
        this.filterHours.value = "";
        this.applyFilters();
    },

    renderJobs() {
        if (!this.jobList) return;

        const allJobs = this.getJobs();
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

        let filtered = allJobs.filter(job => {
            const jobTime = new Date(job.timestamp);
            const isRefused = localStorage.getItem(`report_${job.id}`);
            if (isRefused) return false;
            if (jobTime < twentyFourHoursAgo) return false;

            if (this.state.filter.region && job.region !== this.state.filter.region) return false;
            if (this.state.filter.subject && !job.position.includes(this.state.filter.subject)) return false;

            return true;
        });

        if (filtered.length === 0) {
            this.jobList.innerHTML = `
                <div class="card text-center text-muted" style="grid-column: 1/-1;">
                    <p>No se encontraron avisos con estos filtros.</p>
                </div>`;
            return;
        }

        this.jobList.innerHTML = filtered.map(job => this.createJobCard(job)).join('');
    },

    createJobCard(job) {
        const posted = new Date(job.timestamp);
        const diffHours = (new Date() - posted) / (1000 * 60 * 60);
        let timeBadge = '';
        if (diffHours < 6) timeBadge = '<span class="carnet-badge badge-new">Nuevo</span>';
        else if (diffHours < 12) timeBadge = '<span class="carnet-badge badge-recent">Reciente</span>';

        let subjectClass = 'tag-default';
        const position = job.position.toLowerCase();
        if (position.includes('matemática') || position.includes('matematica')) subjectClass = 'tag-math';
        if (position.includes('lenguaje') || position.includes('comunicación')) subjectClass = 'tag-lang';
        if (position.includes('historia') || position.includes('geografía')) subjectClass = 'tag-hist';
        if (position.includes('ciencias') || position.includes('biología') || position.includes('química') || position.includes('física')) subjectClass = 'tag-sci';
        if (position.includes('arte') || position.includes('música')) subjectClass = 'tag-arts';
        if (position.includes('inglés') || position.includes('idioma extranjero')) subjectClass = 'tag-eng';

        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.institution)}&background=random&color=fff`;

        const isAuthenticated = this.isAuthenticated();

        // Contact Button Logic
        let contactButtonSource = '';
        if (isAuthenticated) {
            // Check if user is the owner
            const currentUser = Auth.getCurrentUser();
            if (currentUser.email === job.postedBy) {
                contactButtonSource = `<button class="btn btn-secondary text-sm" disabled>Tu Publicación</button>`;
            } else {
                contactButtonSource = `<button class="btn btn-primary text-sm shadow-md" onclick="App.initiateContact('${job.id}')">
                   Contactar <i class="fa-solid fa-paper-plane ms-2"></i>
                 </button>`;
            }
        } else {
            contactButtonSource = `<button class="btn btn-secondary text-sm" onclick="window.location.href='login.html'" style="opacity: 0.8;">
                 <i class="fa-solid fa-lock mr-2"></i> Ingresar para contactar
               </button>`;
        }

        const urgencyLabel = job.urgency === 'alta' ?
            '<span style="color:var(--danger); font-weight:700;"><i class="fa-solid fa-fire"></i> Urgencia Inmediata</span>' :
            '<span class="text-muted"><i class="fa-solid fa-calendar"></i> Disponibilidad Normal</span>';

        return `
        <article class="card carnet carnet-institution" id="card-${job.id}" style="border-top-width: 6px;">
            ${timeBadge}
            <div class="carnet-header">
                <img src="${avatarUrl}" alt="Logo" class="carnet-avatar shadow-sm">
                <div>
                    <h3 class="font-bold text-lg text-primary">${job.institution}</h3>
                    <div class="text-xs text-muted mt-1">Cód: ${job.id}</div>
                </div>
            </div>
            
            <div class="carnet-body">
                <div class="mb-2">
                    <span class="subject-tag ${subjectClass}">${job.position}</span>
                </div>
                <p class="text-sm border-bottom-light"><i class="fa-solid fa-location-dot width-icon"></i> ${job.region}${job.comuna ? ', ' + job.comuna : ''}</p>
                <p class="text-sm pt-1">${urgencyLabel}</p>
            </div>

            <div class="carnet-footer">
                <div class="disclaimer-text">
                    Contacto exclusivo para usuarios registrados.
                </div>
                <div class="carnet-actions">
                    ${contactButtonSource}
                    <button class="report-btn" onclick="App.openReportModal('${job.id}')" title="Reportar problema">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </button>
                </div>
            </div>
        </article>
        `;
    },
    initiateContact(jobId) {
        const jobs = this.getJobs();
        const job = jobs.find(j => j.id === jobId);
        const currentUser = Auth.getCurrentUser();

        if (!job || !currentUser) return;

        // Generate Message Template
        const subject = encodeURIComponent(`Contacto Aviso Ref: ${job.id} - ${job.position}`);
        const bodyLines = [
            `Hola equipo ClaseHoy,`,
            ``,
            `Estoy interesado en el siguiente aviso:`,
            `ID Aviso: ${job.id}`,
            `Institución: ${job.institution}`,
            `Cargo: ${job.position}`,
            ``,
            `Mis Datos de Contacto:`,
            `Nombre: ${currentUser.nombre}`,
            `Email: ${currentUser.email}`,
            ``,
            `Mensaje:`,
            `Hola, me gustaría postular a este cargo. Quedo atento a su respuesta.`
        ];
        const body = encodeURIComponent(bodyLines.join('\n'));

        // Open Mail Client
        const mailtoLink = `mailto:contacto.clasehoy@gmail.com?subject=${subject}&body=${body}`;

        if (confirm(`Se abrirá tu cliente de correo para enviar un mensaje a ClaseHoy sobre este aviso.\n\nReferencia: ${job.id}`)) {
            window.location.href = mailtoLink;
        }
    },

    // revealContact(id, contact) { ... } // Removed old method

    /* --- Reporting System --- */

    openReportModal(id) {
        this.state.reportingId = id;
        this.reportModal.classList.remove('hidden');
    },

    closeReportModal() {
        this.state.reportingId = null;
        this.reportModal.classList.add('hidden');
        this.reportForm.reset();
    },

    submitReport() {
        if (this.state.reportingId) {
            // New Logic: Send email report instead of deleting immediately
            const jobId = this.state.reportingId;
            const problem = this.reportForm.querySelector('textarea').value;
            const currentUser = Auth.getCurrentUser() || { email: 'Anónimo' };

            const subject = encodeURIComponent(`Reporte de Aviso ID: ${jobId}`);
            const body = encodeURIComponent(`He reportado el siguiente aviso:\n\nID: ${jobId}\nMotivo: ${problem}\nReportado por: ${currentUser.email}\n\nPor favor revisar.`);

            // Construct mailto link
            const mailtoLink = `mailto:contacto.clasehoy@gmail.com?subject=${subject}&body=${body}`;

            // Open mail client
            window.location.href = mailtoLink;

            // Close modal
            this.closeReportModal();

            // Optional: User feedback
            alert('Se abrirá tu cliente de correo para enviar el reporte. El equipo de ClaseHoy revisará el caso.');
        }
    },

    async loadLocalData() {
        // 1. Load Local Data
        let jobs = this.getJobs();

        // 2. Try to Sync with "Cloud" (Static JSON or Backend)
        if (typeof BackendService !== 'undefined') {
            try {
                const syncedJobs = await BackendService.syncJobs(jobs);
                if (syncedJobs.length > 0) {
                    jobs = syncedJobs;
                    localStorage.setItem('clasehoy_jobs', JSON.stringify(jobs));
                }
            } catch (e) {
                console.warn('Sync failed, using local data');
            }
        }

        // 3. Render
        this.renderJobs();
    }
};

let deferredPrompt;

document.addEventListener('DOMContentLoaded', () => {
    App.init();

    // --- PWA Native Install Logic ---
    const pwaBanner = document.getElementById('pwa-banner');
    const pwaBtn = pwaBanner ? pwaBanner.querySelector('.pwa-btn') : null;

    // 1. Listen for the native event (Android/Desktop)
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;

        // Show our UI
        if (pwaBanner && !localStorage.getItem('pwa_dismissed')) {
            pwaBanner.classList.remove('hidden');

            // Update button behavior
            if (pwaBtn) {
                pwaBtn.onclick = async (evt) => {
                    evt.preventDefault();
                    // Show the prompt
                    deferredPrompt.prompt();
                    // Wait for the user to respond to the prompt
                    const { outcome } = await deferredPrompt.userChoice;
                    console.log(`User response to the install prompt: ${outcome}`);
                    // We've used the prompt, and can't use it again, throw it away
                    deferredPrompt = null;
                    // Hide banner
                    pwaBanner.classList.add('hidden');
                    localStorage.setItem('pwa_dismissed', 'true');
                };
            }
        }
    });

    // 2. iOS Logic (Manual Instructions)
    // iOS does NOT support beforeinstallprompt, so we must show manual instructions
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isIOS && !localStorage.getItem('pwa_dismissed')) {
        if (pwaBanner) {
            pwaBanner.classList.remove('hidden');
            if (pwaBtn) {
                pwaBtn.onclick = (e) => {
                    e.preventDefault();
                    alert('Para instalar en iOS:\n1. Toca el botón "Compartir" (cuadrado con flecha)\n2. Selecciona "Agregar al Inicio" (➕)');
                };
            }
        }
    }
});
