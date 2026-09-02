from app.graph.workflow import run_workflow

print("=" * 60)
print("TEST 1: Patient Tool")
print("=" * 60)

result = run_workflow("Show patient PAT-101")
print(result)

print("\n")

print("=" * 60)
print("TEST 2: RAG Tool")
print("=" * 60)

result = run_workflow("Show blood report")
print(result)

print("\n")

print("=" * 60)
print("TEST 3: Monitor Tool")
print("=" * 60)

result = run_workflow("Show live monitor")
print(result)