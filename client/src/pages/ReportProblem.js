import React, { useEffect, useState } from "react";
import ChartBlock from "./ChartBlock";

export default function Problem({ PY, svcOk }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${PY}/api/py/stats`).then(r=>r.json()).then(setStats).catch(()=>{});
  }, []);

  return (
    <div className="page">
      <div className="page-eyebrow">Section 1 of 4 — Problem Definition</div>
      <h1 className="page-title">India's Silent Emergency:<br/>Malnutrition at Scale</h1>
      <p className="page-intro">
        Despite being one of the world's fastest-growing economies, India remains home to the largest
        concentration of malnourished people on earth. Children under 5, pregnant women, and the elderly
        bear the greatest burden. This report uses real government survey data (NFHS) and a primary
        dataset of 50,000 participants to identify where the crisis is worst and who is most at risk.
      </p>

      {!svcOk && svcOk !== null && (
        <div className="offline-banner">
          ⚠ Python visualization service is offline. Charts will not load.
          Start it with: <code>cd python-service &amp;&amp; python app.py</code>
        </div>
      )}

      {/* Government fact pull-quotes */}
      <div className="section-label">Key Facts — Government of India Data (NFHS-5, 2019-21)</div>
      <div className="fact-row">
        <div className="fact-card red">
          <div className="fact-figure">35.5%</div>
          <div className="fact-text">Children under 5 in India are stunted — their height permanently below normal due to chronic malnutrition</div>
          <div className="fact-source">Source: NFHS-5, Ministry of Health & Family Welfare</div>
        </div>
        <div className="fact-card orange">
          <div className="fact-figure">19.3%</div>
          <div className="fact-text">Children under 5 are wasted — dangerously low weight for their height, indicating acute malnutrition</div>
          <div className="fact-source">Source: NFHS-5, Ministry of Health & Family Welfare</div>
        </div>
        <div className="fact-card blue">
          <div className="fact-figure">32.1%</div>
          <div className="fact-text">Children under 5 are underweight — below the minimum weight for their age across India</div>
          <div className="fact-source">Source: NFHS-5, Ministry of Health & Family Welfare</div>
        </div>
        <div className="fact-card orange">
          <div className="fact-figure">57%</div>
          <div className="fact-text">Women aged 15–49 years are anaemic — a direct consequence of iron and protein deficiency</div>
          <div className="fact-source">Source: NFHS-5, Ministry of Health & Family Welfare</div>
        </div>
      </div>

      {/* Survey stats */}
      {stats && (
        <>
          <div className="section-rule" />
          <div className="section-label">Primary Survey Data — 50,000 Participants, {stats.states} States (2021–2024)</div>
          <div className="stat-row">
            <div className="stat-card red">
              <div className="stat-value">{stats.severe_pct}%</div>
              <div className="stat-label">Severe Malnutrition</div>
              <div className="stat-sub">of surveyed population</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-value">{stats.protein_def_pct}%</div>
              <div className="stat-label">Protein Deficient</div>
              <div className="stat-sub">below daily requirement</div>
            </div>
            <div className="stat-card blue">
              <div className="stat-value">{stats.calorie_def_pct}%</div>
              <div className="stat-label">Calorie Deficient</div>
              <div className="stat-sub">below daily requirement</div>
            </div>
            <div className="stat-card teal">
              <div className="stat-value">{stats.anemia_pct}%</div>
              <div className="stat-label">Anaemia</div>
              <div className="stat-sub">low haemoglobin</div>
            </div>
            <div className="stat-card yellow">
              <div className="stat-value">{stats.stunted_child_pct}%</div>
              <div className="stat-label">Children Stunted</div>
              <div className="stat-sub">ages 0–12 in survey</div>
            </div>
            <div className="stat-card red">
              <div className="stat-value">{stats.worst_state?.split(" ")[0]}</div>
              <div className="stat-label">Worst Affected</div>
              <div className="stat-sub">{stats.worst_state}</div>
            </div>
          </div>
        </>
      )}

      <div className="section-rule" />
      <div className="section-label">Government Data — Child Stunting Across All States</div>

      <ChartBlock
        PY={PY}
        endpoint="/api/py/chart/nfhs-stunting"
        title="Child Stunting Rate by State — NFHS-4 vs NFHS-5"
        subtitle="% of children under 5 with height-for-age below −2 standard deviations"
        source="Govt. of India · NFHS"
        insight={<>
          <strong>Bihar (42.9%), Meghalaya (46.5%), Uttar Pradesh (39.7%) and Jharkhand (39.6%)</strong> have the
          highest child stunting rates in India. Stunting is irreversible — a child who is stunted at age 2 will
          never recover full cognitive and physical potential. The dotted red line marks the 35% critical threshold.
          States above this line require emergency intervention.
        </>}
      />

      <ChartBlock
        PY={PY}
        endpoint="/api/py/chart/nfhs-change"
        title="Has India Improved? — NFHS-4 to NFHS-5 Progress Report"
        subtitle="Change in stunting, underweight and wasting rates between 2015-16 and 2019-21"
        source="Govt. of India · NFHS"
        insight={<>
          <strong>Green bars = improvement. Red bars = things got worse.</strong> While states like Rajasthan, UP
          and Jharkhand have improved, several states including <strong>Meghalaya, Telangana, Goa and Nagaland
          have worsened</strong> across all three indicators. This means existing programs are not reaching
          all regions equally — targeted state-level intervention is urgently needed.
        </>}
      />

      <ChartBlock
        PY={PY}
        endpoint="/api/py/chart/india-map"
        title="India Child Stunting Map — State-by-State (NFHS-4 vs NFHS-5)"
        subtitle="Bubble size and colour show stunting severity — darker and larger = more children affected"
        source="Govt. of India · NFHS · Geo Map"
        insight={<>
          The map makes the geographic concentration of India's crisis immediately visible.
          <strong> The dark red clusters in Eastern India — Bihar, Jharkhand, UP, and MP — carry
          the heaviest burden.</strong> Comparing the two maps side by side shows where conditions
          improved (bubbles shrink/lighten) and where they worsened (bubbles grow/darken) between
          2015 and 2021. Northeast India shows mixed trends — some states improving, others worsening.
          Southern and coastal states remain relatively better off.
        </>}
      />

      <p className="footnote">Data sources: National Family Health Survey (NFHS-4: 2015-16, NFHS-5: 2019-21), Ministry of Health & Family Welfare, Government of India. Primary survey: 50,000 individual records, 2021-2024.</p>
    </div>
  );
}
