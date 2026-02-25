import React from "react";
import ChartBlock from "./ChartBlock";

export default function Analysis({ PY, svcOk }) {
  return (
    <div className="page">
      <div className="page-eyebrow">Section 2 of 4 — Data Analysis</div>
      <h1 className="page-title">What Are People Not Getting?<br/>Nutrient Deficit Analysis</h1>
      <p className="page-intro">
        The data reveals a systematic shortfall in protein, calories, and micronutrients across all age groups —
        but children and seniors face the deepest deficits. Economic inequality is the single biggest driver:
        families below the poverty line consume less than half the protein a growing child needs.
      </p>

      {!svcOk && svcOk !== null && (
        <div className="offline-banner">
          ⚠ Python service offline. <code>cd python-service &amp;&amp; python app.py</code>
        </div>
      )}

      <div className="fact-row">
        <div className="fact-card red">
          <div className="fact-figure">−37%</div>
          <div className="fact-text">Average protein deficit across all age groups — people are eating only 63% of what they need</div>
          <div className="fact-source">Primary Survey, 50,000 participants</div>
        </div>
        <div className="fact-card orange">
          <div className="fact-figure">−32%</div>
          <div className="fact-text">Average calorie deficit — rural households consume roughly 1,400 kcal when they need 2,000+</div>
          <div className="fact-source">Primary Survey, 50,000 participants</div>
        </div>
        <div className="fact-card blue">
          <div className="fact-figure">3×</div>
          <div className="fact-text">Higher severe malnutrition rate in Below Poverty Line families vs middle-income families</div>
          <div className="fact-source">Primary Survey, 50,000 participants</div>
        </div>
      </div>

      <ChartBlock
        PY={PY}
        endpoint="/api/py/chart/protein-gap"
        title="Protein & Calorie Intake vs Daily Requirement — by Age Group"
        subtitle="Red shaded area shows the deficit gap between what people consume and what they need"
        source="Survey Data · Python / Pandas"
        insight={<>
          The red shaded gap between the actual intake line (red/orange) and the recommended requirement
          line (green dashed) represents the nutrient deficit. <strong>Every single age group falls short
          of recommended protein.</strong> Children aged 0-5 need 16g/day but receive only ~10g.
          Senior citizens need 60g/day but average barely 38g. The calorie gap mirrors this pattern —
          the body simply does not have enough energy to function and grow.
        </>}
      />

      <ChartBlock
        PY={PY}
        endpoint="/api/py/chart/economic-gap"
        title="The Inequality Gap — Malnutrition by Economic Class"
        subtitle="Severe malnutrition, protein deficiency and anaemia rates by household income group"
        source="Survey Data · Python / Pandas"
        insight={<>
          <strong>Below Poverty Line (BPL) families suffer malnutrition at nearly 3 times the rate
          of middle-income families.</strong> The arrow on the chart highlights this gap directly.
          This confirms that malnutrition in India is primarily an economic problem —
          food exists, but the poorest cannot afford adequate nutrition. Targeted food security
          programs for BPL households are the single highest-impact intervention possible.
        </>}
      />

      <ChartBlock
        PY={PY}
        endpoint="/api/py/chart/worst-states"
        title="Most Affected States — Severe Malnutrition Rate"
        subtitle="States ranked by proportion of population with severe nutritional deficiency (survey data, 2021–2024)"
        source="Survey Data · Python / Pandas"
        insight={<>
          <strong>Bihar, Jharkhand, Uttar Pradesh and Madhya Pradesh</strong> consistently appear
          as the most affected states in both government NFHS data and our primary survey.
          These states share common factors: high rural poverty rates, low female literacy,
          limited access to clean water and sanitation, and inadequate healthcare infrastructure.
          Any national nutrition policy must treat these states as priority zones.
        </>}
      />

      <p className="footnote">Analysis based on 50,000 individual survey records across 30 Indian states (2021–2024). Nutrient requirements based on Indian Council of Medical Research (ICMR) recommended dietary allowances.</p>
    </div>
  );
}
