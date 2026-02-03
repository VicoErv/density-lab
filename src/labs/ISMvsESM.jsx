import React, { useState, useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    LineController
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    LineController
);

const ISMvsESM = () => {
    const [theta, setTheta] = useState(1.0); // Shift parameter for model score
    const [phi, setPhi] = useState(1.0);     // Scale parameter for model score

    const mu_true = 0;
    const sigma_true = 1.0;

    const data = useMemo(() => {
        const labels = [];
        const trueScore = [];
        const modelScore = [];
        const esmIntegrand = [];
        const ismIntegrand = [];

        let totalESM = 0;
        let totalISM = 0;
        const dx = 0.1;

        for (let x = -5; x <= 5; x += dx) {
            labels.push(x.toFixed(1));

            const q_x = (1 / (sigma_true * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(x - mu_true, 2) / (2 * Math.pow(sigma_true, 2)));

            // True score s(x) = -(x - mu)/sigma^2
            const s_true = -(x - mu_true) / Math.pow(sigma_true, 2);
            trueScore.push(s_true);

            // Model score psi(x; theta, phi) = -phi * (x - theta)
            const psi = -phi * (x - theta);
            modelScore.push(psi);

            // ESM Integrand: 1/2 * q(x) * (psi - s_true)^2
            const esm = 0.5 * q_x * Math.pow(psi - s_true, 2);
            esmIntegrand.push(esm);
            totalESM += esm * dx;

            // ISM Integrand: q(x) * (1/2 * psi^2 + psi')
            // psi' = -phi
            const ism = q_x * (0.5 * Math.pow(psi, 2) - phi);
            ismIntegrand.push(ism);
            totalISM += ism * dx;
        }

        return { labels, trueScore, modelScore, totalESM, totalISM };
    }, [theta, phi]);

    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Model Score ψ(x;θ)',
                data: data.modelScore,
                borderColor: '#f472b6',
                borderWidth: 2,
                pointRadius: 0,
            },
            {
                label: 'True Score ∇log q(x)',
                data: data.trueScore,
                borderColor: 'rgba(255, 255, 255, 0.4)',
                borderWidth: 1.5,
                borderDash: [5, 5],
                pointRadius: 0,
            }
        ]
    };

    return (
        <div style={{ height: '100%', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, minHeight: 0 }}>
                <Line data={chartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top', labels: { color: '#94a3b8', boxWidth: 10 } } },
                    scales: {
                        y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                        x: { ticks: { color: '#94a3b8' } }
                    }
                }} />
            </div>

            <div className="controls" style={{ marginTop: '1rem' }}>
                <div className="control-group">
                    <label className="control-label">Model Shift (θ) <span className="control-value">{theta.toFixed(1)}</span></label>
                    <input type="range" min="-3" max="3" step="0.1" value={theta} onChange={(e) => setTheta(parseFloat(e.target.value))} />
                </div>
                <div className="control-group">
                    <label className="control-label">Model Slope (φ) <span className="control-value">{phi.toFixed(1)}</span></label>
                    <input type="range" min="0.1" max="3" step="0.1" value={phi} onChange={(e) => setPhi(parseFloat(e.target.value))} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <div style={{ background: 'rgba(244, 114, 182, 0.1)', padding: '0.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>ESM Objective</div>
                        <div style={{ fontWeight: 800, color: '#f472b6' }}>{data.totalESM.toFixed(4)}</div>
                    </div>
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>ISM (Score Matching)</div>
                        <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{(data.totalISM + 0.5).toFixed(4)}*</div>
                    </div>
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.4rem', fontStyle: 'italic', textAlign: 'center' }}>
                    *Note: ESM = ISM + C. Watch them move together as you minimize the loss!
                </div>
            </div>
        </div>
    );
};

export default ISMvsESM;
