'use server'

export async function getFlightData(flightNumber) {
    const apiKey = process.env.AVIATIONSTACK_API_KEY;
    if (!apiKey || apiKey === 'REPLACE_WITH_YOUR_KEY') {
        return { error: 'API Configuration Error: Missing API Key' };
    }

    try {
        const res = await fetch(`http://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${flightNumber}`);

        if (!res.ok) {
            throw new Error(`API responded with status ${res.status}`);
        }

        const data = await res.json();

        if (!data.data || data.data.length === 0) {
            return [];
        }

        // Map the external API format to our internal component format
        return data.data.map(flight => ({
            flightNumber: flight.flight.iata,
            startTime: flight.departure.scheduled,
            endTime: flight.arrival.scheduled,
            timeZoneStart: flight.departure.timezone,
            timeZoneEnd: flight.arrival.timezone,
            startLocation: `${flight.departure.iata} - ${flight.departure.airport}`,
            endLocation: `${flight.arrival.iata} - ${flight.arrival.airport}`,
            status: flight.flight_status.charAt(0).toUpperCase() + flight.flight_status.slice(1) // Capitalize
        }));

    } catch (error) {
        console.error('Flight API Error:', error);
        return { error: 'Failed to fetch flight data. Please try again.' };
    }
}
