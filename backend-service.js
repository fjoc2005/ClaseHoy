/**
 * ClaseHoy - Backend Service (Firestore)
 * Handles data fetching/saving from Firebase
 */

const BackendService = {
    // Legacy URL (unused now)
    GOOGLE_SCRIPT_URL: '',

    unsubscribe: null, // To store the listener unsubscribe function

    /**
     * Listen to jobs in real-time
     * @param {Function} callback - Function to call with the updated job list
     */
    listenJobs(callback) {
        // Unsubscribe from previous listener if exists
        if (this.unsubscribe) {
            this.unsubscribe();
        }

        const now = firebase.firestore.Timestamp.now();

        // Query: active jobs (expiresAt > now), ordered by expiration time
        this.unsubscribe = db.collection('jobs')
            .where('expiresAt', '>', now)
            .orderBy('expiresAt', 'desc')
            .onSnapshot(snapshot => {
                const jobs = [];
                snapshot.forEach(doc => {
                    // Combine ID with data
                    jobs.push({ id: doc.id, ...doc.data() });
                });

                console.log(`Real-time update: ${jobs.length} active jobs`);
                callback(jobs);
            }, error => {
                console.error("Firestore listener error:", error);

                // Permission denied often happens if rules are strict. 
                // In production, ensure rules allow reading where expiresAt > now.
            });
    },

    /**
     * Stop the real-time listener
     */
    stopListening() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    },

    /**
     * Save a job to Firestore with 24h expiration
     */
    async saveRemoteJob(jobData) {
        try {
            const now = firebase.firestore.Timestamp.now();
            const expiresAt = firebase.firestore.Timestamp.fromMillis(
                now.toMillis() + (24 * 60 * 60 * 1000) // +24 hours
            );

            // Clean data for Firestore
            // ensuring we don't accidentally send undefined/null where not expected
            const payload = {
                title: jobData.position, // Mapping position -> title if needed, but keeping position for consistency with app
                position: jobData.position,
                institution: jobData.institution,
                region: jobData.region,
                comuna: jobData.comuna || '',
                contact: jobData.contact,
                urgency: jobData.urgency,
                postedBy: jobData.postedBy,
                createdAt: now,
                expiresAt: expiresAt,

                // Legacy fields validation
                timestamp: now.toDate().toISOString() // Keep for backward compat if UI uses it
            };

            // Let Firestore generate the ID
            await db.collection('jobs').add(payload);
            console.log('Job saved to Firestore with auto-ID');
            return true;
        } catch (error) {
            console.error('Error saving job to Firestore:', error);
            alert('Error al publicar: ' + error.message);
            return false;
        }
    },

    /**
     * Delete a job from Firestore
     */
    async deleteJob(jobId) {
        try {
            await db.collection('jobs').doc(jobId).delete();
            console.log('Job deleted from Firestore:', jobId);
            return true;
        } catch (error) {
            console.error('Error deleting job:', error);
            return false;
        }
    }
};
