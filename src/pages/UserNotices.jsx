const UserNotices = ({ notices }) => {
  if (!notices.length) return null;

  return (
    <div className="bg-white shadow rounded-xl p-4 mt-6">
      <h3 className="text-lg font-semibold mb-3">SEBI Notices</h3>
      <ul className="space-y-2">
        {notices.map((n) => (
          <li key={n.id} className="border-b pb-2">
            <p className="font-medium">{n.title}</p>
            <p className="text-sm text-gray-600">{n.content}</p>
            <p className="text-xs text-gray-400">Issued: {n.issued_at?.split('T')[0]}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserNotices;
