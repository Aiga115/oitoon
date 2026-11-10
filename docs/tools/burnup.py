import sys
import pandas as pd
import matplotlib.pyplot as plt

csv_file, out_file = sys.argv[1], sys.argv[2]
df = pd.read_csv(csv_file)            # columns: sprint, points_done, scope
df["total_done"] = df["points_done"].cumsum()

fig, ax = plt.subplots(figsize=(9, 5))
ax.bar(df["sprint"], df["points_done"], color="lightsteelblue", label="Points finished in the sprint")
ax.plot(df["sprint"], df["total_done"], marker="o", color="seagreen", label="Total finished")
ax.plot(df["sprint"], df["scope"], linestyle="--", color="firebrick", label="Total scope (82 points)")
ax.set_xlabel("Sprint")
ax.set_ylabel("Story points")
ax.set_title("Release Burn Up Chart")
ax.legend()
plt.tight_layout()
plt.savefig(out_file, dpi=150)