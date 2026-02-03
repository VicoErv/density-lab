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

const PseudoLikelihood = () => {
    const [rho, setRho] = useState(0.5);
    const [obs, setObs] = useState({ x1: 1.0, x2: 0.8 });
    const mu = 0;
    const sigma = 1;

    // Conditional p(x1 | x2) = N(mu1 + rho(x2 - mu2), (1 - rho^2)sigma^2)
    const conditionalX1 = useMemo(() => {
        const muCond = mu + rho * (obs.x2 - mu);
        const varCond = (1 - rho * rho) * (sigma * sigma);
        const sigmaCond = Math.sqrt(varCond);

        const labels = [];
        const values = [];
        for (let x = -4; x <= 4; x += 0.1) {
            labels.push(x.toFixed(1));
            const exp = -Math.pow(x - muCond, 2) / (2 * varCond);
            values.push((1 / (sigmaCond * Math.sqrt(2 * Math.PI))) * Math.exp(exp));
        }
        return { labels, values, muCond, sigmaCond };
    }, [rho, obs.x2]);

    // Conditional p(x2 | x1)
    const conditionalX2 = useMemo(() => {
        const muCond = mu + rho * (obs.x1 - mu);
        const varCond = (1 - rho * rho) * (sigma * sigma);
        const sigmaCond = Math.sqrt(varCond);

        const values = [];
        for (let x = -4; x <= 4; x += 0.1) {
            const exp = -Math.pow(x - muCond, 2) / (2 * varCond);
            values.push((1 / (sigmaCond * Math.sqrt(2 * Math.PI))) * Math.exp(exp));
        }
        return { values, muCond, sigmaCond };
    }, [rho, obs.x1]);

    const pseudoLikelihood = useMemo(() => {
        const p1 = (1 / (conditionalX1.sigmaCond * Math.sqrt(2 * Math.PI))) *
            Math.exp(-Math.pow(obs.x1 - conditionalX1.muCond, 2) / (2 * Math.pow(conditionalX1.sigmaCond, 2)));
        const p2 = (1 / (conditionalX2.sigmaCond * Math.sqrt(2 * Math.PI))) *
            Math.exp(-Math.pow(obs.x2 - conditionalX2.muCond, 2) / (2 * Math.pow(conditionalX2.sigmaCond, 2)));
        return p1 * p2;
    }, [obs, rho, conditionalX1, conditionalX2]);

    const chartData = {
        labels: conditionalX1.labels,
        datasets: [
            {
                label: 'p(x₁ | x₂)',
                data: conditionalX1.values,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                pointRadius: 0,
                tension: 0.4
            },
            {
                label: 'p(x₂ | x₁)',
                data: conditionalX2.values,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                pointRadius: 0,
                tension: 0.4
            }
        ]
    };

    return (
        <div style={{ height: '100%', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, minHeight: 0 }}>
                <Line data={chartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: { color: '#94a3b8', boxWidth: 10, font: { size: 10 } }
                        },
                        tooltip: { enabled: false }
                    },
                    scales: {
                        y: { min: 0, max: 1.5, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                        x: { ticks: { color: '#94a3b8' } }
                    }
                }} />
            </div>

            <div className="controls" style={{ marginTop: '1rem' }}>
                <div className="control-group">
                    <label className="control-label">
                        Model Parameter (ρ) <span className="control-value">{rho.toFixed(2)}</span>
                    </label>
                    <input
                        type="range" min="-0.95" max="0.95" step="0.01" value={rho}
                        onChange={(e) => setRho(parseFloat(e.target.value))}
                        style={{ accentColor: 'var(--accent-primary)' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div className="control-group">
                        <label className="control-label">x₁ <span className="control-value">{obs.x1.toFixed(1)}</span></label>
                        <input type="range" min="-3" max="3" step="0.1" value={obs.x1}
                            onChange={(e) => setObs({ ...obs, x1: parseFloat(e.target.value) })} />
                    </div>
                    <div className="control-group">
                        <label className="control-label">x₂ <span className="control-value">{obs.x2.toFixed(1)}</span></label>
                        <input type="range" min="-3" max="3" step="0.1" value={obs.x2}
                            onChange={(e) => setObs({ ...obs, x2: parseFloat(e.target.value) })} />
                    </div>
                </div>

                <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    padding: '0.6rem',
                    borderRadius: '0.5rem',
                    marginTop: '0.5rem',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Pseudo-Likelihood Product:</div>
                    <div style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '1.2rem' }}>
                        {pseudoLikelihood.toFixed(4)}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Maximize this to find the optimal ρ
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PseudoLikelihood;
