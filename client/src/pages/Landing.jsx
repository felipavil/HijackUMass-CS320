import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="center-item" style={{ padding: '3rem' }}>
      <h1>Welcome to Hijack UMass</h1>
      <p className="small-font" style={{ maxWidth: '600px', textAlign: 'center' }}>
        A secure, UMass-only rideshare platform. View current ride offers, request rides, or post your own trip.
      </p>

      <div className="flex-container" style={{ gap: '1.5rem', marginTop: '2rem' }}>
        <Link to="/drivers" className="white-button square-button">View Drivers</Link>
        <Link to="/riders" className="white-button square-button">View Riders</Link>
        <Link to="/create" className="white-button square-button">Create a Post</Link>
      </div>
    </div>
  );
}

export default Landing;
