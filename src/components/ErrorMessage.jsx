function ErrorMessage({ message = "Something went wrong." }) {
  return (
    // Same idea as Loading: one shared error component keeps feedback
    // consistent across the app.
    <div className="status-card error-card" role="alert">
      <h3 className="status-card-title">Something went wrong</h3>
      <p>{message}</p>
    </div>
  );
}

export default ErrorMessage;