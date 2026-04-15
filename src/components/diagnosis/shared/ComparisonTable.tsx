type Row = {
  label: string;
  left: string;
  right: string;
  highlight?: 'left' | 'right';
};

type Props = {
  leftHeader: string;
  rightHeader: string;
  rows: Row[];
};

export default function ComparisonTable({ leftHeader, rightHeader, rows }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left px-4 py-3 font-semibold text-gray-600 w-28">項目</th>
            <th className="text-center px-4 py-3 font-semibold text-gray-800">{leftHeader}</th>
            <th className="text-center px-4 py-3 font-semibold text-gray-800">{rightHeader}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-4 py-3 text-gray-600 font-medium">{row.label}</td>
              <td
                className={`px-4 py-3 text-center font-medium ${
                  row.highlight === 'left'
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-gray-800'
                }`}
              >
                {row.left}
              </td>
              <td
                className={`px-4 py-3 text-center font-medium ${
                  row.highlight === 'right'
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-gray-800'
                }`}
              >
                {row.right}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
