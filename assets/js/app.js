/**
 * ClaseHoy - Core Logic (Auth-SAFE VERSION)
 */

const App = {

    init() {
        this.cacheDOM();
        this.bindEvents();

        this.setupNavigation();
        this.populateFilters();

        // 🔔 Escuchar cambios de Auth (Auth es la única fuente de verdad)
        this.onAuthChange = () => {
            this.setupNavigation();
            this.renderJobs();
        };

        // Listener de avisos
        if (typeof BackendService !== 'undefined') {
            BackendService.listenJobs((jobs) => {
                localStorage.setItem('clasehoy_jobs', JSON.stringify(jobs));
                this.renderJobs(jobs);
            });
        } else {
            this.renderJobs();
        }
    },

    /* --- DOM --- */

    cacheDOM() {
        this.welcomeBanner = document.getElementById('welcome-banner');
        this.mainNav = document.getElementById('main-nav');
        this.jobList = document.getElementById('job-list');
        this.postJobForm = document.getElementById('post-job-form');

        this.filterRegion = document.getElementById('filter-region');
        this.filterSubject = document.getElementById('filter-subject');
        this.filterHours = document.getElementById('filter-hours');
    },

    bindEvents() {
        if (this.postJobForm) {
            this.postJobForm.addEventListener('submit', this.handlePostJob.bind(this));
        }
    },

    /* --- AUTH HELPERS --- */

    isAuthenticated() {
        return Auth.isAuthenticated();
    },

    getCurrentUser() {
        return Auth.getCurrentUser();
    },

    /* --- NAV --- */

    setupNavigation() {
        if (!this.mainNav) return;

        if (this.isAuthenticated()) {
            this.mainNav.innerHTML = `
                <a href="index.html" class="active">Sala de Profes</a>
                <a href="post-job.html">Publicar</a>
                <a href="profile.html">Mi Perfil</a>
                <a href="#" onclick="Auth.logout()" style="color:red;">Salir</a>
            `;
            this.welcomeBanner?.classList.add('hidden');
        } else {
            this.mainNav.innerHTML = `
                <a href="index.html" class="active">Ver Avisos</a>
                <a href="register.html">Registrarse</a>
                <a href="login.html">Iniciar Sesión</a>
            `;
            this.welcomeBanner?.classList.remove('hidden');
        }
    },

    /* --- DATA --- */

    getJobs() {
        return JSON.parse(localStorage.getItem('clasehoy_jobs') || '[]');
    },

    /* --- POST JOB --- */

    handlePostJob(e) {
        e.preventDefault();

        if (!this.isAuthenticated()) {
            alert('Debes iniciar sesión');
            window.location.href = 'login.html';
            return;
        }

        const user = this.getCurrentUser();
        const formData = new FormData(this.postJobForm);

        const job = {
            institution: user.nombre,
            position: formData.get('position'),
            region: formData.get('region'),
            comuna: formData.get('comuna'),
            contact: formData.get('contact'),
            urgency: formData.get('urgency'),
            postedBy: user.email
        };

        BackendService.saveRemoteJob(job).then(() => {
            window.location.href = 'index.html';
        });
    },

    /* --- RENDER --- */

    renderJobs(jobsOverride = null) {
        if (!this.jobList) return;

        const jobs = jobsOverride || this.getJobs();

        if (jobs.length === 0) {
            this.jobList.innerHTML = `<p>No hay avisos</p>`;
            return;
        }

        this.jobList.innerHTML = jobs.map(job => `
            <article class="card">
                <h3>${job.institution}</h3>
                <p>${job.position}</p>
                ${
                    this.isAuthenticated()
                        ? `<button>Contactar</button>`
                        : `<button onclick="location.href='login.html'">Ingresar para contactar</button>`
                }
            </article>
        `).join('');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
