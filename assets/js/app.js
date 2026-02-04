/**
 * ClaseHoy - Core Logic (SAFE MODE)
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

        // ⚠️ BLINDAJE: no romper si algo falta
        this.setupNavigation();

        if (typeof this.populateFilters === 'function') {
            this.populateFilters();
        } else {
            console.warn('populateFilters() no disponible – continuando sin filtros');
        }

        // Auth reactivo (fuente única de verdad)
        if (window.Auth && Auth.getCurrentUser) {
            this.state.currentUser = Auth.getCurrentUser();
        }

        // Listener Firestore
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
        this.renderJobs();
    },

    cacheDOM() {
        this.mainNav = document.getElementById('main-nav');
        this.jobList = document.getElementById('job-list');
        this.filterRegion = document.getElementById('filter-region');
        this.filterSubject = document.getElementById('filter-subject');
    },

    bindEvents() {},

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
                <h3>${j.institution}</h3>
                <p>${j.position}</p>
            </div>
        `).join('');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
