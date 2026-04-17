from typing import Dict, Any, List


CAMPAIGNS = [
    {
        "id": 1,
        "name": "Diabetes Awareness Spring",
        "channel": "Email",
        "impressions": 25000,
        "clicks": 2800,
        "conversions": 310,
        "spend": 4200.0,
    },
    {
        "id": 2,
        "name": "Cardio Follow-Up Outreach",
        "channel": "Paid Search",
        "impressions": 40000,
        "clicks": 3500,
        "conversions": 290,
        "spend": 6800.0,
    },
    {
        "id": 3,
        "name": "Care Plan Retention Push",
        "channel": "SMS",
        "impressions": 12000,
        "clicks": 2100,
        "conversions": 420,
        "spend": 1900.0,
    },
]

SEGMENTS = [
    {
        "id": 1,
        "name": "High-Risk Chronic Care",
        "criteria": "Age 50+, recurring visits, low engagement",
        "response_rate": 0.22,
        "priority_score": 92.0,
    },
    {
        "id": 2,
        "name": "Preventive Wellness",
        "criteria": "Routine annual checkup candidates",
        "response_rate": 0.17,
        "priority_score": 76.0,
    },
    {
        "id": 3,
        "name": "Medication Adherence",
        "criteria": "Prescription refill gaps > 30 days",
        "response_rate": 0.27,
        "priority_score": 95.0,
    },
]


class ToolRegistry:
    def __init__(self) -> None:
        self._tools = {
            "get_campaign_metrics": {
                "description": "Return sample campaign performance metrics.",
                "handler": self.get_campaign_metrics,
            },
            "get_segment_insights": {
                "description": "Return sample customer segment insights.",
                "handler": self.get_segment_insights,
            },
            "recommend_next_segment": {
                "description": "Recommend which customer segment should be prioritized next.",
                "handler": self.recommend_next_segment,
            },
        }

    def list_tools(self) -> List[Dict[str, str]]:
        return [
            {"name": name, "description": meta["description"]}
            for name, meta in self._tools.items()
        ]

    def execute(self, tool_name: str) -> Dict[str, Any]:
        if tool_name not in self._tools:
            raise ValueError(f"Unknown tool: {tool_name}")
        return self._tools[tool_name]["handler"]()

    def get_campaign_metrics(self) -> Dict[str, Any]:
        enriched = []
        for campaign in CAMPAIGNS:
            ctr = campaign["clicks"] / campaign["impressions"] if campaign["impressions"] else 0
            conversion_rate = campaign["conversions"] / campaign["clicks"] if campaign["clicks"] else 0
            cost_per_conversion = campaign["spend"] / campaign["conversions"] if campaign["conversions"] else 0
            enriched.append(
                {
                    **campaign,
                    "ctr": round(ctr, 4),
                    "conversion_rate": round(conversion_rate, 4),
                    "cost_per_conversion": round(cost_per_conversion, 2),
                }
            )
        return {"campaigns": enriched}

    def get_segment_insights(self) -> Dict[str, Any]:
        ranked = sorted(SEGMENTS, key=lambda s: s["priority_score"], reverse=True)
        return {"segments": ranked}

    def recommend_next_segment(self) -> Dict[str, Any]:
        best_segment = max(SEGMENTS, key=lambda s: (s["priority_score"], s["response_rate"]))
        return {
            "recommended_segment": best_segment,
            "reason": (
                "This segment has the strongest combination of priority score "
                "and expected response rate in the current mock dataset."
            ),
        }
