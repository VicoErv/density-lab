import React, { useState } from 'react';
import { Activity, BarChart, AreaChart, Target, Layers, Info, Wind, Database, Zap, RefreshCw } from 'lucide-react';
import Gaussian1D from './labs/Gaussian1D';
import SamplingConvergence from './labs/SamplingConvergence';
import CDFIntegration from './labs/CDFIntegration';
import LikelihoodScorer from './labs/LikelihoodScorer';
import Multivariate2D from './labs/Multivariate2D';
import ScoreMatching from './labs/ScoreMatching';
import PseudoLikelihood from './labs/PseudoLikelihood';
import ForwardDiffusion from './labs/ForwardDiffusion';

function App() {
  const [activeTab, setActiveTab] = useState('gaussian');

  return (
    <div className="app-container">
      <header className="animate-fade-in">
        <h1>Density Lab</h1>
        <p>Interactive explorations of the Gaussian Distribution & Score Functions</p>
      </header>

      <nav className="tabs-container animate-fade-in">
        <button
          className={`tab-button ${activeTab === 'gaussian' ? 'active' : ''}`}
          onClick={() => setActiveTab('gaussian')}
        >
          Gaussian Foundations
        </button>
        <button
          className={`tab-button ${activeTab === 'score' ? 'active' : ''}`}
          onClick={() => setActiveTab('score')}
        >
          Score-based Modeling
        </button>
      </nav>

      <div className="tab-content">
        {activeTab === 'gaussian' && (
          <div className="lab-grid fade-in">
            <LabCard
              title="The First Mental Shift"
              description="Density is height, Probability is area. Watch how µ and σ reshape the curve while maintaining total area."
              icon={<Activity size={24} color="var(--accent-primary)" />}
            >
              <Gaussian1D />
            </LabCard>

            <LabCard
              title="Sampling Convergence"
              description="Density is what sampling frequency becomes in the limit. Watch N random samples form the curve."
              icon={<BarChart size={24} color="var(--accent-secondary)" />}
            >
              <SamplingConvergence />
            </LabCard>

            <LabCard
              title="CDF & Area"
              description="Observe probability through the Cumulative Distribution Function. Area under the curve is probability."
              icon={<AreaChart size={24} color="var(--accent-success)" />}
            >
              <CDFIntegration />
            </LabCard>

            <LabCard
              title="Likelihood Scoring"
              description="Drag the point to see its likelihood score. This is how anomaly detection works in practice."
              icon={<Target size={24} color="var(--accent-warning)" />}
            >
              <LikelihoodScorer />
            </LabCard>

            <LabCard
              title="Multivariate Contours"
              description="In 2D, density becomes hills and equal-density becomes ellipses. Experience covariance as geometry."
              icon={<Layers size={24} color="#a855f7" />}
            >
              <Multivariate2D />
            </LabCard>

            <section className="card info-card">
              <div className="card-title">
                <Info size={24} color="var(--text-secondary)" />
                Key Insights
              </div>
              <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.25rem', fontSize: '0.9rem' }}>
                <li><b>µ (Mu)</b> controls location / center.</li>
                <li><b>σ (Sigma)</b> controls spread / uncertainty.</li>
                <li>Low σ = Spike (Almost deterministic)</li>
                <li>High σ = Flat (Almost no information)</li>
              </ul>
            </section>
          </div>
        )}

        {activeTab === 'score' && (
          <div className="lab-grid fade-in">
            <LabCard
              title="Score Matching"
              description="The Score Function ∇log p(x) acts as a force field pointing toward the mode. The foundation of Diffusion Models."
              icon={<Wind size={24} color="#f472b6" />}
            >
              <ScoreMatching />
            </LabCard>

            <LabCard
              title="Pseudo-Likelihood"
              description="Maximizing the product of marginal conditionals (Besag, 1974) to estimate parameters without the joint constant."
              icon={<Zap size={24} color="#3b82f6" />}
            >
              <PseudoLikelihood />
            </LabCard>

            <LabCard
              title="Forward Diffusion"
              description="Watch structured data dissolve into pure Gaussian noise. The 'Forward Process' of Diffusion Models."
              icon={<RefreshCw size={24} color="#06b6d4" />}
            >
              <ForwardDiffusion />
            </LabCard>

            <LabCard
              title="Next Visualization Data"
              description="Placeholder for upcoming data manifold and diffusion path visualizations."
              icon={<Database size={24} color="var(--text-secondary)" />}
            >
              <div style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontStyle: 'italic'
              }}>
                [ Coming Soon: Data Manifold Visualizer ]
              </div>
            </LabCard>
          </div>
        )}
      </div>
    </div>
  );
}

function LabCard({ title, description, icon, children }) {
  return (
    <div className="card animate-fade-in">
      <div className="card-title">
        {icon}
        {title}
      </div>
      <p className="card-description">{description}</p>
      <div className="visual-container">
        {children}
      </div>
    </div>
  );
}

export default App;
