import os
from typing import Dict, Any, List
from dotenv import load_dotenv

from app.tools import ToolRegistry

load_dotenv()

try:
    from openai import OpenAI
except Exception:  # pragma: no cover
    OpenAI = None


class MarketingAssistant:
    def __init__(self) -> None:
        self.registry = ToolRegistry()
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=self.api_key) if self.api_key and OpenAI else None

    def build_context(self) -> Dict[str, Any]:
        campaign_context = self.registry.execute("get_campaign_metrics")
        segment_context = self.registry.execute("get_segment_insights")
        recommendation = self.registry.execute("recommend_next_segment")
        return {
            "campaign_metrics": campaign_context,
            "segment_insights": segment_context,
            "recommendation": recommendation,
        }

    def answer_question(self, question: str, use_live_llm: bool = False) -> Dict[str, Any]:
        context = self.build_context()
        tools_used: List[str] = [
            "get_campaign_metrics",
            "get_segment_insights",
            "recommend_next_segment",
        ]

        if use_live_llm and self.client:
            prompt = self._build_prompt(question, context)
            try:
                response = self.client.responses.create(
                    model=self.model,
                    input=prompt,
                )
                answer = getattr(response, "output_text", None) or "No answer returned from model."
            except Exception as exc:
                answer = (
                    "Live LLM call failed, so the assistant returned a fallback summary instead. "
                    f"Error: {exc}"
                )
                answer += "\n\n" + self._mock_answer(context)
        else:
            answer = self._mock_answer(context)

        return {
            "answer": answer,
            "tools_used": tools_used,
            "context": context,
        }

    def _build_prompt(self, question: str, context: Dict[str, Any]) -> str:
        return f"""
You are an AI assistant for a healthcare product marketing analytics dashboard.
Use the provided structured context to answer the user's question clearly and professionally.
Focus on campaign performance, customer segments, and next-best action.

User question:
{question}

Structured context:
{context}
""".strip()

    def _mock_answer(self, context: Dict[str, Any]) -> str:
        campaigns = context["campaign_metrics"]["campaigns"]
        best_campaign = max(campaigns, key=lambda c: c["conversions"])
        cheapest_campaign = min(campaigns, key=lambda c: c["cost_per_conversion"])
        recommendation = context["recommendation"]["recommended_segment"]

        return (
            f"Top campaign by conversions is '{best_campaign['name']}' with "
            f"{best_campaign['conversions']} conversions. "
            f"Most cost-efficient campaign is '{cheapest_campaign['name']}' at about "
            f"${cheapest_campaign['cost_per_conversion']} per conversion. "
            f"Recommended next segment to prioritize is '{recommendation['name']}' because it has "
            f"a high priority score ({recommendation['priority_score']}) and a strong response rate "
            f"({recommendation['response_rate']:.0%})."
        )
