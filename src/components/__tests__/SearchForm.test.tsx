import { render, screen, fireEvent } from "@testing-library/react";
import { SearchForm } from "@/src/components/SearchForm";

describe("SearchForm Component", () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  // TC-SF-01: 初期表示確認（キーワード入力とボタンのみ）
  test("TC-SF-01: renders keyword input and submit button", () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    expect(
      screen.getByPlaceholderText(/地名や駅名、ホテル名（例: 仙台、東京）/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /検索/i })).toBeInTheDocument();
  });

  // TC-SF-02: 正常送信（キーワード検索）
  test("TC-SF-02: calls onSearch with keyword when submitted", () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    const input =
      screen.getByPlaceholderText(/地名や駅名、ホテル名（例: 仙台、東京）/i);
    fireEvent.change(input, { target: { value: "仙台" } });

    fireEvent.click(screen.getByRole("button", { name: /検索/i }));

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith({ keyword: "仙台" });
  });

  // TC-SF-05: ローディング状態
  test("TC-SF-05: disables input and button when isLoading is true", () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={true} />);

    expect(screen.getByRole("button", { name: /検索中.../i })).toBeDisabled();
    expect(
      screen.getByPlaceholderText(/地名や駅名、ホテル名（例: 仙台、東京）/i),
    ).toBeDisabled();
  });
});
