export default function FailLogin() {
  return (
    <div className="center-item">
      <h1>SORRY, GO BACK WITH AN UMASS EMAIL.</h1>
      HijackUMass is open to UMass students only.
      <a href="http://localhost:3000/auth/google">
        <button>Sign in with UMass Email</button>
      </a>
    </div>
  );
}
