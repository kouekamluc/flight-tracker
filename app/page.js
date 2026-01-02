
import FlightSearch from '@/components/FlightSearch';

export default function Home() {
  return (
    <main className="main">
      <div className="content">
        <h1 className="title">Flight Tracker</h1>
        <p className="subtitle">Real-time status & airport information</p>
        <FlightSearch />
      </div>
    </main>
  );
}
