
export interface IMailable {
  constructor(
    view: string,
    data?: { [key: string]: string | number },
  );
  send(): Promise<any>;
  build(): void;
  setData(data: { [key: string]: string | number }): IMailable;
  setTo(to: string): IMailable;
  setFrom(from: string): IMailable;
  setSubject(subject: string): IMailable;
  setView(view: string): IMailable;
  render(data?: { [key: string]: string | number }): string;
  getViewContent(): string;
}