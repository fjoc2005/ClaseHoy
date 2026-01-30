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

        const job = {
            id: Date.now().toString(),
            institution: formData.get('institution'),
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
        const contactButton = isAuthenticated
            ? `<button class="btn btn-primary text-sm" onclick="App.revealContact('${job.id}', '${job.contact}')">
                 Contactar <i class="fa-solid fa-phone ms-2"></i>
               </button>`
            : `<button class="btn btn-secondary text-sm" onclick="window.location.href='login.html'" style="opacity: 0.7;">
                 <i class="fa-solid fa-lock mr-2"></i> Inicia sesión para contactar
               </button>`;

        return `
        <article class="card carnet carnet-institution" id="card-${job.id}">
            ${timeBadge}
            <div class="carnet-header">
                <img src="${avatarUrl}" alt="Logo" class="carnet-avatar">
                <div>
                    <h4 class="font-bold text-sm text-muted uppercase">Busco Profesor/a</h4>
                    <h3 class="font-bold">${job.institution}</h3>
                </div>
            </div>
            
            <div class="carnet-body">
                <span class="subject-tag ${subjectClass}">${job.position}</span>
                <p class="text-sm"><i class="fa-solid fa-location-dot"></i> ${job.region}${job.comuna ? ', ' + job.comuna : ''}</p>
                <p class="text-sm"><i class="fa-solid fa-clock"></i> ${job.urgency === 'alta' ? 'Urgencia Inmediata' : 'Disponibilidad Normal'}</p>
            </div>

            <div class="carnet-footer">
                <div class="disclaimer-text">
                    Este aviso es responsabilidad exclusiva del usuario que lo publica. La plataforma no participa en la relación laboral.
                </div>
                <div class="carnet-actions">
                    ${contactButton}
                    <button class="report-btn" onclick="App.openReportModal('${job.id}')" title="Reportar problema">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </button>
                </div>
            </div>
        </article>
        `;
    },

    revealContact(id, contact) {
        const card = document.getElementById(`card-${id}`);
        card.classList.add('revealed');
        const btn = card.querySelector('.btn-primary');
        btn.parentElement.innerHTML = `<a href="tel:${contact}" class="font-bold text-sm" style="color:var(--brand-primary); text-decoration:none;">${contact}</a>`;
    },

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
            localStorage.setItem(`report_${this.state.reportingId}`, 'true');
            this.closeReportModal();
            this.renderJobs();
            alert('Gracias. El reporte ha sido enviado y el aviso ocultado.');
        }
    },

    loadLocalData() {
        // This method can be used to load any initial demo data if needed
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
