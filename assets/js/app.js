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

        // Setup initial UI structure immediately (Static Layout)
        this.setupNavigation();
        this.populateFilters();

        // Note: Removed proactive hiding of UI elements.
        // The Job List and static content must render immediately.
        // Auth state will update the Nav/Buttons asynchronously.

        // Initialize Auth Listener to update UI when ready
        // Auth.init() is already called in auth.js, but we need to react to it.
        // We will expose a method for Auth to call: App.onAuthChange(user)

        // Start Real-time Listener for Jobs
        if (typeof BackendService !== 'undefined') {
            BackendService.listenJobs((jobs) => {
                // Update Local Cache
                localStorage.setItem('clasehoy_jobs', JSON.stringify(jobs));

                // Auto-Seed if empty (Requested by User for Demos)
                if (jobs.length === 0 && window.seedDatabase) {
                    console.log("No jobs found. Seeding demo data...");
                    window.seedDatabase().then(() => {
                        console.log("Seeding initiated.");
                    });
                }

                this.renderJobs(jobs);
            });
        } else {
            this.loadLocalData();
            this.renderJobs();
        }
    },

    onAuthChange(user) {
        this.state.currentUser = user;
        this.setupNavigation();
        // Re-render to update "Contact" buttons based on new auth state
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
            // id: ... generated by Firestore
            institution: currentUser.nombre, // Use profile name
            position: formData.get('position'),
            region: formData.get('region'),
            comuna: formData.get('comuna'),
            contact: formData.get('contact'),
            urgency: formData.get('urgency'),
            postedBy: currentUser.email
        };

        // Don't save locally immediately; wait for listener or optimistic UI
        // But for now, just sending to Cloud relies on the listener to update the UI

        // Save to Cloud (Async)
        if (typeof BackendService !== 'undefined') {
            BackendService.saveRemoteJob(job).then((success) => {
                if (success) {
                    console.log('Job saved successfully');
                    // Reset form and go back
                    window.location.href = 'index.html';
                }
            });
        }

        // Fallback or optimistic
        // this.saveJob(job); // Removed: we trust the cloud listener to add it to the list


        // Logic moved inside the then() block above
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

    renderJobs(jobsOverride = null) {
        if (!this.jobList) return;

        // Use override or fallback to localStorage
        const allJobs = jobsOverride || this.getJobs();

        // Note: Timestamps in Firestore might be objects (Timestamp) or strings (ISO)
        // We need to handle that in the filter.

        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

        let filtered = allJobs.filter(job => {
            const isRefused = localStorage.getItem(`report_${job.id}`);
            if (isRefused) return false;

            // Date Handling
            let jobTime;
            if (job.createdAt && job.createdAt.seconds) {
                // Firestore Timestamp
                jobTime = new Date(job.createdAt.seconds * 1000);
            } else if (job.timestamp) {
                // String ISO
                jobTime = new Date(job.timestamp);
            } else {
                // Fallback
                jobTime = new Date();
            }

            // Expiration check (Double check here, though query handles it)
            if (job.expiresAt && job.expiresAt.seconds) {
                // Precise check using expiresAt
                const expiresAt = new Date(job.expiresAt.seconds * 1000);
                if (now > expiresAt) return false;
            } else {
                // Legacy fallback check (24h from created)
                if (jobTime < twentyFourHoursAgo) return false;
            }

            if (this.state.filter.region && job.region !== this.state.filter.region) return false;
            if (this.state.filter.subject && !job.position.includes(this.state.filter.subject)) return false;

            return true;
        });

        if (filtered.length === 0) {
            this.jobList.innerHTML = `
                <div class="card text-center text-muted" style="grid-column: 1/-1;">
                    <p>No se encontraron avisos vigentes con estos filtros.</p>
                </div>`;
            return;
        }

        this.jobList.innerHTML = filtered.map(job => this.createJobCard(job)).join('');
    },

    createJobCard(job) {
        // Date Handling for Badge
        let posted;
        if (job.createdAt && job.createdAt.seconds) {
            posted = new Date(job.createdAt.seconds * 1000);
        } else if (job.timestamp) {
            posted = new Date(job.timestamp);
        } else {
            posted = new Date();
        }
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

        if (position.includes('inglés') || position.includes('idioma extranjero')) subjectClass = 'tag-eng';

        // Avatar Strategy:
        // 1. Use user's photoURL if valid (e.g. from Profile)
        // 2. Fallback to 3D Penguin Legacy (Default)
        let avatarUrl = job.photoURL || 'assets/images/penguin-avatar.svg';

        // Legacy cleanup: If old demo data has dicebear, replace it visually if desired, 
        // or just accept it. Instruction says "Asignar... a cada perfil".
        // Use penguin if specific conditions met (e.g. missing or placeholder)
        if (!avatarUrl || avatarUrl.includes('dicebear') || avatarUrl.includes('ui-avatars')) {
            avatarUrl = 'assets/images/penguin-avatar.svg';
        }

        const isAuthenticated = this.isAuthenticated();

        // Contact Button Logic
        let contactButtonSource = '';
        if (isAuthenticated) {
            // Check if user is the owner
            const currentUser = Auth.getCurrentUser();
            if (currentUser && currentUser.email === job.postedBy) {
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
                    <!-- ID Hidden from UI, kept in data attribute for logic -->
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
                    ${isAuthenticated && Auth.getCurrentUser() && Auth.getCurrentUser().email === job.postedBy ?
                `<button class="btn btn-danger text-sm" onclick="App.deleteJob('${job.id}')" title="Eliminar mi aviso">
                            <i class="fa-solid fa-trash"></i>
                        </button>` : ''
            }
                </div>
            </div>
        </article>
        `;
    },

    async deleteJob(jobId) {
        if (!confirm("¿Estás seguro de que quieres eliminar este aviso?")) return;

        try {
            await BackendService.deleteJob(jobId);
            alert("Aviso eliminado correctamente.");
            // Manual remove from DOM to feel instant
            const card = document.getElementById(`card-${jobId}`);
            if (card) card.remove();
        } catch (error) {
            console.error("Error deleting job:", error);
            alert("Error al eliminar el aviso.");
        }
    },
    initiateContact(jobId) {
        const jobs = this.getJobs();
        const job = jobs.find(j => j.id === jobId);
        const currentUser = Auth.getCurrentUser();

        if (!job || !currentUser) return;

        // Generate Message Template
        const subject = encodeURIComponent(`Contacto Aviso Ref: ${job.id} - ${job.position} `);
        const bodyLines = [
            `Hola equipo ClaseHoy, `,
            ``,
            `Estoy interesado en el siguiente aviso: `,
            `ID Aviso: ${job.id} `,
            `Institución: ${job.institution} `,
            `Cargo: ${job.position} `,
            ``,
            `Mis Datos de Contacto: `,
            `Nombre: ${currentUser.nombre} `,
            `Email: ${currentUser.email} `,
            ``,
            `Mensaje: `,
            `Hola, me gustaría postular a este cargo.Quedo atento a su respuesta.`
        ];
        const body = encodeURIComponent(bodyLines.join('\n'));

        // Open Mail Client
        const mailtoLink = `mailto: contacto.clasehoy@gmail.com?subject = ${subject}& body=${body} `;

        if (confirm(`Se abrirá tu cliente de correo para enviar un mensaje a ClaseHoy sobre este aviso.\n\nReferencia: ${job.id} `)) {
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

            const subject = encodeURIComponent(`Reporte de Aviso ID: ${jobId} `);
            const body = encodeURIComponent(`He reportado el siguiente aviso: \n\nID: ${jobId} \nMotivo: ${problem} \nReportado por: ${currentUser.email} \n\nPor favor revisar.`);

            // Construct mailto link
            const mailtoLink = `mailto: contacto.clasehoy@gmail.com?subject = ${subject}& body=${body} `;

            // Open mail client
            window.location.href = mailtoLink;

            // Close modal
            this.closeReportModal();

            // Optional: User feedback
            alert('Se abrirá tu cliente de correo para enviar el reporte. El equipo de ClaseHoy revisará el caso.');
        }
    },

    async loadLocalData() {
        console.log("Loading data...");

        // 1. Try to fetch from Backend Service (Firestore)
        // MOVED TO LISTENER IN INIT()
        // Kept empty or just ensuring demo data exists


        // 2. Fallback: Load Local Cache
        let jobs = this.getJobs();

        // 3. Render Cache (if any)
        if (jobs.length > 0) {
            this.renderJobs();
        } else {
            // If completely empty (new device, no offline cache, failed fetch)
            // We can show "No hay avisos" or try to load Demo Data *only* if explicitly needed.
            // For now, let's render empty state handles it.
            this.renderJobs();
        }
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
                    console.log(`User response to the install prompt: ${outcome} `);
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
