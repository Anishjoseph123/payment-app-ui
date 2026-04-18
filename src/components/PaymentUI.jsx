import { useState } from "react";
import { SuccessScreen } from "./SuccessScreen";
import QRScanner from "./QRScanner";

// Convert number to words (basic version)
const numberToWords = (num) => {
  if (!num) return "Zero";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const convert = (n) => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + " " + ones[n % 10];
    if (n < 1000)
      return ones[Math.floor(n / 100)] + " Hundred " + convert(n % 100);
    if (n < 100000)
      return convert(Math.floor(n / 1000)) + " Thousand " + convert(n % 1000);
    return n;
  };

  return convert(num) + " Only";
};

export default function PaymentUI() {
  const [expression, setExpression] = useState("");
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState("");
  const [screen, setScreen] = useState("payment");
  // "payment" | "scanner" | "success"

  const evaluate = (exp) => {
    try {
      const result = eval(exp.replace(/[^0-9+]/g, ""));
      return result || 0;
    } catch {
      return 0;
    }
  };

  const handleClick = (val) => {
    setError("");

    if (val === "x") {
      const updated = expression.slice(0, -1);
      setExpression(updated);
      setAmount(evaluate(updated));
      return;
    }

    if (val === "+") {
      if (expression.endsWith("+")) return;
    }

    const updated = expression + val;
    setExpression(updated);
    setAmount(evaluate(updated));
  };

  //   const handlePay = () => {
  //     if (!amount || amount <= 0) {
  //       setError("Enter a valid amount");
  //       return;
  //     }
  //     if (amount > 100000) {
  //       setError("Amount exceeds limit");
  //       return;
  //     }

  //     alert(`Processing ₹${amount}`);
  //   };
  const vibrate = (type = "light") => {
    if (!navigator.vibrate) return;

    if (type === "light") navigator.vibrate(30);
    if (type === "medium") navigator.vibrate(60);
    if (type === "success") navigator.vibrate([30, 50, 30]);
  };

  const handlePay = (key) => {
    if (!amount || amount <= 0) {
      setError("Enter a valid amount");
      return;
    }

    // 🔊 feedback
    vibrate("success");
    handleClick(key);

    // ⏭ go to success screen
    setScreen("success");
  };

  const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "0", "x"];

  if (screen === "scanner") {
    return (
      <QRScanner
        onScan={(data) => {
          console.log("QR Data:", data);

          // Example: parse amount from QR (basic)
          const match = data.match(/am=(\d+)/);
          if (match) {
            setAmount(parseInt(match[1]));
            setExpression(match[1]);
          }

          setScreen("payment");
        }}
      />
    );
  }

  if (screen === "success") {
    return (
      <SuccessScreen
        amount={amount}
        onDone={() => {
          setExpression("");
          setAmount(0);
          setScreen("payment");
        }}
      />
    );
  }
  if (screen === "payment") {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="w-[360px] bg-white rounded-2xl shadow-lg p-4">
          <button
            onClick={() => setScreen("scanner")}
            className="mb-3 w-full bg-gray-200 py-2 rounded-full"
          >
            📷 Scan QR Code
          </button>
          {/* Header */}
          <div className="text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
              💳
            </div>
            <h2 className="font-semibold text-lg">Subhalaxmi Omfed</h2>
            <p className="text-gray-500 text-sm flex justify-center items-center gap-1">
              user@upi
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6f/UPI-Logo-vector.svg"
                alt="upi"
                className="h-4"
              />
            </p>
          </div>

          {/* Amount */}
          <div className="text-center my-6 transition-all duration-300">
            <h1 className="text-5xl font-bold animate-pulse">₹{amount}</h1>

            <p className="text-gray-500 text-sm mt-2 min-h-[20px]">
              {expression || "Enter amount"}
            </p>

            <p className="text-gray-400 text-xs mt-1 px-4">
              Rupees {numberToWords(amount)}
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center mb-2">{error}</p>
          )}

          {/* Add Message */}
          <input
            type="text"
            placeholder="+ Add Message"
            className="border border-dashed rounded-full py-2 text-center text-gray-500 mb-4 ml-16"
          />

          {/* Button */}
          <button
            onClick={handlePay}
            className="w-full bg-blue-700 text-white py-3 rounded-full font-medium mb-4 active:scale-95 transition"
          >
            Proceed Securely
          </button>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3">
            {keypad.map((key, index) => (
              <button
                key={index}
                onClick={() => handleClick(key)}
                className="bg-gray-200 py-4 rounded-xl text-lg font-medium active:scale-90 transition"
              >
                {key === "x" ? "⌫" : key}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
