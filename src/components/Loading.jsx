function Loading({ message = "Loading..." }) {
  return (
    // Reusable loading UI so pages do not all have to reinvent their own fetch
    // state markup.
    <div className="status-card loading-card" role="status" aria-live="polite">
      <div className="loading-spinner" aria-hidden="true"></div>
      <p>{message}</p>
    </div>
  );
}

export default Loading;