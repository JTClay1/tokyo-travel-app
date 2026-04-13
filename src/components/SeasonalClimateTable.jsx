function SeasonalClimateTable() {
  const seasons = [
    {
      season: "Winter",
      months: "Dec - Feb",
      highC: "10 - 12°C",
      lowC: "1 - 4°C",
      highF: "50 - 54°F",
      lowF: "34 - 39°F",
      notes: "Cool and dry. Bring a coat, especially for mornings and nights.",
    },
    {
      season: "Spring",
      months: "Mar - May",
      highC: "14 - 24°C",
      lowC: "5 - 15°C",
      highF: "57 - 75°F",
      lowF: "41 - 59°F",
      notes: "Mild and comfortable. Great walking weather.",
    },
    {
      season: "Summer",
      months: "Jun - Aug",
      highC: "26 - 31°C",
      lowC: "19 - 24°C",
      highF: "79 - 88°F",
      lowF: "66 - 75°F",
      notes: "Hot, humid, and sometimes rainy. Light clothes help.",
    },
    {
      season: "Autumn",
      months: "Sep - Nov",
      highC: "17 - 28°C",
      lowC: "9 - 20°C",
      highF: "63 - 82°F",
      lowF: "48 - 68°F",
      notes: "Comfortable overall, with cooler nights later in the season.",
    },
  ];

  return (
    <div className="season-table-wrapper">
      <h3>What to Expect by Season</h3>
      <p className="season-table-intro">
        These are rough seasonal averages to help travelers plan farther ahead.
      </p>

      <table className="season-table">
        <thead>
          <tr>
            <th>Season</th>
            <th>Months</th>
            <th>Avg High</th>
            <th>Avg Low</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {seasons.map((season) => (
            <tr key={season.season}>
              <td>{season.season}</td>
              <td>{season.months}</td>
              <td>
                {season.highC}
                <br />
                <span>{season.highF}</span>
              </td>
              <td>
                {season.lowC}
                <br />
                <span>{season.lowF}</span>
              </td>
              <td>{season.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SeasonalClimateTable;