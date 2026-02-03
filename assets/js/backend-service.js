/**
 * ClaseHoy - Backend Service (Firestore)
 * Handles data fetching/saving from Firebase
 */

const BackendService = {
    // Legacy URL for reference (unused now)
    GOOGLE_SCRIPT_URL: '',

    /**
     * Fetch all jobs from Firestore
     */
    async fetchJobs() {
        try {
            const snapshot = await db.collection('jobs')
                .orderBy('timestamp', 'desc')
                .limit(50)
                .get();

            const jobs = [];
            snapshot.forEach(doc => {
                jobs.push(doc.data());
            });

            console.log(`Fetched ${jobs.length} jobs from Firestore`);
            return jobs;

        } catch (error) {
            console.error('Error fetching jobs from Firestore:', error);
            return [];
        }
    },

    /**
     * Save a job to Firestore
     */
    async saveRemoteJob(job) {
        try {
            // Use job.id as document ID
            await db.collection('jobs').doc(job.id).set(job);
            console.log('Job saved to Firestore:', job.id);
            return true;
        } catch (error) {
            console.error('Error saving job to Firestore:', error);
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
    },

    /**
     * Sync Jobs (Now simpler: Remote IS the source of truth)
     * We just return remote jobs. We can merge with local if we want offline support.
     */
    async syncJobs(localJobs) {
        const remoteJobs = await this.fetchJobs();
        return remoteJobs; // For now, trust Cloud fully.
    }
};
