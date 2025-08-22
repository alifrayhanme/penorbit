const DataTable = ({ headers, children, emptyMessage = "No data found." }) => (
  <div className="overflow-x-auto">
    {children ? (
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-50">
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-2 text-left">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    ) : (
      <p className="text-gray-600">{emptyMessage}</p>
    )}
  </div>
);

export default DataTable;