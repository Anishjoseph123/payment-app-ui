export function SuccessScreen({ amount, onDone }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <div className="bg-white p-6 rounded-2xl shadow text-center">
        <div className="text-6xl mb-4">✅</div>

        <h2 className="text-xl font-semibold">Payment Successful</h2>

        <p className="text-gray-500 mt-2">₹{amount} sent successfully</p>

        <button
          onClick={onDone}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-full"
        >
          Done
        </button>
      </div>
    </div>
  );
}
