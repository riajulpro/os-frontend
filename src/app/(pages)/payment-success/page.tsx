import Link from "next/link";

export default function PaymentSuccess({
  searchParams: { amount },
}: {
  searchParams: { amount: string };
}) {
  return (
    <main className="max-w-6xl mx-auto p-10 text-center border border-green-400 m-10 rounded-md">
      <div className="mb-10">
        <p className="text-7xl mb-5">🎉</p>
        <h1 className="text-4xl font-extrabold mb-2 text-green-500">
          Congratulation!
        </h1>
        <h2 className="text-2xl">Your payment successfully received!</h2>

        <div className="p-5 text-green-500 mt-2 text-4xl font-bold">
          ${amount}
        </div>
        <Link href="/profile">
          <button className="p-3 rounded-xl bg-green-500 text-white hover:bg-green-600">
            Go to Profile
          </button>
        </Link>
      </div>
    </main>
  );
}
