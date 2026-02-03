# Density Lab: Interactive Gaussian Visualizer

![Density Lab Hero](https://raw.githubusercontent.com/VicoErv/density-lab/main/image.png)

A premium, interactive web application designed to build a deep intuition for continuous probability distributions, specifically the Gaussian (Normal) distribution.

## 🌟 Features

### 1. The First Mental Shift
- **Intuition**: Density ≠ Probability.
- **Interactive**: Sliders for $\mu$ (mean) and $\sigma$ (standard deviation) show how the "height" (density) changes while the "area" (probability) remains 1.

### 2. Sampling Convergence
- **Intuition**: Density is what sampling frequency becomes in the limit.
- **Interactive**: Generate random samples in real-time and watch the histogram converge to the theoretical PDF ($p(x)$).

### 3. CDF & Area Highlighting
- **Intuition**: $P(a \leq X \leq b) = \int_{a}^{b} p(x) dx$.
- **Interactive**: Drag interval boundaries and see the shaded area calculate the cumulative probability.

### 4. Likelihood Scoring
- **Intuition**: Density as a "Normality Score".
- **Interactive**: Drag a point along the axis to see its likelihood. Highlights how anomaly detection is mathematically grounded in density values.

### 5. Multivariate Gaussian (2D)
- **Intuition**: Covariance is Geometry.
- **Interactive**: Adjust correlation ($\rho$) and observe how the density "hills" tilt and stretch into ellipses.

### 6. Score Function & Matching
- **Intuition**: $s(x) = \nabla \log p(x)$ points to the peak.
- **Interactive**: Watch the "score field" (vector arrows) pull points toward the data mode. Essential for understanding Diffusion Models and Energy-Based Models.

### 7. Pseudo-Likelihood (Besag, 1974)
- **Intuition**: Maximize individual conditional likelihoods $p(x_i | x_{-i})$ instead of the full joint.
- **Interactive**: Observe conditional Gaussian slices and watch the product reach its max at the true parameter value. Efficient for models with intractable normalizers.

### 8. Forward Diffusion
- **Intuition**: Structured patterns dissolve into Gaussian noise.
- **Interactive**: Corrupt a "data manifold" with increasing $\sigma$ levels to visualize the forward process used in SDE and Diffusion models.

### 9. ISM vs ESM Identity
- **Intuition**: $J_{ESM}(\theta) = J_{ISM}(\theta) + C$.
- **Interactive**: Minimize the Implicit Score Matching objective without ever knowing the ground-truth density. Watch how matching the "divergence" of the score field is equivalent to matching the vectors.

## 🚀 Tech Stack
- **Framework**: React (Vite)
- **Styling**: Vanilla CSS (Modern design system, Dark Mode, Glassmorphism)
- **Plotting**: [Chart.js](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/)
- **Math**: Box-Muller transform for sampling, Error Function approximations for CDF.

## 🛠️ Getting Started

```bash
# Clone the repository
git clone https://github.com/VicoErv/density-lab.git

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📜 License
MIT
