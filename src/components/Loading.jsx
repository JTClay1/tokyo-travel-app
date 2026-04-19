function Loading({ message = "Loading..." }) {
  return (
    <div className="status-card loading-card" role="status" aria-live="polite">
      <div className="loading-spinner" aria-hidden="true"></div>
      <p>{message}</p>
    </div>
  );
}

export default Loading;