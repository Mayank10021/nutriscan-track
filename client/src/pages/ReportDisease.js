import React from "react";
import ChartBlock from "./ChartBlock";

export default function DiseaseImpact({ PY, svcOk }) {
  return (
    <div className="page">
      <div className="page-eyebrow">Section 3 of 4 — Disease Impact</div>
      <h1 className="page-title">The Cost of Hunger:<br/>What Malnutrition Does to the Body</h1>
      <p className="page-intro">
        Malnutrition is not just about being thin. It triggers a cascade of preventable diseases —
        from anaemia that impairs brain development, to stunted growth that cannot be reversed,
        to weakened immunity that makes every infection life-threatening. The data quantifies
        exactly how widespread these consequences are.
      </p>

      {!svcOk && svcOk !== null && (
        <div className="offline-banner">
          ⚠ Python service offline. <code>cd python-service &amp;&amp; python app.py</code>
        </div>
      )}

      <div className="fact-row">
        <div className="fact-card red">
          <div className="fact-figure">67.1%</div>
          <div className="fact-text">Children under 5 are anaemic in India — impairing cognitive development and school performance permanently</div>
          <div className="fact-source">NFHS-5, Government of India</div>
        </div>
        <div className="fact-card orange">
          <div className="fact-figure">~1.1Cr</div>
          <div className="fact-text">Children in India suffer from Severe Acute Malnutrition (SAM) — at immediate risk of death without intervention</div>
          <div className="fact-source">UNICEF India, 2023</div>
        </div>
        <div className="fact-card blue">
          <div className="fact-figure">45%</div>
          <div className="fact-text">Of all child deaths under age 5 in India are linked to malnutrition as an underlying cause</div>
          <div className="fact-source">WHO / UNICEF Estimates</div>
        </div>
      </div>

      <ChartBlock
        PY={PY}
        endpoint="/api/py/chart/disease-burden"
        title="Health Consequences of Malnutrition — Estimated Prevalence"
        subtitle="% of population affected by diseases directly caused or worsened by nutritional deficiency"
        source="Survey Data · Python / Pandas"
        insight={<>
          <strong>Anaemia is the most widespread consequence</strong>, affecting over 65% of the surveyed
          population. The chart also shows absolute numbers — at 65%, that represents over 900 million
          people nationally. Stunting and wasting among children are next, followed by night blindness
          (Vitamin A deficiency) and TB risk — all preventable with adequate nutrition.
          <strong> Every one of these conditions is preventable with basic dietary intervention.</strong>
        </>}
      />

      <ChartBlock
        PY={PY}
        endpoint="/api/py/chart/stunting-wasting"
        title="Stunting vs Wasting by State — NFHS-5 (2019-21)"
        subtitle="States in the upper-right quadrant face a double burden of both stunting and wasting"
        source="Govt. of India · NFHS-5"
        insight={<>
          States in the top-right zone face a <strong>double burden</strong> — both high stunting (chronic
          long-term malnutrition) AND high wasting (acute recent malnutrition) simultaneously.
          <strong> Bihar, Gujarat, Maharashtra and Jharkhand</strong> fall in this danger zone.
          Stunting reflects food insecurity over months and years. Wasting reflects recent acute hunger.
          When both are high together, it signals a structural collapse in food access — not just a
          temporary shortage.
        </>}
      />

      <p className="footnote">Disease estimates extrapolated to national population of 1.4 billion based on survey prevalence rates. Sources: NFHS-5, UNICEF, WHO Global Nutrition Report 2023.</p>
    </div>
  );
}
