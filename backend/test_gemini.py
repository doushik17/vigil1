from app.agent.llm import ask_gemini


def main():
    response = ask_gemini(
        "Say hello from VIGIL-OR in one sentence."
    )

    print("\nGemini response:")
    print(response)


if __name__ == "__main__":
    main()