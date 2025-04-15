const UserSummaryCard = ({ label, amount }) => (
  <div className="bg-white shadow rounded-xl p-4 text-center">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-xl font-bold text-blue-700">₹{(amount / 100000).toFixed(2)} L</p>
  </div>
);

export default UserSummaryCard;
