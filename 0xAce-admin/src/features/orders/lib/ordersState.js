import { formatDate, formatMoney } from "../../../shared/lib/formatters";

export const ORDER_STATUSES = [
  "unfulfilled",
  "packed",
  "shipped",
  "delivered",
  "returned",
];

const STATUS_LABELS = {
  unfulfilled: "Unfulfilled",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  returned: "Returned",
};

function parseAddress(addressJson) {
  if (!addressJson) {
    return null;
  }

  if (typeof addressJson === "object") {
    return addressJson;
  }

  try {
    return JSON.parse(addressJson);
  } catch {
    return null;
  }
}

function buildAddressSummary(address) {
  if (!address) {
    return "No shipping address";
  }

  return [address.city, address.state, address.country].filter(Boolean).join(", ");
}

function buildFullAddress(address) {
  if (!address) {
    return "No shipping address available.";
  }

  return [
    address.line1,
    address.line2,
    [address.city, address.state, address.postal_code].filter(Boolean).join(" "),
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

function groupItemsByOrder(sourceOrderItems = []) {
  return sourceOrderItems.reduce((itemsByOrderId, item) => {
    const items = itemsByOrderId.get(item.order_id) ?? [];

    items.push({
      ...item,
      lineTotalFormatted: formatMoney(item.line_total_aud),
      unitPriceFormatted: formatMoney(item.unit_price_aud),
    });
    itemsByOrderId.set(item.order_id, items);
    return itemsByOrderId;
  }, new Map());
}

function normalizeMoneyInput(value) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return "0.00";
  }

  return parsedValue.toFixed(2);
}

function createOrderId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `manual-order-${Date.now()}`;
}

export function getStatusLabel(status) {
  return STATUS_LABELS[status] ?? status;
}

export function buildOrder(order, itemsByOrderId = groupItemsByOrder()) {
  const items = itemsByOrderId.get(order.id) ?? [];
  const shippingAddress = parseAddress(order.shipping_address_json);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const shortId = order.id.slice(0, 8).toUpperCase();

  return {
    ...order,
    items,
    shortId,
    itemCount,
    leadItem: items[0]?.product_name ?? "No items",
    itemPreview: items.length
      ? items
          .slice(0, 2)
          .map((item) => `${item.product_name}${item.variant_label ? ` (${item.variant_label})` : ""}`)
          .join(" • ")
      : "No items",
    createdAtFormatted: formatDate(order.created_at),
    shippedAtFormatted: order.shipped_at ? formatDate(order.shipped_at) : "Not shipped",
    receiptSentAtFormatted: order.receipt_sent_at ? formatDate(order.receipt_sent_at) : "Pending",
    subtotalFormatted: formatMoney(order.subtotal_aud),
    shippingFormatted: formatMoney(order.shipping_aud),
    totalFormatted: formatMoney(order.total_aud),
    shippingAddress,
    shippingAddressSummary: buildAddressSummary(shippingAddress),
    shippingAddressFull: buildFullAddress(shippingAddress),
    statusLabel: getStatusLabel(order.fulfillment_status),
  };
}

export function buildOrders(sourceOrders = [], sourceOrderItems = []) {
  const itemsByOrderId = groupItemsByOrder(sourceOrderItems);

  return [...sourceOrders]
    .sort((left, right) => new Date(right.created_at) - new Date(left.created_at))
    .map((order) => buildOrder(order, itemsByOrderId));
}

export function getOrders() {
  return buildOrders();
}

export function getOrderById(orderId) {
  return getOrders().find((order) => order.id === orderId) ?? null;
}

export function cloneOrderDraft(order) {
  return {
    id: order.id,
    idx: order.idx,
    stripe_checkout_session_id: order.stripe_checkout_session_id,
    stripe_payment_intent_id: order.stripe_payment_intent_id,
    customer_email: order.customer_email ?? "",
    shipping_name: order.shipping_name ?? "",
    shippingAddress: {
      line1: order.shippingAddress?.line1 ?? "",
      line2: order.shippingAddress?.line2 ?? "",
      city: order.shippingAddress?.city ?? "",
      state: order.shippingAddress?.state ?? "",
      postal_code: order.shippingAddress?.postal_code ?? "",
      country: order.shippingAddress?.country ?? "",
    },
    subtotal_aud: order.subtotal_aud ?? "0.00",
    shipping_aud: order.shipping_aud ?? "0.00",
    total_aud: order.total_aud ?? "0.00",
    currency: order.currency ?? "AUD",
    payment_status: order.payment_status ?? "paid",
    fulfillment_status: order.fulfillment_status ?? "unfulfilled",
    tracking_number: order.tracking_number ?? "",
    tracking_url: order.tracking_url ?? "",
    receipt_sent_at: order.receipt_sent_at ?? "",
    shipped_at: order.shipped_at ?? "",
    created_at: order.created_at,
  };
}

export function createEmptyOrderDraft(orderCount = 0) {
  const nextIndex = orderCount + 1;
  const createdAt = new Date().toISOString();

  return {
    id: createOrderId(),
    idx: nextIndex,
    stripe_checkout_session_id: `manual-session-${nextIndex}`,
    stripe_payment_intent_id: `manual-intent-${nextIndex}`,
    customer_email: "",
    shipping_name: "Manual order",
    shippingAddress: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "AU",
    },
    subtotal_aud: "0.00",
    shipping_aud: "0.00",
    total_aud: "0.00",
    currency: "AUD",
    payment_status: "paid",
    fulfillment_status: "unfulfilled",
    tracking_number: "",
    tracking_url: "",
    receipt_sent_at: "",
    shipped_at: "",
    created_at: createdAt,
  };
}

export function serializeOrderDraft(orderDraft) {
  return {
    idx: orderDraft.idx,
    id: orderDraft.id,
    stripe_checkout_session_id: orderDraft.stripe_checkout_session_id,
    stripe_payment_intent_id: orderDraft.stripe_payment_intent_id,
    customer_email: orderDraft.customer_email.trim(),
    shipping_name: orderDraft.shipping_name.trim(),
    shipping_address_json: JSON.stringify({
      line1: orderDraft.shippingAddress.line1.trim(),
      line2: orderDraft.shippingAddress.line2.trim() || null,
      city: orderDraft.shippingAddress.city.trim(),
      state: orderDraft.shippingAddress.state.trim(),
      postal_code: orderDraft.shippingAddress.postal_code.trim(),
      country: orderDraft.shippingAddress.country.trim(),
    }),
    subtotal_aud: normalizeMoneyInput(orderDraft.subtotal_aud),
    shipping_aud: normalizeMoneyInput(orderDraft.shipping_aud),
    total_aud: normalizeMoneyInput(orderDraft.total_aud),
    currency: orderDraft.currency,
    payment_status: orderDraft.payment_status,
    fulfillment_status: orderDraft.fulfillment_status,
    tracking_number: orderDraft.tracking_number.trim() || null,
    tracking_url: orderDraft.tracking_url.trim() || null,
    receipt_sent_at: orderDraft.receipt_sent_at.trim() || null,
    shipped_at: orderDraft.shipped_at.trim() || null,
    created_at: orderDraft.created_at,
  };
}

export function matchesOrderSearch(order, query) {
  return [
    order.id,
    order.shortId,
    order.shipping_name,
    order.customer_email,
    order.fulfillment_status,
    order.statusLabel,
    order.shippingAddressSummary,
    ...order.items.flatMap((item) => [item.product_name, item.variant_label, item.sku]),
  ]
    .join(" ")
    .toLowerCase()
    .includes(query);
}