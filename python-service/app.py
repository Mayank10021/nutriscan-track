"""
NutriTrack India — Simplified Python Visualization Service
4 pages: Problem → Analysis → Disease Impact → Solutions
Real NFHS data + 50k survey dataset
"""
import io, base64, os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.gridspec as gridspec
import numpy as np
import pandas as pd
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.after_request
def cors(r):
    r.headers["Access-Control-Allow-Origin"] = "*"
    r.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    r.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return r

@app.before_request
def handle_options():
    if request.method == "OPTIONS":
        from flask import make_response
        res = make_response("", 200)
        res.headers["Access-Control-Allow-Origin"] = "*"
        res.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        res.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        return res

@app.route("/", defaults={"path": ""}, methods=["GET", "OPTIONS"])
@app.route("/<path:path>", methods=["GET", "OPTIONS"])
def opt(path): return jsonify({"status": "ok", "service": "NutriTrack Python Viz"}), 200

# ── Load datasets ─────────────────────────────────────────────────────────────
BASE = os.path.dirname(os.path.abspath(__file__))
CSV  = os.path.join(BASE, "..", "server", "nutritrack-data", "india_malnutrition_50k.csv")

def load_survey():
    df = pd.read_csv(CSV)
    return df

DF = load_survey()

# ── Real NFHS-4 vs NFHS-5 government data ─────────────────────────────────────
NFHS = pd.DataFrame([
    {"state":"Andhra Pradesh",  "stunt4":31.4,"stunt5":31.2,"waste4":17.2,"waste5":16.1,"uw4":31.9,"uw5":29.6,"bmi4":17.6,"bmi5":14.8},
    {"state":"Arunachal Pradesh","stunt4":29.4,"stunt5":28.0,"waste4":17.3,"waste5":13.1,"uw4":19.4,"uw5":15.4,"bmi4":8.5,"bmi5":5.7},
    {"state":"Assam",           "stunt4":36.4,"stunt5":35.3,"waste4":17.0,"waste5":21.7,"uw4":29.8,"uw5":32.8,"bmi4":25.7,"bmi5":17.6},
    {"state":"Bihar",           "stunt4":48.3,"stunt5":42.9,"waste4":20.8,"waste5":22.9,"uw4":43.9,"uw5":41.0,"bmi4":30.4,"bmi5":25.6},
    {"state":"Chhattisgarh",    "stunt4":37.6,"stunt5":34.6,"waste4":23.1,"waste5":18.9,"uw4":37.7,"uw5":31.3,"bmi4":26.7,"bmi5":23.1},
    {"state":"Delhi",           "stunt4":31.9,"stunt5":30.9,"waste4":15.9,"waste5":11.2,"uw4":27.0,"uw5":21.8,"bmi4":14.9,"bmi5":10.0},
    {"state":"Goa",             "stunt4":20.1,"stunt5":25.8,"waste4":21.9,"waste5":19.1,"uw4":23.8,"uw5":24.0,"bmi4":14.7,"bmi5":13.8},
    {"state":"Gujarat",         "stunt4":38.5,"stunt5":39.0,"waste4":26.4,"waste5":25.1,"uw4":39.3,"uw5":39.7,"bmi4":27.2,"bmi5":25.2},
    {"state":"Haryana",         "stunt4":34.0,"stunt5":27.5,"waste4":21.2,"waste5":11.5,"uw4":29.4,"uw5":21.5,"bmi4":15.8,"bmi5":15.1},
    {"state":"Himachal Pradesh","stunt4":26.3,"stunt5":30.8,"waste4":13.7,"waste5":17.4,"uw4":21.2,"uw5":25.5,"bmi4":16.2,"bmi5":13.9},
    {"state":"Jharkhand",       "stunt4":45.3,"stunt5":39.6,"waste4":29.0,"waste5":22.4,"uw4":47.8,"uw5":39.4,"bmi4":31.5,"bmi5":26.2},
    {"state":"Karnataka",       "stunt4":36.2,"stunt5":35.4,"waste4":26.1,"waste5":19.5,"uw4":35.2,"uw5":32.9,"bmi4":20.7,"bmi5":17.2},
    {"state":"Kerala",          "stunt4":19.7,"stunt5":23.4,"waste4":15.7,"waste5":15.8,"uw4":16.1,"uw5":19.7,"bmi4":9.7,"bmi5":10.1},
    {"state":"Madhya Pradesh",  "stunt4":42.0,"stunt5":35.7,"waste4":25.8,"waste5":19.0,"uw4":42.8,"uw5":33.0,"bmi4":28.4,"bmi5":23.0},
    {"state":"Maharashtra",     "stunt4":34.4,"stunt5":35.2,"waste4":25.6,"waste5":25.6,"uw4":36.0,"uw5":36.1,"bmi4":23.5,"bmi5":20.8},
    {"state":"Manipur",         "stunt4":28.9,"stunt5":23.4,"waste4":6.8,"waste5":9.9,"uw4":13.8,"uw5":13.3,"bmi4":8.8,"bmi5":7.2},
    {"state":"Meghalaya",       "stunt4":43.8,"stunt5":46.5,"waste4":15.3,"waste5":12.1,"uw4":28.9,"uw5":26.6,"bmi4":12.1,"bmi5":10.8},
    {"state":"Mizoram",         "stunt4":28.1,"stunt5":28.9,"waste4":6.1,"waste5":9.8,"uw4":12.0,"uw5":12.7,"bmi4":8.4,"bmi5":5.3},
    {"state":"Nagaland",        "stunt4":28.6,"stunt5":32.7,"waste4":11.3,"waste5":19.1,"uw4":16.7,"uw5":26.9,"bmi4":12.3,"bmi5":11.1},
    {"state":"Odisha",          "stunt4":34.1,"stunt5":31.0,"waste4":20.4,"waste5":18.1,"uw4":34.4,"uw5":29.7,"bmi4":26.5,"bmi5":20.8},
    {"state":"Punjab",          "stunt4":25.7,"stunt5":24.5,"waste4":15.6,"waste5":10.6,"uw4":21.6,"uw5":16.9,"bmi4":11.7,"bmi5":12.7},
    {"state":"Rajasthan",       "stunt4":39.1,"stunt5":31.8,"waste4":23.0,"waste5":16.8,"uw4":36.7,"uw5":27.6,"bmi4":27.0,"bmi5":19.6},
    {"state":"Sikkim",          "stunt4":29.6,"stunt5":22.3,"waste4":14.2,"waste5":13.7,"uw4":14.2,"uw5":13.1,"bmi4":6.4,"bmi5":5.8},
    {"state":"Tamil Nadu",      "stunt4":27.1,"stunt5":25.0,"waste4":19.7,"waste5":14.6,"uw4":23.8,"uw5":22.0,"bmi4":14.6,"bmi5":12.6},
    {"state":"Telangana",       "stunt4":28.0,"stunt5":33.1,"waste4":18.1,"waste5":21.7,"uw4":28.4,"uw5":31.8,"bmi4":22.9,"bmi5":18.8},
    {"state":"Tripura",         "stunt4":24.3,"stunt5":32.3,"waste4":16.8,"waste5":18.2,"uw4":24.1,"uw5":25.6,"bmi4":18.9,"bmi5":16.2},
    {"state":"Uttar Pradesh",   "stunt4":46.3,"stunt5":39.7,"waste4":17.9,"waste5":17.3,"uw4":39.5,"uw5":32.1,"bmi4":25.3,"bmi5":19.0},
    {"state":"Uttarakhand",     "stunt4":33.5,"stunt5":27.0,"waste4":19.5,"waste5":13.2,"uw4":26.6,"uw5":21.0,"bmi4":18.4,"bmi5":13.9},
    {"state":"West Bengal",     "stunt4":32.5,"stunt5":33.8,"waste4":20.3,"waste5":20.3,"uw4":31.6,"uw5":32.2,"bmi4":21.3,"bmi5":14.8},
])

# ── Style ─────────────────────────────────────────────────────────────────────
BG="#f8f6f1"; CARD="#ffffff"; BORD="#e2ddd5"
DARK="#1a1a2e"; TEXT="#2d3748"; MUTED="#718096"
RED="#c0392b"; ORANGE="#d35400"; YELLOW="#d4a017"
GREEN="#1e6b3c"; BLUE="#1a4a7a"; TEAL="#0d6e6e"
LIGHT_RED="#fde8e8"; LIGHT_GREEN="#e8f5ee"; LIGHT_BLUE="#e8f0fa"

AGE_ORDER = ["Child (0-5)","Child (6-12)","Teen (13-19)","Adult (20-39)","Middle Age (40-59)","Senior (60+)"]

def setup():
    plt.rcParams.update({
        "figure.facecolor":BG,"axes.facecolor":CARD,"axes.edgecolor":BORD,
        "axes.labelcolor":TEXT,"xtick.color":MUTED,"ytick.color":MUTED,
        "text.color":TEXT,"grid.color":BORD,"grid.linestyle":"--",
        "grid.alpha":0.5,"font.family":"DejaVu Sans",
        "axes.spines.top":"False","axes.spines.right":"False",
    })

def b64(fig):
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight",
                facecolor=BG, edgecolor="none", dpi=140)
    buf.seek(0)
    enc = base64.b64encode(buf.read()).decode()
    plt.close(fig); return enc

def fig(w, h, r=1, c=1):
    setup()
    f, axes = plt.subplots(r, c, figsize=(w, h), facecolor=BG)
    flat = axes.flatten() if hasattr(axes, "flatten") else [axes]
    for ax in flat:
        ax.set_facecolor(CARD)
        ax.spines["top"].set_visible(False)
        ax.spines["right"].set_visible(False)
        ax.spines["left"].set_color(BORD)
        ax.spines["bottom"].set_color(BORD)
    return f, axes

# ─────────────────────────────────────────────────────────────────────────────
# PAGE 1: PROBLEM — NFHS state comparison + national scale
# ─────────────────────────────────────────────────────────────────────────────

@app.route("/api/py/health", methods=["GET", "OPTIONS"])
def health():
    return jsonify({"status":"ok","records":len(DF),"states":int(DF["state"].nunique())})

@app.route("/api/py/stats", methods=["GET", "OPTIONS"])
def stats():
    df = DF; n = len(df)
    return jsonify({
        "total": n,
        "severe_pct": round((df["nutrition_status"]=="Severe").sum()/n*100,1),
        "protein_def_pct": round(df["protein_deficient"].mean()*100,1),
        "calorie_def_pct": round(df["calorie_deficient"].mean()*100,1),
        "anemia_pct": round(df["anemia"].mean()*100,1),
        "stunted_child_pct": round(df[df["age_group"].isin(["Child (0-5)","Child (6-12)"])]["stunted"].mean()*100,1),
        "worst_state": str(df.groupby("state")["risk_score"].mean().idxmax()),
        "states": int(df["state"].nunique()),
    })

# Chart P1: NFHS-4 vs NFHS-5 — Stunting across states (horizontal bars, sorted)
@app.route("/api/py/chart/nfhs-stunting", methods=["GET", "OPTIONS"])
def nfhs_stunting():
    df = NFHS.sort_values("stunt5", ascending=True)
    f, ax = plt.subplots(figsize=(12, 10), facecolor=BG)
    ax.set_facecolor(CARD)
    ax.spines["top"].set_visible(False); ax.spines["right"].set_visible(False)
    ax.spines["left"].set_color(BORD); ax.spines["bottom"].set_color(BORD)
    setup()

    y = np.arange(len(df))
    h = 0.35
    b1 = ax.barh(y - h/2, df["stunt4"], h, color="#c0392b", alpha=0.55,
                 label="NFHS-4 (2015-16)", edgecolor="none")
    b2 = ax.barh(y + h/2, df["stunt5"], h, color="#1a4a7a",
                 label="NFHS-5 (2019-21)", edgecolor="none")

    ax.set_yticks(y)
    ax.set_yticklabels(df["state"], fontsize=9, color=TEXT)
    ax.set_xlabel("Children under 5 who are Stunted (%)", color=MUTED, fontsize=10)
    ax.set_title("Child Stunting Rate by State — NFHS-4 vs NFHS-5\n"
                 "Source: National Family Health Survey, Ministry of Health & Family Welfare, Govt. of India",
                 color=DARK, fontsize=12, fontweight="bold", pad=14, loc="left")
    ax.axvline(35, color=RED, linewidth=1, linestyle=":", alpha=0.6)
    ax.text(35.5, len(df)-1, "35% critical\nthreshold", color=RED, fontsize=8, va="top")
    ax.xaxis.grid(True, alpha=0.4, color=BORD); ax.set_axisbelow(True)
    ax.legend(loc="lower right", facecolor=CARD, edgecolor=BORD, fontsize=10)

    # Annotate worst states
    for _, row in df[df["stunt5"] > 38].iterrows():
        idx = df.index.get_loc(_)
        ax.text(row["stunt5"] + 0.5, y[idx] + h/2,
                f"{row['stunt5']:.0f}%", va="center", color=BLUE, fontsize=8, fontweight="bold")

    f.tight_layout(pad=2)
    return jsonify({"image": b64(f)})

# Chart P2: NFHS-4 vs NFHS-5 — Change (improvement or worsening)
@app.route("/api/py/chart/nfhs-change", methods=["GET", "OPTIONS"])
def nfhs_change():
    df = NFHS.copy()
    df["stunt_change"] = df["stunt5"] - df["stunt4"]
    df["uw_change"]    = df["uw5"]    - df["uw4"]
    df["waste_change"] = df["waste5"] - df["waste4"]
    df = df.sort_values("stunt_change", ascending=True)

    f, axes = plt.subplots(1, 3, figsize=(15, 8), facecolor=BG)
    setup()

    for ax, col, title, unit in zip(
        axes,
        ["stunt_change", "uw_change", "waste_change"],
        ["Stunting", "Underweight", "Wasting"],
        ["%pts", "%pts", "%pts"]
    ):
        ax.set_facecolor(CARD)
        ax.spines["top"].set_visible(False); ax.spines["right"].set_visible(False)
        ax.spines["left"].set_color(BORD); ax.spines["bottom"].set_color(BORD)

        colors = [GREEN if v < 0 else RED for v in df[col]]
        bars = ax.barh(df["state"], df[col], color=colors, edgecolor="none", height=0.7)
        ax.axvline(0, color=DARK, linewidth=1.2)
        ax.set_xlabel(f"Change in {title} (%pts)\nGreen = Improved, Red = Worsened",
                      color=MUTED, fontsize=9)
        ax.set_title(title, color=DARK, fontsize=12, fontweight="bold", pad=10)
        ax.xaxis.grid(True, alpha=0.4, color=BORD); ax.set_axisbelow(True)
        ax.set_yticklabels(df["state"], fontsize=8)

    f.suptitle("Progress Report: NFHS-4 (2015-16) → NFHS-5 (2019-21) — Has India Improved?\n"
               "Source: Ministry of Health & Family Welfare, Government of India",
               color=DARK, fontsize=12, fontweight="bold", y=1.01)
    f.tight_layout(pad=2)
    return jsonify({"image": b64(f)})

# ─────────────────────────────────────────────────────────────────────────────
# PAGE 2: ANALYSIS — Nutrient gaps, age & region
# ─────────────────────────────────────────────────────────────────────────────

# Chart A1: Protein intake vs requirement by age group
@app.route("/api/py/chart/protein-gap", methods=["GET", "OPTIONS"])
def protein_gap():
    df = DF
    grp = df.groupby("age_group").agg(
        avg_prot=("protein_intake_g","mean"),
        req_prot=("protein_required_g","mean"),
        avg_cal=("calorie_intake_kcal","mean"),
        req_cal=("calorie_required_kcal","mean"),
    ).reindex(AGE_ORDER).dropna()

    f, axes = plt.subplots(1, 2, figsize=(14, 6), facecolor=BG)
    setup()
    short = [a.replace(" (","<br>(").split("<br>")[0] for a in grp.index]
    short = [a.split(" (")[0]+"\n"+"("+a.split("(")[1].rstrip(")") if "(" in a else a for a in grp.index]

    for ax in axes:
        ax.set_facecolor(CARD)
        ax.spines["top"].set_visible(False); ax.spines["right"].set_visible(False)
        ax.spines["left"].set_color(BORD); ax.spines["bottom"].set_color(BORD)

    x = range(len(grp))

    # Protein
    axes[0].plot(x, grp["req_prot"], color=GREEN, linewidth=2.5, marker="s",
                 markersize=7, linestyle="--", label="Recommended Daily Requirement", zorder=4)
    axes[0].plot(x, grp["avg_prot"], color=RED, linewidth=2.5, marker="o",
                 markersize=7, label="Actual Average Intake", zorder=4)
    axes[0].fill_between(x, grp["avg_prot"], grp["req_prot"],
                         where=grp["avg_prot"]<grp["req_prot"],
                         alpha=0.15, color=RED, label="Deficit Zone")
    axes[0].set_xticks(list(x)); axes[0].set_xticklabels(short, fontsize=9)
    axes[0].set_ylabel("Protein (g/day)", color=MUTED, fontsize=10)
    axes[0].set_title("Daily Protein Intake vs Requirement by Age Group",
                      color=DARK, fontsize=12, fontweight="bold", pad=12, loc="left")
    axes[0].yaxis.grid(True, alpha=0.4, color=BORD); axes[0].set_axisbelow(True)
    axes[0].legend(facecolor=CARD, edgecolor=BORD, fontsize=9)

    # Annotate gap %
    for i, (a, r) in enumerate(zip(grp["avg_prot"], grp["req_prot"])):
        gap = round((r-a)/r*100)
        if gap > 0:
            axes[0].annotate(f"−{gap}%", xy=(i, (a+r)/2),
                             ha="center", color=RED, fontsize=9, fontweight="bold")

    # Calories
    axes[1].plot(x, grp["req_cal"], color=GREEN, linewidth=2.5, marker="s",
                 markersize=7, linestyle="--", label="Recommended Daily Requirement", zorder=4)
    axes[1].plot(x, grp["avg_cal"], color=ORANGE, linewidth=2.5, marker="o",
                 markersize=7, label="Actual Average Intake", zorder=4)
    axes[1].fill_between(x, grp["avg_cal"], grp["req_cal"],
                         where=grp["avg_cal"]<grp["req_cal"],
                         alpha=0.12, color=ORANGE, label="Deficit Zone")
    axes[1].set_xticks(list(x)); axes[1].set_xticklabels(short, fontsize=9)
    axes[1].set_ylabel("Calories (kcal/day)", color=MUTED, fontsize=10)
    axes[1].set_title("Daily Calorie Intake vs Requirement by Age Group",
                      color=DARK, fontsize=12, fontweight="bold", pad=12, loc="left")
    axes[1].yaxis.grid(True, alpha=0.4, color=MUTED); axes[1].set_axisbelow(True)
    axes[1].legend(facecolor=CARD, edgecolor=BORD, fontsize=9)

    for i, (a, r) in enumerate(zip(grp["avg_cal"], grp["req_cal"])):
        gap = round((r-a)/r*100)
        if gap > 0:
            axes[1].annotate(f"−{gap}%", xy=(i, (a+r)/2),
                             ha="center", color=ORANGE, fontsize=9, fontweight="bold")

    f.suptitle("Nutrient Deficit Analysis — Survey of 50,000 Participants Across India (2021–2024)",
               color=MUTED, fontsize=10, y=1.01)
    f.tight_layout(pad=2.5)
    return jsonify({"image": b64(f)})

# Chart A2: Economic class vs malnutrition — simple bar
@app.route("/api/py/chart/economic-gap", methods=["GET", "OPTIONS"])
def economic_gap():
    df = DF
    eco_order = ["Below Poverty Line","Low Income","Middle Income","High Income"]
    grp = df.groupby("economic_status").agg(
        severe_pct=("nutrition_status", lambda x: (x=="Severe").sum()/len(x)*100),
        protein_def=("protein_deficient", lambda x: x.mean()*100),
        anemia=("anemia", lambda x: x.mean()*100),
    ).reindex([e for e in eco_order if e in df["economic_status"].unique()])

    f, ax = plt.subplots(figsize=(11, 5), facecolor=BG)
    ax.set_facecolor(CARD)
    ax.spines["top"].set_visible(False); ax.spines["right"].set_visible(False)
    ax.spines["left"].set_color(BORD); ax.spines["bottom"].set_color(BORD)
    setup()

    x = np.arange(len(grp)); w = 0.26
    ax.bar(x - w, grp["severe_pct"], w, label="Severe Malnutrition %", color=RED, edgecolor="none")
    ax.bar(x,     grp["protein_def"], w, label="Protein Deficient %",  color=ORANGE, edgecolor="none")
    ax.bar(x + w, grp["anemia"],     w, label="Anaemia %",             color=BLUE, edgecolor="none", alpha=0.8)

    for bars, vals in [(ax.containers[0], grp["severe_pct"]),
                       (ax.containers[1], grp["protein_def"]),
                       (ax.containers[2], grp["anemia"])]:
        for bar, v in zip(bars, vals):
            ax.text(bar.get_x()+bar.get_width()/2, bar.get_height()+0.5,
                    f"{v:.0f}%", ha="center", va="bottom", color=TEXT, fontsize=9)

    ax.set_xticks(x); ax.set_xticklabels(grp.index, fontsize=10)
    ax.set_ylabel("% of Population Affected", color=MUTED, fontsize=10)
    ax.set_title("Malnutrition Burden by Economic Class — The Inequality Gap",
                 color=DARK, fontsize=12, fontweight="bold", pad=12, loc="left")
    ax.yaxis.grid(True, alpha=0.4, color=BORD); ax.set_axisbelow(True)
    ax.legend(facecolor=CARD, edgecolor=BORD, fontsize=10)

    # Annotation
    bpl_sev = grp["severe_pct"].iloc[0]
    hi_sev  = grp["severe_pct"].iloc[-1]
    ax.annotate(f"BPL families have {bpl_sev/hi_sev:.0f}× higher\nmalnutrition than high income",
                xy=(0, bpl_sev), xytext=(1.5, bpl_sev+8),
                arrowprops=dict(arrowstyle="->", color=RED, lw=1.2),
                color=RED, fontsize=9, fontweight="bold")

    f.tight_layout(pad=2)
    return jsonify({"image": b64(f)})

# Chart A3: Top 10 worst states from survey data
@app.route("/api/py/chart/worst-states", methods=["GET", "OPTIONS"])
def worst_states():
    df = DF
    sg = df.groupby("state").agg(
        severe_pct=("nutrition_status", lambda x: (x=="Severe").sum()/len(x)*100),
        protein_def=("protein_deficient", lambda x: x.mean()*100),
        anemia_pct=("anemia", lambda x: x.mean()*100),
        n=("id","count")
    ).reset_index()
    sg = sg[sg["n"] >= 100].sort_values("severe_pct", ascending=True).tail(12)

    f, ax = plt.subplots(figsize=(11, 7), facecolor=BG)
    ax.set_facecolor(CARD)
    ax.spines["top"].set_visible(False); ax.spines["right"].set_visible(False)
    ax.spines["left"].set_color(BORD); ax.spines["bottom"].set_color(BORD)
    setup()

    colors = [RED if v > 70 else ORANGE if v > 55 else YELLOW for v in sg["severe_pct"]]
    bars = ax.barh(sg["state"], sg["severe_pct"], color=colors, edgecolor="none", height=0.65)
    ax.set_xlabel("% with Severe Malnutrition", color=MUTED, fontsize=10)
    ax.set_title("Most Affected States — Severe Malnutrition Rate\n(Survey Data, 2021–2024)",
                 color=DARK, fontsize=12, fontweight="bold", pad=12, loc="left")
    ax.xaxis.grid(True, alpha=0.4, color=BORD); ax.set_axisbelow(True)
    for bar, v in zip(bars, sg["severe_pct"]):
        ax.text(v + 0.4, bar.get_y()+bar.get_height()/2,
                f"{v:.0f}%", va="center", color=TEXT, fontsize=10, fontweight="bold")

    f.tight_layout(pad=2)
    return jsonify({"image": b64(f)})

# ─────────────────────────────────────────────────────────────────────────────
# PAGE 3: DISEASE IMPACT
# ─────────────────────────────────────────────────────────────────────────────

# Chart D1: Disease burden — simple horizontal bars, real numbers
@app.route("/api/py/chart/disease-burden", methods=["GET", "OPTIONS"])
def disease_burden():
    df = DF; n = len(df)
    diseases = {
        "Anaemia": df["anemia"].mean()*100,
        "Protein Deficiency": df["protein_deficient"].mean()*100,
        "Iron Deficiency": df["iron_deficient"].mean()*100,
        "Stunting (Children)": df[df["age_group"].isin(["Child (0-5)","Child (6-12)"])]["stunted"].mean()*100,
        "Wasting (Children)": df[df["age_group"].isin(["Child (0-5)","Child (6-12)"])]["wasted"].mean()*100,
        "Night Blindness": df["has_night_blindness"].mean()*100,
        "Rickets": df[df["age_group"].isin(["Child (0-5)","Child (6-12)"])]["has_kwashiorkor"].mean()*100,
        "TB Risk": df["has_tb_risk"].mean()*100,
    }
    dis_df = pd.Series(diseases).sort_values(ascending=True)

    f, ax = plt.subplots(figsize=(11, 6), facecolor=BG)
    ax.set_facecolor(CARD)
    ax.spines["top"].set_visible(False); ax.spines["right"].set_visible(False)
    ax.spines["left"].set_color(BORD); ax.spines["bottom"].set_color(BORD)
    setup()

    colors = [RED if v > 50 else ORANGE if v > 25 else YELLOW if v > 10 else TEAL
              for v in dis_df.values]
    bars = ax.barh(dis_df.index, dis_df.values, color=colors, edgecolor="none", height=0.6)
    ax.set_xlabel("% of Surveyed Population Affected", color=MUTED, fontsize=10)
    ax.set_title("Health Consequences of Malnutrition — Estimated Prevalence",
                 color=DARK, fontsize=12, fontweight="bold", pad=12, loc="left")
    ax.xaxis.grid(True, alpha=0.4, color=BORD); ax.set_axisbelow(True)

    for bar, v in zip(bars, dis_df.values):
        est = int(v/100 * 1_400_000_000 / 1_000_000)
        ax.text(v + 0.3, bar.get_y()+bar.get_height()/2,
                f"{v:.1f}%  (~{est}M people)", va="center", color=TEXT, fontsize=9)

    ax.set_xlim(0, max(dis_df.values)*1.55)
    f.tight_layout(pad=2)
    return jsonify({"image": b64(f)})

# Chart D2: NFHS stunting vs wasting — scatter by state, colour coded
@app.route("/api/py/chart/stunting-wasting", methods=["GET", "OPTIONS"])
def stunting_wasting():
    df = NFHS.copy()

    f, ax = plt.subplots(figsize=(11, 7), facecolor=BG)
    ax.set_facecolor(CARD)
    ax.spines["top"].set_visible(False); ax.spines["right"].set_visible(False)
    ax.spines["left"].set_color(BORD); ax.spines["bottom"].set_color(BORD)
    setup()

    # Colour by stunting severity
    colors = [RED if s > 38 else ORANGE if s > 28 else GREEN for s in df["stunt5"]]
    ax.scatter(df["stunt5"], df["waste5"], c=colors, s=80, edgecolors=BORD, linewidths=0.5, zorder=3)

    for _, row in df.iterrows():
        ax.annotate(row["state"], (row["stunt5"], row["waste5"]),
                    xytext=(4, 3), textcoords="offset points",
                    fontsize=7.5, color=MUTED)

    ax.axvline(35, color=RED, linewidth=1, linestyle=":", alpha=0.5)
    ax.axhline(20, color=RED, linewidth=1, linestyle=":", alpha=0.5)
    ax.text(35.3, ax.get_ylim()[1]*0.98, "35%\ncritical", color=RED, fontsize=8, va="top")
    ax.text(ax.get_xlim()[1]*0.98, 20.3, "20% critical", color=RED, fontsize=8, ha="right")

    ax.set_xlabel("Stunting — Children under 5 (%)", color=MUTED, fontsize=10)
    ax.set_ylabel("Wasting — Children under 5 (%)", color=MUTED, fontsize=10)
    ax.set_title("Stunting vs Wasting by State — NFHS-5 (2019-21)\n"
                 "Source: Ministry of Health & Family Welfare, Government of India",
                 color=DARK, fontsize=12, fontweight="bold", pad=12, loc="left")

    legend_items = [
        mpatches.Patch(color=RED, label="Stunting > 38% (Critical)"),
        mpatches.Patch(color=ORANGE, label="Stunting 28–38% (Moderate)"),
        mpatches.Patch(color=GREEN, label="Stunting < 28% (Relatively Better)"),
    ]
    ax.legend(handles=legend_items, facecolor=CARD, edgecolor=BORD, fontsize=9, loc="upper left")
    ax.yaxis.grid(True, alpha=0.4, color=BORD); ax.xaxis.grid(True, alpha=0.4, color=BORD)
    ax.set_axisbelow(True)

    f.tight_layout(pad=2)
    return jsonify({"image": b64(f)})

# ─────────────────────────────────────────────────────────────────────────────
# PAGE 4: SOLUTIONS — What works
# ─────────────────────────────────────────────────────────────────────────────

# Chart S1: Health scheme effectiveness
@app.route("/api/py/chart/scheme-effectiveness", methods=["GET", "OPTIONS"])
def scheme_effectiveness():
    df = DF
    hs = df.groupby("health_scheme").agg(
        n=("id","count"),
        severe_pct=("nutrition_status", lambda x: (x=="Severe").sum()/len(x)*100),
        protein_def=("protein_deficient", lambda x: x.mean()*100),
    ).reset_index().sort_values("severe_pct")

    f, ax = plt.subplots(figsize=(11, 5), facecolor=BG)
    ax.set_facecolor(CARD)
    ax.spines["top"].set_visible(False); ax.spines["right"].set_visible(False)
    ax.spines["left"].set_color(BORD); ax.spines["bottom"].set_color(BORD)
    setup()

    x = np.arange(len(hs)); w = 0.38
    b1 = ax.bar(x - w/2, hs["severe_pct"], w, label="Severe Malnutrition %",
                color=[GREEN if v < 60 else ORANGE if v < 72 else RED for v in hs["severe_pct"]],
                edgecolor="none")
    b2 = ax.bar(x + w/2, hs["protein_def"], w, label="Protein Deficient %",
                color=BLUE, alpha=0.65, edgecolor="none")

    for b in [b1, b2]:
        for bar in b:
            ax.text(bar.get_x()+bar.get_width()/2, bar.get_height()+0.5,
                    f"{bar.get_height():.0f}%", ha="center", va="bottom", color=MUTED, fontsize=8)

    ax.set_xticks(x); ax.set_xticklabels(hs["health_scheme"], rotation=15, fontsize=9, ha="right")
    ax.set_ylabel("% Affected", color=MUTED, fontsize=10)
    ax.set_title("Do Government Health Schemes Work? — Malnutrition Rate by Scheme Coverage",
                 color=DARK, fontsize=12, fontweight="bold", pad=12, loc="left")
    ax.yaxis.grid(True, alpha=0.4, color=BORD); ax.set_axisbelow(True)
    ax.legend(facecolor=CARD, edgecolor=BORD, fontsize=10)

    f.tight_layout(pad=2)
    return jsonify({"image": b64(f)})

# Chart S2: Education vs malnutrition
@app.route("/api/py/chart/education-impact", methods=["GET", "OPTIONS"])
def education_impact():
    df = DF
    edu_order = ["No Education","Primary","Secondary","Higher Secondary","Graduate"]
    eg = df.groupby("education_level").agg(
        severe_pct=("nutrition_status", lambda x: (x=="Severe").sum()/len(x)*100),
        protein_def=("protein_deficient", lambda x: x.mean()*100),
    ).reindex([e for e in edu_order if e in df["education_level"].unique()])

    f, ax = plt.subplots(figsize=(11, 5), facecolor=BG)
    ax.set_facecolor(CARD)
    ax.spines["top"].set_visible(False); ax.spines["right"].set_visible(False)
    ax.spines["left"].set_color(BORD); ax.spines["bottom"].set_color(BORD)
    setup()

    colors = [RED if v > 70 else ORANGE if v > 55 else GREEN for v in eg["severe_pct"]]
    bars = ax.bar(eg.index, eg["severe_pct"], color=colors, edgecolor="none", width=0.55)
    ax.plot(eg.index, eg["protein_def"], color=BLUE, linewidth=2, marker="o",
            markersize=7, label="Protein Deficient %", zorder=5)

    for bar, v in zip(bars, eg["severe_pct"]):
        ax.text(bar.get_x()+bar.get_width()/2, bar.get_height()+0.5,
                f"{v:.0f}%", ha="center", va="bottom", color=TEXT, fontsize=10, fontweight="bold")

    ax.set_ylabel("% with Severe Malnutrition", color=MUTED, fontsize=10)
    ax.set_title("Education Level vs Malnutrition — Higher Literacy = Lower Hunger",
                 color=DARK, fontsize=12, fontweight="bold", pad=12, loc="left")
    ax.yaxis.grid(True, alpha=0.4, color=BORD); ax.set_axisbelow(True)
    ax.legend(facecolor=CARD, edgecolor=BORD, fontsize=10)
    ax.tick_params(axis="x", labelsize=10)

    f.tight_layout(pad=2)
    return jsonify({"image": b64(f)})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"Python service on http://localhost:{port} | {len(DF)} records")
    app.run(host="0.0.0.0", port=port, debug=False)


# ─────────────────────────────────────────────────────────────────────────────
# INDIA CHOROPLETH MAP — NFHS-5 Stunting using plotted SVG-style approach
# ─────────────────────────────────────────────────────────────────────────────

@app.route("/api/py/chart/india-map", methods=["GET", "OPTIONS"])
def india_map():
    """
    Bubble map of India — each state shown as a proportional circle
    positioned at approximate lat/lon coordinates, colored by stunting severity.
    """
    STATE_COORDS = {
        "Andhra Pradesh":     (15.9, 79.7),
        "Arunachal Pradesh":  (28.0, 94.7),
        "Assam":              (26.2, 92.9),
        "Bihar":              (25.1, 85.3),
        "Chhattisgarh":       (21.3, 81.9),
        "Delhi":              (28.7, 77.1),
        "Goa":                (15.3, 74.0),
        "Gujarat":            (22.3, 71.2),
        "Haryana":            (29.1, 76.1),
        "Himachal Pradesh":   (31.1, 77.2),
        "Jammu & Kashmir":    (34.0, 76.6),
        "Jharkhand":          (23.6, 85.3),
        "Karnataka":          (15.3, 75.7),
        "Kerala":             (10.9, 76.3),
        "Madhya Pradesh":     (23.5, 77.7),
        "Maharashtra":        (19.7, 75.7),
        "Manipur":            (24.7, 93.9),
        "Meghalaya":          (25.5, 91.4),
        "Mizoram":            (23.2, 92.8),
        "Nagaland":           (26.2, 94.6),
        "Odisha":             (20.9, 84.3),
        "Punjab":             (31.1, 75.3),
        "Rajasthan":          (27.0, 74.2),
        "Sikkim":             (27.5, 88.5),
        "Tamil Nadu":         (11.1, 78.7),
        "Telangana":          (17.4, 78.5),
        "Tripura":            (23.7, 91.7),
        "Uttar Pradesh":      (27.0, 80.9),
        "Uttarakhand":        (30.1, 79.2),
        "West Bengal":        (22.9, 87.9),
    }

    df = NFHS.copy()
    df["lat"] = df["state"].map(lambda s: STATE_COORDS.get(s, (None,None))[0])
    df["lon"] = df["state"].map(lambda s: STATE_COORDS.get(s, (None,None))[1])
    df = df.dropna(subset=["lat","lon"])

    fig, axes = plt.subplots(1, 2, figsize=(16, 9), facecolor=BG)
    setup()

    for ax, col, year, title_yr in [
        (axes[0], "stunt4", "NFHS-4 (2015-16)", "NFHS-4  2015-16"),
        (axes[1], "stunt5", "NFHS-5 (2019-21)", "NFHS-5  2019-21"),
    ]:
        ax.set_facecolor("#e8f0fa")
        ax.spines[:].set_color(BORD)

        # India boundary box
        ax.set_xlim(66, 98); ax.set_ylim(6, 38)
        ax.set_aspect("equal")

        # Draw a simple India silhouette reference grid
        ax.set_xticks(range(68, 98, 5))
        ax.set_yticks(range(8, 38, 5))
        ax.set_xticklabels([f"{x}°E" for x in range(68,98,5)], fontsize=7, color=MUTED)
        ax.set_yticklabels([f"{y}°N" for y in range(8,38,5)], fontsize=7, color=MUTED)
        ax.grid(True, alpha=0.25, color="#aabbcc", linewidth=0.5)

        # Color scale
        norm = matplotlib.colors.Normalize(vmin=15, vmax=50)
        cmap = matplotlib.colors.LinearSegmentedColormap.from_list(
            "stunting", ["#d4e8c2","#f5c842","#e07020","#b52b27"])

        for _, row in df.iterrows():
            v = row[col]
            color = cmap(norm(v))
            size = max(40, (v / 50) * 600)
            ax.scatter(row["lon"], row["lat"], s=size, c=[color],
                       edgecolors="white", linewidths=0.8, zorder=3, alpha=0.88)
            # Label for major states
            if v > 35 or row["state"] in ["Kerala","Goa","Punjab","Delhi"]:
                ax.annotate(
                    f"{row['state'].split(' ')[0]}\n{v:.0f}%",
                    (row["lon"], row["lat"]),
                    xytext=(0, -18), textcoords="offset points",
                    ha="center", fontsize=6.5, color=DARK, fontweight="bold",
                    zorder=5
                )

        sm = plt.cm.ScalarMappable(cmap=cmap, norm=norm)
        sm.set_array([])
        cb = plt.colorbar(sm, ax=ax, fraction=0.03, pad=0.02, shrink=0.7)
        cb.set_label("Stunting %", color=MUTED, fontsize=9)
        cb.ax.tick_params(colors=MUTED, labelsize=8)

        ax.set_title(f"Child Stunting Rate — {title_yr}\n% of children under 5 with stunted height",
                     color=DARK, fontsize=11, fontweight="bold", pad=10, loc="left")
        ax.set_xlabel("Longitude", color=MUTED, fontsize=8)
        ax.set_ylabel("Latitude", color=MUTED, fontsize=8)

    # Change arrow annotation between maps
    fig.text(0.5, 0.93,
             "India Child Stunting Map — Comparing NFHS-4 (2015-16) vs NFHS-5 (2019-21)\n"
             "Bubble size & colour = stunting severity. Larger + darker = more children stunted.",
             ha="center", color=DARK, fontsize=11, fontweight="bold")
    fig.text(0.5, 0.01,
             "Source: National Family Health Survey (NFHS), Ministry of Health & Family Welfare, Government of India",
             ha="center", color=MUTED, fontsize=9, style="italic")

    fig.tight_layout(rect=[0, 0.04, 1, 0.90], pad=2)
    return jsonify({"image": b64(fig)})
