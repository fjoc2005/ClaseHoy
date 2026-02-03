/**
 * ClaseHoy - Backend Service
 * Handles data fetching from "Cloud" (Static JSON or Google Script)
 */

const BackendService = {
    // URL to the raw JSON file in GitHub (acts as "Cloud User Database")
    // If the user updates this file in the repo, all devices will see it!
    STATIC_DB_URL: 'assets/data/jobs.json',

    // Optional: Google Script Web App URL (if deployed)
    GOOGLE_SCRIPT_URL: '',

    async fetchJobs() {
        try {
            // 1. Try Google Script first if configured
            if (this.GOOGLE_SCRIPT_URL) {
                const response = await fetch(this.GOOGLE_SCRIPT_URL + '?action=getJobs');
                if (response.ok) {
                    const data = await response.json();
                    return data.jobs || [];
                }
            }

            // 2. Fallback to Static GitHub JSON (The "Seed")
            // In a real deployed environment, this fetches from the server
            const response = await fetch(this.STATIC_DB_URL);
            if (response.ok) {
                const data = await response.json();
                return data || [];
            }
        } catch (error) {
            console.error('Error fetching remote jobs:', error);
        }
        return [];
    },

    /**
     * Merge remote jobs with local jobs
     * Remote jobs take precedence if IDs match (updates)
     */
    async syncJobs(localJobs) {
        const remoteJobs = await this.fetchJobs();

        // Create a map of local jobs
        const jobMap = new Map();
        localJobs.forEach(j => jobMap.set(j.id, j));

        // Merge remote jobs
        remoteJobs.forEach(j => {
            // Only add if it doesn't exist locally OR if we want to overwrite
            // For this MVP, we'll assume remote is "master" for those IDs
            jobMap.set(j.id, { ...j, isRemote: true });
        });

        return Array.from(jobMap.values())
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
};
