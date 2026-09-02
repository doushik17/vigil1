from app.rag.retriever import search_documents


def search_reports(query: str):
    """
    Search medical reports using the FAISS index.
    """

    results = search_documents(query)

    return {
        "success": True,
        "results": results
    }