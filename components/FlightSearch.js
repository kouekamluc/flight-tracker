"use client";

import { useState } from 'react';
import { getFlightData } from '@/app/actions';
import styles from './FlightSearch.module.css';

export default function FlightSearch() {
    const [flightNumber, setFlightNumber] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!flightNumber.trim()) return;

        setLoading(true);
        setError('');
        setResults(null);

        try {
            const data = await getFlightData(flightNumber);

            if (data.error) {
                setError(data.error);
            } else if (data.length > 0) {
                setResults(data);
            } else {
                setError('No flights found for this number.');
            }
        } catch (err) {
            setError('An error occurred while searching.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSearch} className={styles.form}>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        value={flightNumber}
                        onChange={(e) => setFlightNumber(e.target.value)}
                        placeholder="Enter Flight Number (e.g., AA123)"
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>

            {error && <div className={styles.error}>{error}</div>}

            {results && (
                <div className={styles.results}>
                    {results.map((flight, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.header}>
                                <span className={styles.flightNum}>{flight.flightNumber}</span>
                                <span className={`${styles.status} ${styles[flight.status.toLowerCase().replace(' ', '')]}`}>{flight.status}</span>
                            </div>

                            <div className={styles.route}>
                                <div className={styles.point}>
                                    <div className={styles.code}>{flight.startLocation.split(' - ')[0]}</div>
                                    <div className={styles.city}>{flight.startLocation.split(' - ')[1]}</div>
                                    <div className={styles.time}>
                                        {new Date(flight.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className={styles.timezone}>{flight.timeZoneStart}</div>
                                </div>

                                <div className={styles.duration}>
                                    <span className={styles.arrow}>→</span>
                                </div>

                                <div className={styles.point}>
                                    <div className={styles.code}>{flight.endLocation.split(' - ')[0]}</div>
                                    <div className={styles.city}>{flight.endLocation.split(' - ')[1]}</div>
                                    <div className={styles.time}>
                                        {new Date(flight.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className={styles.timezone}>{flight.timeZoneEnd}</div>
                                </div>
                            </div>

                            <div className={styles.dates}>
                                <div>{new Date(flight.startTime).toLocaleDateString()}</div>
                                <div>{new Date(flight.endTime).toLocaleDateString()}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
