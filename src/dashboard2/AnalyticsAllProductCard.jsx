import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ViewsIcon,
  SoldIcon,
  HeartIcon,
  ShareIcon,
  InfoIcon,
} from "./AnalyticsIcons";

const products = [
  {
    id: 1,
    name: "Golden Barrel Cactus",
    image: "https://via.placeholder.com/48",
    addedOn: "12/10/2025",
    views: 67,
    sold: 5,
    fav: 24,
    shares: 26,
  },
  {
    id: 2,
    name: "Cycas in Kolambi Pot",
    image: "https://via.placeholder.com/48",
    addedOn: "24/10/2025",
    views: 56,
    sold: 2,
    fav: 23,
    shares: 26,
  },
  {
    id: 3,
    name: "Epidendrum Orchid",
    image: "https://via.placeholder.com/48",
    addedOn: "07/11/2025",
    views: 47,
    sold: 2,
    fav: 20,
    shares: 26,
  },
  {
    id: 4,
    name: "Hibiscus Pink",
    image: "https://via.placeholder.com/48",
    addedOn: "12/11/2025",
    views: 67,
    sold: 5,
    fav: 24,
    shares: 26,
  },
];

function AnalyticsAllProductCard() {
  const navigate = useNavigate();

  return (
    <div className="relative rounded-3xl bg-white/80 backdrop-blur-xl border border-gray-200/60 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-5 py-3 border-b border-gray-200/60">
        <h3 className="text-[15px] sm:text-[17px] font-semibold text-gray-900">
          Products Analytics
        </h3>
        <p className="text-[11px] text-gray-500">
          Last 7 days · All products
        </p>
      </div>

      <table className="w-full text-sm">
        {/* Desktop Header */}
        <thead className="hidden sm:table-header-group">
          <tr className="text-[11px] text-gray-500 uppercase tracking-wide">
            <th className="px-5 py-2.5 text-left">Product</th>
            <th className="px-3 py-2.5 text-center">
              <HeaderIcon icon={ViewsIcon} label="Views" />
            </th>
            <th className="px-3 py-2.5 text-center">
              <HeaderIcon icon={SoldIcon} label="Sold" />
            </th>
            <th className="px-3 py-2.5 text-center">
              <HeaderIcon icon={HeartIcon} label="Fav" />
            </th>
            <th className="px-3 py-2.5 text-center">
              <HeaderIcon icon={ShareIcon} label="Share" />
            </th>
            <th className="px-5 py-2.5 text-right">
              <InfoIcon className="w-4 h-4 inline text-blue-600" />
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr
              key={p.id}
              className="border-t border-gray-200/40 hover:bg-blue-50/30 transition"
            >
              <td className="px-4 sm:px-5 py-3">
                <div className="flex gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-11 h-11 sm:w-9 sm:h-9 rounded-lg object-cover border border-gray-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    {/* NAME + DETAILS */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[13px] font-medium text-gray-900 truncate block">
                          {p.name}
                        </span>

                        {/* ✅ Added date */}
                        <span className="text-[10px] text-gray-500">
                          Added on {p.addedOn}
                        </span>
                      </div>

                      {/* Mobile details */}
                      <button
                        onClick={() =>
                          navigate(`/dashboard/products/${p.id}`)
                        }
                        className="sm:hidden text-[11px] font-medium text-blue-600 shrink-0"
                      >
                        Details →
                      </button>
                    </div>

                    {/* MOBILE STATS */}
                    <div className="mt-2 grid grid-cols-4 gap-1.5 sm:hidden">
                      <MobileStat icon={ViewsIcon} label="Views" value={p.views} />
                      <MobileStat icon={SoldIcon} label="Sold" value={p.sold} />
                      <MobileStat icon={HeartIcon} label="Fav" value={p.fav} />
                      <MobileStat icon={ShareIcon} label="Share" value={p.shares} />
                    </div>
                  </div>
                </div>
              </td>

              {/* Desktop Stats */}
              <td className="hidden sm:table-cell px-3 text-center">{p.views}</td>
              <td className="hidden sm:table-cell px-3 text-center">{p.sold}</td>
              <td className="hidden sm:table-cell px-3 text-center">{p.fav}</td>
              <td className="hidden sm:table-cell px-3 text-center">{p.shares}</td>

              {/* Desktop Details */}
              <td className="hidden sm:table-cell px-5 text-right">
                <button
                  onClick={() => navigate(`/dashboard/products/${p.id}`)}
                  className="text-[11px] font-medium text-blue-600"
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div className="px-4 sm:px-5 py-2 border-t border-gray-200/50 text-[11px] text-gray-500 flex justify-between">
        <span>Showing {products.length} products</span>
        <span className="text-blue-600 font-medium cursor-pointer">
          View all →
        </span>
      </div>
    </div>
  );
}

/* ===== Desktop Header Icon ===== */
function HeaderIcon({ icon: Icon, label }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <span className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-50">
        <Icon className="w-4 h-4 text-blue-600" />
      </span>
      <span>{label}</span>
    </div>
  );
}

/* ===== Mobile Stat ===== */
function MobileStat({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col items-center text-[10px] text-gray-600">
      <span className="flex items-center justify-center w-5 h-5 rounded-md bg-blue-50">
        <Icon className="w-3 h-3 text-blue-600" />
      </span>
      <span>{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}

export default AnalyticsAllProductCard;
