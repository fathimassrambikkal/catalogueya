export const resolveProductRoute = (product) => {
  if (!product?.id) return "/";

  switch (product.source) {
    case "new_arrivals":
    case "new_arrival_page":
      return `/newarrivalprofile/${product.id}`;

    case "sales":
    case "sales_page":
      return `/salesproduct/${product.id}`;

    default:
      // ✅ USE EXISTING ROUTE
      return `/product/${product.id}`;
  }
};
