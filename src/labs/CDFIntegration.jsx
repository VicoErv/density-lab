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
    Legend
);

const CDFIntegration = () => {
    const [range, setRange] = useState([-1.0, 1.0]);
    const mu = 0;
    const sigma = 1;

    // Error function approximation for CDF
    const erf = (x) => {
        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const p = 0.3275911;
        const sign = x < 0 ? -1 : 1;
        x = Math.abs(x);
        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
        return sign * y;
    };

    const cdf = (x) => 0.5 * (1 + erf((x - mu) / (sigma * Math.sqrt(2))));

    const prob = useMemo(() => {
        return cdf(range[1]) - cdf(range[0]);
    }, [range]);

    const chartData = useMemo(() => {
        const labels = [];
        const values = [];
        const selection = [];

        for (let x = -4; x <= 4; x += 0.1) {
            labels.push(x.toFixed(1));
            const exponent = -Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2));
            const y = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
            values.push(y);

            if (x >= range[0] && x <= range[1]) {
                selection.push(y);
            } else {
                selection.push(null);
            }
        }

        return {
            labels,
            datasets: [
                {
                    label: 'Shaded Area',
                    data: selection,
                    backgroundColor: 'rgba(16, 185, 129, 0.5)',
                    fill: true,
                    pointRadius: 0,
                    borderWidth: 0,
                    tension: 0.4
                },
                {
                    label: 'Density p(x)',
                    data: values,
                    borderColor: '#e2e8f0',
                    borderWidth: 1.5,
                    pointRadius: 0,
                    fill: false,
                    tension: 0.4
                }
            ],
        };
    }, [range]);

    return (
        <div style={{ height: '100%', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, minHeight: 0 }}>
                <Line data={chartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { enabled: false } },
                    scales: {
                        y: { min: 0, max: 0.5, ticks: { color: '#94a3b8' } },
                        x: { ticks: { color: '#94a3b8' } }
                    }
                }} />
            </div>
            <div className="controls" style={{ marginTop: '1rem' }}>
                <div className="control-group">
                    <label className="control-label">
                        Interval [a, b] <span className="control-value">[{range[0].toFixed(1)}, {range[1].toFixed(1)}]</span>
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="range" min="-4" max="4" step="0.1" value={range[0]}
                            onChange={(e) => setRange([Math.min(parseFloat(e.target.value), range[1]), range[1]])}
                            style={{ accentColor: 'var(--accent-success)' }}
                        />
                        <input
                            type="range" min="-4" max="4" step="0.1" value={range[1]}
                            onChange={(e) => setRange([range[0], Math.max(parseFloat(e.target.value), range[0])])}
                            style={{ accentColor: 'var(--accent-success)' }}
                        />
                    </div>
                </div>
                <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    color: 'var(--accent-success)',
                    fontWeight: 700
                }}>
                    P({range[0].toFixed(1)} ≤ X ≤ {range[1].toFixed(1)}) = {prob.toFixed(4)}
                </div>
            </div>
        </div>
    );
};

export default CDFIntegration;
