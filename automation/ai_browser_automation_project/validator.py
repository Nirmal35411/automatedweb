from pydantic import BaseModel, ValidationError
from typing import List, Dict, Any

class Action(BaseModel):
    fn: str
    args: Dict[str, Any] = {}

class Plan(BaseModel):
    actions: List[Action]
    confidence: float = 0.0

def validate_plan(plan_json: Dict):
    try:
        plan = Plan(**plan_json)
    except ValidationError as e:
        return False, f"Schema error: {e}"
    if plan.confidence < 0.6:
        return False, f"Low confidence: {plan.confidence}"
    return True, plan
