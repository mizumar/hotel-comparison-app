import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SearchForm } from "../SearchForm";

describe("SearchForm コンポーネント", () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  test("【TC-SF-01】初期表示時にキーワード検索タブがアクティブになっていること", () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    // キーワード入力欄と送信ボタンが表示されていること
    expect(screen.getByTestId("keyword-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();

    // 空室検索側の要素が表示されていないこと
    expect(screen.queryByTestId("area-select")).not.toBeInTheDocument();
    expect(screen.queryByTestId("checkin-input")).not.toBeInTheDocument();
  });

  test("【TC-SF-02】「日程・空室検索」タブ切り替え時に該当フォームが表示されること", () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    // 空室検索タブをクリック
    fireEvent.click(screen.getByTestId("tab-vacant"));

    // 空室検索用の入力項目が表示されること
    expect(screen.getByTestId("area-select")).toBeInTheDocument();
    expect(screen.getByTestId("checkin-input")).toBeInTheDocument();
    expect(screen.getByTestId("checkout-input")).toBeInTheDocument();
    expect(screen.getByTestId("adult-num-select")).toBeInTheDocument();

    // キーワード入力欄が非表示になること
    expect(screen.queryByTestId("keyword-input")).not.toBeInTheDocument();
  });

  test("【TC-SF-03】キーワード検索フォームから正常に検索条件が送信されること", () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    const keywordInput = screen.getByTestId("keyword-input");
    const submitButton = screen.getByTestId("submit-button");

    // キーワードを入力
    fireEvent.change(keywordInput, { target: { value: "仙台" } });
    fireEvent.click(submitButton);

    // onSearch が正しい引数で呼ばれたか検証
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith({
      keyword: "仙台",
    });
  });

  test("【TC-SF-04】空室検索フォームからエリア・日付・人数の条件が送信されること", () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    // タブ切り替え
    fireEvent.click(screen.getByTestId("tab-vacant"));

    // 入力項目を変更
    fireEvent.change(screen.getByTestId("area-select"), {
      target: { value: "tazawa" }, // 秋田県（田沢）
    });
    fireEvent.change(screen.getByTestId("checkin-input"), {
      target: { value: "2026-10-01" },
    });
    fireEvent.change(screen.getByTestId("checkout-input"), {
      target: { value: "2026-10-02" },
    });
    fireEvent.change(screen.getByTestId("adult-num-select"), {
      target: { value: "2" },
    });

    // フォーム送信
    fireEvent.click(screen.getByTestId("submit-button"));

    // onSearch が選択した小区分コード対応のエリアパラメータで呼ばれること
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith({
      largeClassCode: "japan",
      middleClassCode: "akita",
      smallClassCode: "tazawa",
      checkinDate: "2026-10-01",
      checkoutDate: "2026-10-02",
      adultNum: 2,
    });
  });

  test("【TC-SF-05】isLoading が true の場合に各フィールドとボタンが非活性になること", () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={true} />);

    // キーワードタブの検証
    expect(screen.getByTestId("keyword-input")).toBeDisabled();
    expect(screen.getByTestId("submit-button")).toBeDisabled();
    expect(screen.getByTestId("submit-button")).toHaveTextContent("検索中...");

    // 空室検索タブの検証
    fireEvent.click(screen.getByTestId("tab-vacant"));
    expect(screen.getByTestId("area-select")).toBeDisabled();
    expect(screen.getByTestId("checkin-input")).toBeDisabled();
    expect(screen.getByTestId("checkout-input")).toBeDisabled();
    expect(screen.getByTestId("adult-num-select")).toBeDisabled();
  });

  test("【TC-SF-06】料金・ソート条件を指定して空室検索を正常に送信できること", () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    // 空室検索タブに切り替え
    fireEvent.click(screen.getByTestId("tab-vacant"));

    // エリア・日付・人数を入力
    fireEvent.change(screen.getByTestId("area-select"), {
      target: { value: "tazawa" }, // 秋田県（田沢）
    });
    fireEvent.change(screen.getByTestId("checkin-input"), {
      target: { value: "2026-10-01" },
    });
    fireEvent.change(screen.getByTestId("checkout-input"), {
      target: { value: "2026-10-02" },
    });
    fireEvent.change(screen.getByTestId("adult-num-select"), {
      target: { value: "2" },
    });

    // 料金条件（最低・最高）およびソート（料金が安い順）を入力
    fireEvent.change(screen.getByTestId("min-charge-input"), {
      target: { value: "5000" },
    });
    fireEvent.change(screen.getByTestId("max-charge-input"), {
      target: { value: "20000" },
    });
    fireEvent.change(screen.getByTestId("sort-select"), {
      target: { value: "+roomCharge" },
    });

    // フォーム送信
    fireEvent.click(screen.getByTestId("submit-button"));

    // onSearch が料金・ソートパラメータを含んで呼び出されること
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith({
      largeClassCode: "japan",
      middleClassCode: "akita",
      smallClassCode: "tazawa",
      checkinDate: "2026-10-01",
      checkoutDate: "2026-10-02",
      adultNum: 2,
      minCharge: 5000,
      maxCharge: 20000,
      sort: "+roomCharge",
    });
  });

  test("【TC-SF-07】料金未入力・ソート「標準」の場合に該当パラメータが undefined で送信されること", () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    // 空室検索タブに切り替え
    fireEvent.click(screen.getByTestId("tab-vacant"));

    // 必須項目の日付のみ入力（料金は未入力、ソートは初期値の standard）
    fireEvent.change(screen.getByTestId("checkin-input"), {
      target: { value: "2026-10-01" },
    });
    fireEvent.change(screen.getByTestId("checkout-input"), {
      target: { value: "2026-10-02" },
    });

    // フォーム送信
    fireEvent.click(screen.getByTestId("submit-button"));

    // minCharge, maxCharge, sort が undefined となって呼び出されること
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith({
      largeClassCode: "japan",
      middleClassCode: "tokyo",
      smallClassCode: "ritou",
      checkinDate: "2026-10-01",
      checkoutDate: "2026-10-02",
      adultNum: 2,
      minCharge: undefined,
      maxCharge: undefined,
      sort: undefined,
    });
  });
});
