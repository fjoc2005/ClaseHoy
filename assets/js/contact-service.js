/**
 * ClaseHoy - Contact Service (Mocked Backend)
 * Handles "blind" contact requests between Applicant and Publisher.
 */

const ContactService = {
    REQUESTS_KEY: 'clasehoy_contact_requests',

    init() {
        if (!localStorage.getItem(this.REQUESTS_KEY)) {
            localStorage.setItem(this.REQUESTS_KEY, JSON.stringify([]));
        }
    },

    getAllRequests() {
        return JSON.parse(localStorage.getItem(this.REQUESTS_KEY) || '[]');
    },

    /**
     * Create a new contact request
     * @param {Object} job - The job posting object
     * @param {Object} applicant - The user applying
     */
    createRequest(job, applicant) {
        const requests = this.getAllRequests();

        // Check if already requested
        const existing = requests.find(r => r.jobId === job.id && r.applicantEmail === applicant.email);
        if (existing) {
            return { success: false, error: 'Ya has enviado una solicitud para este aviso.' };
        }

        const token = this.generateToken();
        const request = {
            id: token,
            jobId: job.id,
            jobTitle: job.position,
            publisherEmail: job.postedBy,
            applicantEmail: applicant.email,
            applicantName: applicant.nombre,
            status: 'PENDING', // PENDING, ACCEPTED, REJECTED
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // 48 hours
        };

        requests.push(request);
        localStorage.setItem(this.REQUESTS_KEY, JSON.stringify(requests));

        // MOCK EMAIL SENDING TO PUBLISHER
        this.mockSendEmailToPublisher(request);

        return { success: true, request };
    },

    /**
     * Accept a request
     */
    acceptRequest(token) {
        const requests = this.getAllRequests();
        const reqIndex = requests.findIndex(r => r.id === token);

        if (reqIndex === -1) return { success: false, error: 'Solicitud no encontrada.' };

        if (requests[reqIndex].status !== 'PENDING') {
            return { success: false, error: 'Esta solicitud ya ha sido procesada.' };
        }

        requests[reqIndex].status = 'ACCEPTED';
        requests[reqIndex].acceptedAt = new Date().toISOString();
        localStorage.setItem(this.REQUESTS_KEY, JSON.stringify(requests));

        // MOCK EMAIL SENDING TO APPLICANT
        // We need the job details to send the contact info. In a real app we'd fetch it.
        // Here we rely on the App.getJobs() or pass it in. 
        // For simplicity, we just trigger the mock alert.
        const jobs = JSON.parse(localStorage.getItem('clasehoy_jobs') || '[]');
        const job = jobs.find(j => j.id === requests[reqIndex].jobId);

        this.mockSendEmailToApplicant(requests[reqIndex], job);

        return { success: true };
    },

    /**
     * Reject a request
     */
    rejectRequest(token) {
        const requests = this.getAllRequests();
        const reqIndex = requests.findIndex(r => r.id === token);

        if (reqIndex === -1) return { success: false, error: 'Solicitud no encontrada.' };

        requests[reqIndex].status = 'REJECTED';
        localStorage.setItem(this.REQUESTS_KEY, JSON.stringify(requests));

        return { success: true };
    },

    getRequest(token) {
        return this.getAllRequests().find(r => r.id === token);
    },

    generateToken() {
        return 'req_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    },

    // --- MOCKS ---

    mockSendEmailToPublisher(request) {
        console.log(`[EMAIL MOCK] To: ${request.publisherEmail}`);
        console.log(`Subject: Solicitud de contacto por tu aviso "${request.jobTitle}"`);
        console.log(`Body: Hola, un docente está interesado. Para aceptar o rechazar, haz clic aquí:`);

        // This URL would be in the email
        const url = `${window.location.origin}${window.location.pathname.replace('index.html', '')}contact-flow.html?token=${request.id}`;

        console.log(`LINK: ${url}`);

        alert(`(Simulación de Email)\n\nCorreo enviado al publicador (${request.publisherEmail}).\n\nRevisa la CONSOLA (F12) para ver el LINK de aceptación.`);
    },

    mockSendEmailToApplicant(request, job) {
        console.log(`[EMAIL MOCK] To: ${request.applicantEmail}`);
        console.log(`Subject: ¡Tu contacto fue aceptado!`);
        console.log(`Body: El publicador ha aceptado conversar. Contacta aquí:`);

        const url = `${window.location.origin}${window.location.pathname.replace('contact-flow.html', '')}contact-flow.html?view_contact=${request.id}`;
        console.log(`LINK: ${url}`);

        alert(`(Simulación de Email)\n\nCorreo enviado al postulante (${request.applicantEmail}).\n\nRevisa la CONSOLA (F12) para ver el LINK para contactar por WhatsApp.`);
    }
};

ContactService.init();
