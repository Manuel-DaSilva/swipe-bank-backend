export const ColumnNumericTransformer = {
  to(data: number): string {
    return data.toString();
  },
  from(data: string): number {
    return parseFloat(data);
  },
};
