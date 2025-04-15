const UserTransactionsTable = ({ investments }) => (
  <div className="bg-white shadow rounded-xl p-4 mt-6">
    <h3 className="text-lg font-semibold mb-3">Recent Transactions</h3>
    <table className="w-full text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Date</th>
          <th className="p-2 text-left">Amount</th>
          <th className="p-2 text-left">Bank</th>
          <th className="p-2 text-left">UTR</th>
          <th className="p-2 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {investments.map((inv, idx) => (
          <tr key={idx} className="border-t">
            <td className="p-2">{inv.date}</td>
            <td className="p-2">₹{inv.amount}</td>
            <td className="p-2">{inv.bank}</td>
            <td className="p-2">{inv.utr}</td>
            <td className="p-2">{inv.status || 'Pending'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default UserTransactionsTable;
