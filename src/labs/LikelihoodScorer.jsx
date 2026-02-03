import React, { useState, useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    LineController,
    ScatterController
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    LineController,
    ScatterController
);

const LikelihoodScorer = () => {
    const [point, setPoint] = useState(1.5);
    const mu = 0;
    const sigma = 1;

    const likelihood = useMemo(() => {
        const exponent = -Math.pow(point - mu, 2) / (2 * Math.pow(sigma, 2));
        return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
    }, [point]);

    const chartData = useMemo(() => {
        const labels = [];
        const values = [];

        for (let x = -4; x <= 4; x += 0.1) {
            labels.push(x.toFixed(1));
            const exponent = -Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2));
            const y = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
            values.push(y);
        }

        return {
            labels,
            datasets: [
                {
                    label: 'Density p(x)',
                    data: values,
                    borderColor: '#e2e8f0',
                    borderWidth: 1.5,
                    pointRadius: 0,
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Observed Point',
                    data: [{ x: point.toFixed(1), y: likelihood }],
                    backgroundColor: likelihood > 0.1 ? '#f59e0b' : '#ef4444',
                    borderColor: '#ffffff',
                    pointRadius: 8,
                    pointHoverRadius: 10,
                    showLine: false,
                    type: 'scatter'
                }
            ],
        };
    }, [point, likelihood]);

    return (
        <div style={{ height: '100%', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, minHeight: 0 }}>
                <Line data={chartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { min: 0, max: 0.5, ticks: { color: '#94a3b8' } },
                        x: { ticks: { color: '#94a3b8' } }
                    }
                }} />
            </div>
            <div className="controls" style={{ marginTop: '1rem' }}>
                <div className="control-group">
                    <label className="control-label">
                        Observed x <span className="control-value">{point.toFixed(2)}</span>
                    </label>
                    <input
                        type="range" min="-4" max="4" step="0.05" value={point}
                        onChange={(e) => setPoint(parseFloat(e.target.value))}
                        style={{ accentColor: 'var(--accent-warning)' }}
                    />
                </div>
                <div style={{
                    background: likelihood > 0.1 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Likelihood p(x)</span>
                    <span style={{
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: likelihood > 0.1 ? 'var(--accent-warning)' : '#ef4444',
                        fontFamily: 'monospace'
                    }}>
                        {likelihood.toFixed(4)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LikelihoodScorer;
