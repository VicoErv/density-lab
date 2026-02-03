/**
 * Core diffusion process utilities
 * Implements forward and reverse diffusion for 2D point clouds
 */

/**
 * Generate linear beta schedule
 * @param {number} T - Total timesteps
 * @param {number} beta_start - Starting beta value
 * @param {number} beta_end - Ending beta value
 * @returns {Float32Array} Beta values for each timestep
 */
export function generateBetaSchedule(T = 1000, beta_start = 0.0001, beta_end = 0.02) {
    const betas = new Float32Array(T);
    for (let t = 0; t < T; t++) {
        betas[t] = beta_start + (beta_end - beta_start) * (t / (T - 1));
    }
    return betas;
}

/**
 * Compute alpha and alpha_bar from betas
 * @param {Float32Array} betas - Beta schedule
 * @returns {{alphas: Float32Array, alpha_bars: Float32Array}}
 */
export function computeAlphas(betas) {
    const T = betas.length;
    const alphas = new Float32Array(T);
    const alpha_bars = new Float32Array(T);

    let alpha_bar_product = 1.0;

    for (let t = 0; t < T; t++) {
        alphas[t] = 1.0 - betas[t];
        alpha_bar_product *= alphas[t];
        alpha_bars[t] = alpha_bar_product;
    }

    return { alphas, alpha_bars };
}

/**
 * Forward diffusion: add noise to clean data
 * q(x_t | x_0) = N(sqrt(alpha_bar_t) * x_0, (1 - alpha_bar_t) * I)
 * 
 * @param {Array<{x: number, y: number}>} x0 - Clean points
 * @param {number} t - Timestep
 * @param {Float32Array} alpha_bars - Precomputed alpha_bar values
 * @returns {Array<{x: number, y: number}>} Noisy points at timestep t
 */
export function forwardDiffusion(x0, t, alpha_bars) {
    const alpha_bar_t = alpha_bars[t];
    const sqrt_alpha_bar = Math.sqrt(alpha_bar_t);
    const sqrt_one_minus_alpha_bar = Math.sqrt(1.0 - alpha_bar_t);

    return x0.map(point => {
        // Sample noise from N(0, 1)
        const noise_x = gaussianRandom();
        const noise_y = gaussianRandom();

        return {
            x: sqrt_alpha_bar * point.x + sqrt_one_minus_alpha_bar * noise_x,
            y: sqrt_alpha_bar * point.y + sqrt_one_minus_alpha_bar * noise_y
        };
    });
}

/**
 * Generate Gaussian random number using Box-Muller transform
 * @returns {number} Sample from N(0, 1)
 */
function gaussianRandom() {
    let u1 = 0, u2 = 0;
    while (u1 === 0) u1 = Math.random();
    while (u2 === 0) u2 = Math.random();
    return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
}

/**
 * Generate complete diffusion trajectory from x0 to pure noise
 * @param {Array<{x: number, y: number}>} x0 - Clean points
 * @param {number} T - Total timesteps
 * @param {number} snapshotInterval - Save every N timesteps
 * @returns {Array<{t: number, points: Array}>} Trajectory snapshots
 */
export function generateTrajectory(x0, T = 1000, snapshotInterval = 10) {
    const betas = generateBetaSchedule(T);
    const { alpha_bars } = computeAlphas(betas);

    const trajectory = [];

    // Always include t=0 (clean data)
    trajectory.push({ t: 0, points: x0 });

    // Generate snapshots at intervals
    for (let t = snapshotInterval; t <= T; t += snapshotInterval) {
        const noisy_points = forwardDiffusion(x0, t - 1, alpha_bars);
        trajectory.push({ t, points: noisy_points });
    }

    // Ensure we have the final timestep
    if (trajectory[trajectory.length - 1].t !== T) {
        const final_points = forwardDiffusion(x0, T - 1, alpha_bars);
        trajectory.push({ t: T, points: final_points });
    }

    return trajectory;
}

/**
 * Reverse diffusion: denoise points (simplified version without model)
 * For pre-computed trajectories, we just interpolate between snapshots
 * 
 * @param {Array} trajectory - Pre-computed forward trajectory
 * @param {number} t - Current timestep
 * @returns {Array<{x: number, y: number}>} Points at timestep t
 */
export function getPointsAtTimestep(trajectory, t) {
    // Find closest snapshot
    let closest = trajectory[0];
    let minDiff = Math.abs(trajectory[0].t - t);

    for (const snapshot of trajectory) {
        const diff = Math.abs(snapshot.t - t);
        if (diff < minDiff) {
            minDiff = diff;
            closest = snapshot;
        }
    }

    return closest.points;
}
