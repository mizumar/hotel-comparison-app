import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchForm } from "../SearchForm";

describe("src/components/SearchForm.tsx", () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 【3-1】 初期表示 & バリデーション
  it("[3-1] 未入力時は送信ボタンが disabled であること", () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    const button = screen.getByRole("button", { name: "検索" });
    expect(button).toBeDisabled();
  });

  // 【3-2】 フォーム送信
  it("[3-2] キーワード入力後に送信ボタン押下で onSearch が正しく呼ばれること", async () => {
    const user = userEvent.setup();
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    const input =
      screen.getByPlaceholderText("地名や駅名を入力（例: 仙台、東京）");
    const button = screen.getByRole("button", { name: "検索" });

    // キーワードを入力
    await user.type(input, "仙台");
    expect(button).not.toBeDisabled();

    // フォーム送信
    await user.click(button);
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith("仙台");
  });
});
