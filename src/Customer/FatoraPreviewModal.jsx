import React, { useEffect, useState } from "react";
import { getPublicBill } from "../api";

export default function InvoicePreviewModal({ open, onClose, publicToken }) {
  const [invoice, setInvoice] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!open || !publicToken) return;

    getPublicBill(publicToken).then((res) => {
      const { company, bill } = res.data;

      // ===== UPDATED LOGO HANDLING =====
      let logoObj = null;

      // Prefer top-level company.logo (already object)
      if (company?.logo) {
        logoObj = company.logo;
      }

      // Fallback: bill.company.logo (stringified JSON)
      if (!logoObj && bill?.company?.logo) {
        try {
          // Check if it's already an object or needs parsing
          if (typeof bill.company.logo === 'string') {
            logoObj = JSON.parse(bill.company.logo);
          } else {
            logoObj = bill.company.logo;
          }
        } catch (e) {
          console.log("Could not parse logo:", e);
          logoObj = null;
        }
      }

      // Construct the correct logo URL - UPDATED
      let logoUrl = null;
      if (logoObj?.webp) {
        // Check if the path is already a full URL
        if (logoObj.webp.startsWith('http')) {
          logoUrl = logoObj.webp;
        } else {
          // If it's a relative path, construct the full URL
          // Remove leading slash if present to avoid double slash
          const cleanPath = logoObj.webp.startsWith('/') 
            ? logoObj.webp.substring(1) 
            : logoObj.webp;
          logoUrl = `https://catalogueyanew.com.awu.zxu.temporary.site/${cleanPath}`;
        }
      } else if (logoObj?.avif) {
        // Fallback to avif if webp not available
        if (logoObj.avif.startsWith('http')) {
          logoUrl = logoObj.avif;
        } else {
          const cleanPath = logoObj.avif.startsWith('/') 
            ? logoObj.avif.substring(1) 
            : logoObj.avif;
          logoUrl = `https://catalogueyanew.com.awu.zxu.temporary.site/${cleanPath}`;
        }
      }

      const issuedDate = new Date(bill.issued_at);

      // 🔁 Backend → UI mapping ONLY
      const products = bill.items
        .filter((item) => item.type === "product")
        .map((item) => ({
          name: item.title,
          unit: item.unit_name,
          price: `${bill.currency} ${item.unit_price}`,
          quantity: item.quantity,
          total: `${bill.currency} ${item.line_total}`,
        }));

      const services = bill.items
        .filter((item) => item.type === "service")
        .map((item) => ({
          name: item.title,
          total: `${bill.currency} ${item.line_total}`,
        }));

      setInvoice({
        company: company?.name || bill.company?.name_en || "",
        number: bill.bill_number,
        logo: logoUrl, // Use the constructed URL
        date: issuedDate.toLocaleDateString(),
        time: issuedDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        amount: `${bill.currency} ${bill.total_amount}`,

        seller: {
          address: company?.address || "-",
          email: company?.email || "-",
          phone: company?.phone || "-",
        },

        billedTo: {
          name: bill.customer_name,
          email: bill.customer_email,
          phone: bill.customer_phone,
        },

        products,
        services,

        discount: bill.discount_percent
          ? `${bill.discount_percent} %`
          : "00 %",

        note: bill.note || "",
      });
    });
  }, [open, publicToken]);

  if (!open || !invoice) return null;

  const {
    company,
    number,
    logo,
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
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white w-full max-w-[min(896px,calc(100vw-16px))] rounded-lg sm:rounded-xl lg:rounded-2xl shadow-2xl overflow-hidden mx-auto">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="
            absolute
            top-2 sm:top-3 md:top-4 lg:top-6
            right-2 sm:right-3 md:right-4 lg:right-6
            z-20
            w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10
            rounded-full
            bg-white/95
            hover:bg-gray-50
            border
            border-gray-200
            shadow-lg
            flex
            items-center
            justify-center
            transition-all
            duration-200
            hover:scale-105
            active:scale-95
          "
          aria-label="Close preview"
        >
          <span className="text-lg sm:text-xl md:text-2xl text-gray-500">×</span>
        </button>

        <div className="overflow-y-auto max-h-[90vh] p-3 sm:p-4 md:p-6 lg:p-8">
          {/* HEADER */}
          <div className="mb-4 sm:mb-6 md:mb-8 lg:mb-10 mt-24 md:mt-4">
            <div className="flex flex-col lg:flex-row justify-between gap-4 sm:gap-6 md:gap-8">
              {/* LEFT SECTION */}
              <div className="lg:flex-1">
                <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-900 mb-3 sm:mb-4">
                  Bill
                </h1>

                {/* COMPANY INFO */}
                <div className="mb-4 sm:mb-6">
                  <h2 className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl text-gray-800 mb-2 sm:mb-3">
                    {company}
                  </h2>

                  <div className="space-y-1 text-gray-600 text-xs sm:text-sm md:text-base">
                    <p className="break-words">
                      <span className="font-medium">Address:</span> {seller.address}
                    </p>
                    <p className="break-all">
                      <span className="font-medium">Email:</span> {seller.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span> {seller.phone}
                    </p>
                  </div>
                </div>

                {/* MOBILE DETAILS & LOGO */}
                <div className="block lg:hidden mb-4 sm:mb-6">
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="space-y-1 text-gray-700 text-xs sm:text-sm flex-1">
                      <p><b>Invoice No:</b> {number}</p>
                      <p><b>Date:</b> {date}</p>
                      <p><b>Time:</b> {time}</p>
                    </div>

                    {/* MOBILE LOGO */}
                    <div
                      className="
                        w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
                        bg-gray-100
                        border
                        border-dashed
                        border-gray-300
                        rounded-md sm:rounded-lg
                        flex
                        items-center
                        justify-center
                        overflow-hidden
                        flex-shrink-0
                      "
                    >
                      {logo ? (
                        <img
                          src={logo}
                          alt={company}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="text-gray-500 text-xs sm:text-sm text-center px-1">
                          No Logo
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* BILLED TO */}
                <div className="bg-gray-50 rounded-md sm:rounded-lg p-3 sm:p-4 border">
                  <div className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">
                    Billed To
                  </div>
                  <div className="text-xs sm:text-sm space-y-1">
                    <p className="break-words"><b>Name:</b> {billedTo.name}</p>
                    <p className="break-all"><b>Email:</b> {billedTo.email}</p>
                    <p><b>Phone:</b> {billedTo.phone}</p>
                  </div>
                </div>
              </div>

              {/* RIGHT SECTION - DESKTOP */}
              <div className="hidden lg:flex flex-col items-end">
                <div
                  className="
                    mb-4 lg:mb-6
                    w-24 h-24 lg:w-28 lg:h-28
                    bg-gray-100
                    border
                    border-dashed
                    border-gray-300
                    rounded-lg
                    flex
                    items-center
                    justify-center
                    overflow-hidden
                  "
                >
                  {logo ? (
                    <img
                      src={logo}
                      alt={company}
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">
                      Company Logo
                    </span>
                  )}
                </div>

                <div className="text-right text-sm lg:text-base space-y-1">
                  <p><b>Invoice No:</b> {number}</p>
                  <p><b>Date:</b> {date}</p>
                  <p><b>Time:</b> {time}</p>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-4 sm:my-6 md:my-8 border-gray-300" />

          {/* PRODUCTS SECTION - ENTERPRISE RESPONSIVE */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="font-semibold text-base sm:text-lg md:text-xl mb-2 sm:mb-3">
              Products
            </div>
            
            {products.length > 0 ? (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left font-semibold text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3">
                          Product
                        </th>
                        <th className="text-center font-semibold text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3">
                          Unit
                        </th>
                        <th className="text-center font-semibold text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap">
                          Price / 1
                        </th>
                        <th className="text-center font-semibold text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3">
                          Qty
                        </th>
                        <th className="text-right font-semibold text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="text-left text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3 truncate max-w-[150px]">
                            {i + 1}. {p.name}
                          </td>
                          <td className="text-center text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3">
                            {p.unit}
                          </td>
                          <td className="text-center text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap">
                            {p.price}
                          </td>
                          <td className="text-center text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3">
                            {p.quantity}
                          </td>
                          <td className="text-right text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap font-medium">
                            {p.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {products.map((p, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3 border">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-sm">
                          {i + 1}. {p.name}
                        </div>
                        <div className="text-sm font-semibold">
                          {p.total}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                        <div>
                          <span className="font-medium">Unit:</span> {p.unit}
                        </div>
                        <div className="text-center">
                          <span className="font-medium">Price:</span> {p.price}
                        </div>
                        <div className="text-right">
                          <span className="font-medium">Qty:</span> {p.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-4 sm:py-6 text-sm sm:text-base">
                No products listed
              </div>
            )}
          </div>

          {/* SERVICES SECTION - ENTERPRISE RESPONSIVE */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="font-semibold text-base sm:text-lg md:text-xl mb-2 sm:mb-3">
              Services
            </div>
            
            {services.length > 0 ? (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left font-semibold text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3">
                          Service
                        </th>
                        <th className="text-right font-semibold text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((s, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="text-left text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3 truncate max-w-[200px]">
                            {i + 1}. {s.name}
                          </td>
                          <td className="text-right text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3 font-medium">
                            {s.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {services.map((s, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3 border">
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-sm truncate flex-1 mr-2">
                          {i + 1}. {s.name}
                        </div>
                        <div className="text-sm font-semibold whitespace-nowrap">
                          {s.total}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-4 sm:py-6 text-sm sm:text-base">
                No services listed
              </div>
            )}
          </div>

          {/* DISCOUNT */}
          <div className="bg-gray-100 mb-4 sm:mb-6 px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center rounded-md sm:rounded-lg">
            <span className="font-semibold text-sm sm:text-base">
              Special Discount
            </span>
            <span className="font-semibold text-sm sm:text-base">
              {discount}
            </span>
          </div>

          {/* TOTAL */}
          <div className="bg-gray-100 mb-4 sm:mb-6 md:mb-8 px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center rounded-md sm:rounded-lg">
            <span className="font-semibold text-base sm:text-lg md:text-xl">
              Total Amount
            </span>
            <span className="font-bold text-lg sm:text-xl md:text-2xl whitespace-nowrap">
              {amount}
            </span>
          </div>

          {/* NOTE */}
          <div className="border mb-4 sm:mb-6 md:mb-8 px-3 sm:px-4 py-3 sm:py-4 rounded-md sm:rounded-lg">
            <div className="font-semibold mb-2 text-sm sm:text-base">
              Special Note
            </div>
            <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
              {note || "No special notes provided."}
            </p>
          </div>

          {/* PRINT BUTTON */}
          <div className="flex justify-center">
            <button
              className="
                bg-blue-600 text-white
                px-6 sm:px-8 md:px-10
                py-2 sm:py-3
                rounded-md sm:rounded-lg
                text-sm sm:text-base md:text-lg
                font-medium
                hover:bg-blue-700
                transition-all
                active:scale-95
                w-full sm:w-auto
              "
              onClick={() => window.print()}
            >
              Print Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}