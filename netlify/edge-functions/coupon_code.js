import {
	EleventyEdge,
	precompiledAppData,
} from "./_generated/eleventy-edge-app.js";

export default async (request, context) => {

  // Just return what was requested without transforming it, 
  // unless we fnd the coupon code query parameter
  const url = new URL(request.url);
  let coupon_code = null;
  if (!url.searchParams.get("coupon_code")) {
    return;
  } else {
    coupon_code = url.searchParams.get("coupon_code");
  }

  // Get the page content
  const response = await context.next();
  const page = await response.text();

  // Search for the placeholder
  const regex1 = /SET_PRICE/i;
  const regex2 = /LIST_PRICE/i;

  // Coupons
  const coupons = [
    { code: 'WPP', type:'I', newPrice: "19<small>.43</small>" },
    { code: 'PPPREQUEST', type:'I', newPrice: "7<small>.25</small>" }
];

let price = "29";

// Check if any coupon code is present in the query parameters and update the price
let foundCoupon = false;
coupons.forEach(coupon => {
    if (coupon_code === coupon.code) {
        price = coupon.newPrice;
        foundCoupon = true;
    }
});

if (!foundCoupon) return;

price = price + "&nbsp;<s>$29</s>"


  // Replace the content
  const updatedPage1 = page.replace(regex1, "YesSetPrice");
  const updatedPage2 = updatedPage1.replace(regex2, price);
  return new Response(updatedPage2, response);
};