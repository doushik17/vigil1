from app.monitor.simulator import monitor


def get_live_monitor():
    """
    Return simulated live patient vitals.
    """

    return {
        "success": True,
        "monitor": monitor.get_live_vitals()
    }