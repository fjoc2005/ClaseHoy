/**
 * ClaseHoy - Core Logic (SAFE MODE ESTABLE)
 */

const App = {
    state: {
        filter: {
            region: '',
            subject: '',
            hours: ''
        },
        currentUser: null
    },

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.setupNavigation();

        // Poblar filtros (si existe)
        if (typeof this.populateFilters === 'function') {
            this.populateFilters();
        }

        // 🔑 Conexión REAL con Auth
        if (window.Auth && typeof Auth.onAuthStateChanged === 'function') {
            Auth.onAuthStateChanged((user) => {
                this.onAuthChange(user);
            });
        } else if (window.Auth && Auth.getCurrentUser) {
            this.state.currentUser = Auth.getCurrentUser();
            this.setupNavigation();
        }

        // 🔥 Listener Firestore
        if (window.BackendService && BackendService.listenJobs) {
            BackendService.listenJobs((jobs) => {
                localStorage.setItem('clasehoy_jobs', JSON.stringify(jobs));
                this.renderJobs(jobs);
            });
        } else {
            this.renderJobs(this.getJobs());
        }
    },

    onAuthChange(user) {
        this.state.currentUser = user;
        this.setupNavigation();
        this.renderJobs(this.getJobs());
    },

    cacheDOM() {
        this.mainNav = document.getElementById('main-nav');
        this.jobList = document.getElementById('job-list');
        this.filterRegion = document.getElementById('filter-region');
        this.filterSubject = document.getElementById('filter-subject');
        this.filterHours = document.getElementById('filter-hours');
    },

    bindEvents() {
        if (this.filterRegion) {
            this.filterRegion.addEventListener('change', () => this.applyFilters());
        }
        if (this.filterSubject) {
            this.filterSubject.addEventListener('change', () => this.applyFilters());
        }
        if (this.filterHours) {
            this.filterHours.addEventListener('change', () => this.applyFilters());
        }
    },

    isAuthenticated() {
        return !!this.state.currentUser;
    },

    setupNavigation() {
        if (!this.mainNav) return;

        if (this.isAuthenticated()) {
            this.mainNav.innerHTML = `
                <a href="index.html">Avisos</a>
                <a href="post-job.html">Publicar</a>
                <a href="#" onclick="Auth.logout()">Salir</a>
            `;
        } else {
            this.mainNav.innerHTML = `
                <a href="index.html">Avisos</a>
                <a href="login.html">Ingresar</a>
                <a href="register.html">Registro</a>
            `;
        }
    },

    populateFilters() {
        if (!this.filterRegion || !this.filterSubject) return;

        ChileData.getRegionNames().forEach(r => {
            const o = document.createElement('option');
            o.value = r;
            o.textContent = r;
            this.filterRegion.appendChild(o);
        });

        ChileData.subjects.forEach(s => {
            const o = document.createElement('option');
            o.value = s;
            o.textContent = s;
            this.filterSubject.appendChild(o);
        });
    },

    applyFilters() {
        const jobs = this.getJobs();

        const region = this.filterRegion?.value || '';
        const subject = this.filterSubject?.value || '';
        const hours = this.filterHours?.value || '';

        const filtered = jobs.filter(j => {
            return (
                (!region || j.region === region) &&
                (!subject || j.subject === subject) &&
                (!hours || j.hours === hours)
            );
        });

        this.renderJobs(filtered);
    },

    clearFilters() {
        if (this.filterRegion) this.filterRegion.value = '';
        if (this.filterSubject) this.filterSubject.value = '';
        if (this.filterHours) this.filterHours.value = '';
        this.renderJobs(this.getJobs());
    },

    getJobs() {
        return JSON.parse(localStorage.getItem('clasehoy_jobs') || '[]');
    },

    renderJobs(jobs = []) {
        if (!this.jobList) return;

        if (!jobs.length) {
            this.jobList.innerHTML = `<p>No hay avisos activos.</p>`;
            return;
        }

        this.jobList.innerHTML = jobs.map(j => `
            <div class="card">
                <h3>${j.institution || 'Institución'}</h3>
                <p>${j.position || 'Cargo'}</p>
            </div>
        `).join('');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
