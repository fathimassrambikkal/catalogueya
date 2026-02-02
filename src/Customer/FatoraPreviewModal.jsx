import React from "react";

export default function InvoicePreviewModal({ open, onClose, invoice }) {
  if (!open || !invoice) return null;

  const {
    company,
    number,
    date,
    time,
    amount,
    seller = {},
    billedTo = {},
    products = [],
    services = [],
    discount = "00 %",
    note = "",
  } = invoice;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-[clamp(8px,2vw,16px)]">
        <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">
        {/* CLOSE BUTTON - Apple-style */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/95 hover:bg-gray-50 border border-gray-200 shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 group"
          aria-label="Close preview"
        >
          <span className="text-lg text-gray-500 group-hover:text-gray-700 transition-colors">×</span>
        </button>

        <div className="overflow-y-auto max-h-[90vh] p-[clamp(12px,3vw,40px)]">

          {/* HEADER */}
          <div className="mb-[clamp(20px,5vw,32px)]">
            <div className="flex flex-col lg:flex-row justify-between gap-[clamp(16px,4vw,24px)]">

              {/* LEFT SECTION */}
              <div className="lg:flex-1">
                <h1 className="font-bold text-[clamp(28px,7vw,48px)] text-gray-900 mb-[clamp(16px,4vw,16px)]">
                  Bills
                </h1>

                {/* COMPANY INFO */}
                <div className="mb-[clamp(20px,5vw,24px)]">
                  <h2 className="font-semibold text-[clamp(18px,5vw,24px)] text-gray-800 mb-[clamp(8px,2vw,8px)]">
                    {company}
                  </h2>
                  <div className="space-y-[clamp(2px,0.5vw,4px)] text-gray-600">
                    <p className="text-[clamp(13px,3.5vw,16px)]">
                      <span className="font-medium">Address:</span> {seller.address}
                    </p>
                    <p className="text-[clamp(13px,3.5vw,16px)]">
                      <span className="font-medium">Email:</span> {seller.email}
                    </p>
                    <p className="text-[clamp(13px,3.5vw,16px)]">
                      <span className="font-medium">Phone:</span> {seller.phone}
                    </p>
                  </div>
                </div>

                {/* MOBILE: INVOICE DETAILS & LOGO */}
                <div className="block lg:hidden mb-[clamp(20px,4vw,20px)]">
                  <div className="flex items-center justify-between mb-[clamp(16px,4vw,20px)]">
                    <div className="space-y-[clamp(2px,0.5vw,4px)] text-gray-700">
                      <p className="text-[clamp(13px,3.5vw,16px)]">
                        <span className="font-semibold">Invoice No:</span> {number}
                      </p>
                      <p className="text-[clamp(13px,3.5vw,16px)]">
                        <span className="font-semibold">Date:</span> {date}
                      </p>
                      <p className="text-[clamp(13px,3.5vw,16px)]">
                        <span className="font-semibold">Time:</span> {time}
                      </p>
                    </div>
                    <div className="w-[clamp(80px,20vw,120px)] h-[clamp(60px,15vw,80px)] bg-gray-100 border-2 border-dashed border-gray-300 rounded-[clamp(8px,2vw,12px)] flex items-center justify-center text-gray-500 text-[clamp(11px,3vw,14px)]">
                      Company Logo
                    </div>
                  </div>
                </div>

                {/* BILLED TO */}
                <div className="bg-gray-50 rounded-[clamp(8px,2vw,12px)] p-[clamp(12px,3vw,16px)] border border-gray-200">
                  <div className="font-semibold text-gray-700 mb-[clamp(8px,2vw,8px)] text-[clamp(14px,4vw,16px)]">
                    Billed To
                  </div>
                  <div className="space-y-[clamp(2px,0.5vw,4px)] text-gray-600">
                    <p className="text-[clamp(13px,3.5vw,16px)]">
                      <span className="font-medium">Name:</span> {billedTo.name}
                    </p>
                    <p className="text-[clamp(13px,3.5vw,16px)]">
                      <span className="font-medium">Email:</span> {billedTo.email}
                    </p>
                    <p className="text-[clamp(13px,3.5vw,16px)]">
                      <span className="font-medium">Phone:</span> {billedTo.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT SECTION (DESKTOP ONLY) */}
              <div className="hidden lg:flex flex-col items-end w-[clamp(200px,25vw,288px)]">
                <div className="mb-[clamp(20px,5vw,24px)] w-[clamp(120px,15vw,180px)] h-[clamp(80px,10vw,100px)] bg-gray-100 border-2 border-dashed border-gray-300 rounded-[clamp(8px,2vw,12px)] flex items-center justify-center text-gray-500 text-[clamp(12px,3vw,14px)]">
                  Company Logo
                </div>
                <div className="space-y-[clamp(2px,0.5vw,4px)] text-right text-gray-700">
                  <p className="text-[clamp(14px,4vw,16px)]">
                    <span className="font-semibold">Invoice No:</span> {number}
                  </p>
                  <p className="text-[clamp(14px,4vw,16px)]">
                    <span className="font-semibold">Date:</span> {date}
                  </p>
                  <p className="text-[clamp(14px,4vw,16px)]">
                    <span className="font-semibold">Time:</span> {time}
                  </p>
                </div>
              </div>

            </div>
          </div>

          <hr className="my-[clamp(20px,5vw,32px)] border-gray-300" />
{/* PRODUCTS TABLE */}
<div className="mb-[clamp(20px,5vw,32px)] overflow-x-hidden">
  <table className="w-full border-collapse table-fixed">
    <thead>
      <tr className="bg-gray-100 border-b-2">
        <th className="text-left p-[clamp(4px,1.5vw,12px)] text-[clamp(10px,2vw,14px)] font-semibold">
          Product
        </th>
        <th className="text-center p-[clamp(4px,1.5vw,12px)] text-[clamp(10px,2vw,14px)] font-semibold">
          Unit
        </th>
        <th className="text-center p-[clamp(4px,1.5vw,12px)] text-[clamp(10px,2vw,14px)] font-semibold">
          Price / 1
        </th>
        <th className="text-center p-[clamp(4px,1.5vw,12px)] text-[clamp(10px,2vw,14px)] font-semibold">
          Qty
        </th>
        <th className="text-right p-[clamp(4px,1.5vw,12px)] text-[clamp(10px,2vw,14px)] font-semibold">
          Total
        </th>
      </tr>
    </thead>

    <tbody>
      {products.map((p, i) => (
        <tr key={i} className="border-b">
          <td className="p-[clamp(4px,1.5vw,12px)] text-[clamp(10px,3.5vw,15px)] truncate">
            {i + 1}. {p.name}
          </td>

          <td className="p-[clamp(4px,1.5vw,12px)] text-center text-[clamp(10px,3.5vw,15px)]">
            {p.unit}
          </td>

          <td className="p-[clamp(4px,1.5vw,12px)] text-center text-[clamp(10px,3.5vw,15px)] whitespace-nowrap">
            {p.price}
          </td>

          <td className="p-[clamp(4px,1.5vw,12px)] text-center text-[clamp(10px,3.5vw,15px)]">
            {p.quantity}
          </td>

          <td className="p-[clamp(4px,1.5vw,12px)] text-right text-[clamp(10px,3.5vw,15px)] whitespace-nowrap">
            {p.total}
          </td>
        </tr>
      ))}

      {products.length === 0 && (
        <tr>
          <td
            colSpan="5"
            className="p-[clamp(8px,2vw,16px)] text-center text-gray-500 text-[clamp(11px,3.5vw,15px)]"
          >
            No products listed
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


          {/* SERVICES TABLE */}
          <div className="mb-[clamp(20px,5vw,32px)] ">
            <table className="w-full border-collapse min-w-[clamp(300px,100%,640px)]">
              <thead>
                <tr className="bg-gray-100 border-b-2">
                  <th colSpan="5" className="text-left p-[clamp(8px,2vw,16px)] text-[clamp(12px,3vw,14px)] font-semibold">
                    Service(s)
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((s, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-[clamp(8px,2vw,16px)] text-[clamp(13px,3.5vw,16px)]">
                      {i + 1}- {s.name}
                    </td>
                    <td colSpan="3"></td>
                    <td className="p-[clamp(8px,2vw,16px)] text-right text-[clamp(13px,3.5vw,16px)]">
                      {s.total}
                    </td>
                  </tr>
                ))}
                {services.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-[clamp(12px,3vw,16px)] text-center text-gray-500 text-[clamp(13px,3.5vw,16px)]">
                      No services listed
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* DISCOUNT SECTION */}
          <div className="bg-gray-100 p-[clamp(12px,3vw,16px)] mb-[clamp(16px,4vw,24px)] flex justify-between items-center rounded-[clamp(6px,1.5vw,8px)]">
            <span className="font-semibold text-[clamp(14px,4vw,16px)]">Special Discount</span>
            <span className="font-semibold text-[clamp(14px,4vw,16px)]">{discount}</span>
          </div>

          {/* TOTAL AMOUNT */}
          <div className="bg-gray-100 p-[clamp(12px,3vw,16px)] mb-[clamp(20px,5vw,24px)] flex justify-between items-center rounded-[clamp(6px,1.5vw,8px)]">
            <span className="font-semibold text-[clamp(16px,4.5vw,18px)]">Total Amount</span>
            <span className="font-bold text-[clamp(18px,5vw,20px)]">{amount}</span>
          </div>

          {/* SPECIAL NOTE */}
          <div className="border p-[clamp(12px,3vw,16px)] mb-[clamp(24px,6vw,32px)] rounded-[clamp(8px,2vw,12px)]">
            <div className="font-semibold mb-[clamp(8px,2vw,8px)] text-[clamp(14px,4vw,16px)]">Special Note</div>
            <div className="text-[clamp(13px,3.5vw,16px)] text-gray-700">
              {note || "No special notes provided."}
            </div>
          </div>

          {/* PRINT BUTTON */}
          <div className="flex justify-center">
            <button className="
              bg-blue-600 text-white 
              px-[clamp(24px,6vw,32px)] 
              py-[clamp(10px,2.5vw,12px)]
              rounded-[clamp(8px,2vw,12px)]
              text-[clamp(14px,4vw,16px)] 
              font-medium
              hover:bg-blue-700 
              transition-colors
              active:scale-[0.98]
            ">
              Print Bill
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}