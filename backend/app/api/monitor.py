from fastapi import APIRouter

from app.monitor.simulator import monitor

router = APIRouter(
    prefix="/monitor",
    tags=["Live Monitor"]
)


@router.get("/live")
def get_live_monitor():
    """
    Returns simulated live patient vitals.
    """

    return monitor.get_live_vitals()