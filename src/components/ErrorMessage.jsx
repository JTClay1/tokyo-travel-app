function ErrorMessage({ message = "Something went wrong." }) {
  return (
    <div className="status-card error-card" role="alert">
      <h3 className="status-card-title">Something went wrong</h3>
      <p>{message}</p>
    </div>
  );
}

export default ErrorMessage;