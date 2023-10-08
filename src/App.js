import React from "react";
import { AiFillPrinter } from "react-icons/ai";
import { Chart, registerables } from "chart.js";
import "./App.css";
import css from "./customStyle.module.css";
import { generateNormalizedGraphDataArray, generatePDF } from "./utils";
function App() {
  Chart.register(...registerables);
  const [loading, setLoading] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState("");
  const [error, setError] = React.useState(false);
  const handleClick = async () => {
    try {
      setLoading(true);
      setLoadingMessage("Fetching Crime data .....");
      setError(false);
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - 10;
      const resp = await fetch(
        `https://api.usa.gov/crime/fbi/cde/arrest/state/AK/all?from=${startYear}&to=${currentYear}&API_KEY=iiHnOKfno2Mgkt5AynpvPpUQTEyxE77jo1RU8PIv`
      );
      const data = await resp.json();
      const normalizedGraphDataArr = generateNormalizedGraphDataArray(
        data,
        setLoadingMessage
      );
      await generatePDF(normalizedGraphDataArr, setLoadingMessage);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setLoadingMessage("");
      console.log(err);
      setError(true);
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <button className={css.button} onClick={handleClick} disabled={loading}>
          {loading ? (
            "Loading..."
          ) : (
            <span>
              <AiFillPrinter className={css.printerIcon} />
              {"Print"}
            </span>
          )}
        </button>
        {error && (
          <p className={css.error}>Something went wrong, Please try again</p>
        )}
        {loading && <p className={css.loading}>{loadingMessage}</p>}
        <div className="bg"></div>

        <canvas style={{ display: "none" }} id="myChart"></canvas>
      </header>
      <span className={css.footer}>
        Created with ❤️ by{" "}
        <a
          className={css.link}
          href="https://www.okantroo.me/"
          rel="noreferrer"
          target="_blank"
        >
          OK
        </a>
      </span>
    </div>
  );
}

export default App;
