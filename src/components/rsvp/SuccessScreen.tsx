export function SuccessScreen() {
  return (
    <div className="min-h-[300px] flex flex-col items-center justify-center bg-green-50 p-6 rounded-xl">
      <h1 className="text-3xl font-bold text-green-800 mb-2">🎉 All Set!</h1>
      <p className="text-green-700 mb-4">
        Your RSVP was submitted successfully. Thank you for your response!
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 cursor-pointer bg-stone-900 text-white rounded hover:bg-stone-700"
      >
        Submit another response
      </button>
    </div>
  );
}
